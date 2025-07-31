const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const User = require('../models/User');
const Book = require('../models/book');
const { authenticateToken, requireCustomer, requireSeller, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Validation middleware
const validateOrderCreation = [
  body('shippingAddress.fullName').trim().notEmpty().withMessage('Full name is required'),
  body('shippingAddress.street').trim().notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').trim().notEmpty().withMessage('ZIP code is required'),
  body('shippingAddress.country').trim().notEmpty().withMessage('Country is required'),
  body('paymentMethod.type').isIn(['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery']).withMessage('Valid payment method is required'),
];

// Create new order from cart
router.post('/create', authenticateToken, requireCustomer, validateOrderCreation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { shippingAddress, paymentMethod, notes } = req.body;

    // Get user's cart
    const user = await User.findById(req.user._id)
      .populate({
        path: 'cart.book',
        select: 'bookTitle price originalPrice stock isDigital seller'
      });

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate cart items and calculate totals
    const orderItems = [];
    let subtotal = 0;
    const stockUpdates = [];

    for (const cartItem of user.cart) {
      const book = cartItem.book;
      const quantity = cartItem.quantity;

      if (!book || !book.isActive) {
        return res.status(400).json({
          success: false,
          message: `Book "${book?.bookTitle || 'Unknown'}" is no longer available`
        });
      }

      // Check stock for physical books
      if (!book.isDigital && book.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${book.bookTitle}". Only ${book.stock} available.`
        });
      }

      const itemSubtotal = book.price * quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        book: book._id,
        seller: book.seller,
        quantity: quantity,
        price: book.price,
        discount: book.originalPrice ? (book.originalPrice - book.price) * quantity : 0,
        subtotal: itemSubtotal
      });

      // Prepare stock update for physical books
      if (!book.isDigital) {
        stockUpdates.push({
          bookId: book._id,
          newStock: book.stock - quantity
        });
      }
    }

    // Calculate tax and shipping
    const taxRate = 0.08; // 8% tax
    const tax = subtotal * taxRate;
    const shippingCost = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const total = subtotal + tax + shippingCost;

    // Create order
    const order = new Order({
      customer: req.user._id,
      items: orderItems,
      orderSummary: {
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        shipping: parseFloat(shippingCost.toFixed(2)),
        total: parseFloat(total.toFixed(2))
      },
      shippingAddress,
      paymentMethod,
      notes: {
        customer: notes
      },
      status: 'pending'
    });

    await order.save();

    // Update book stock
    for (const update of stockUpdates) {
      await Book.findByIdAndUpdate(update.bookId, { 
        $inc: { stock: -update.quantity, totalSales: update.quantity }
      });
    }

    // Clear user's cart
    user.cart = [];
    await user.save();

    // Populate order for response
    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'firstName lastName email')
      .populate({
        path: 'items.book',
        select: 'bookTitle imageURL'
      })
      .populate({
        path: 'items.seller',
        select: 'firstName lastName sellerInfo.businessName'
      });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order: populatedOrder }
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// Get user's orders
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const filter = { customer: req.user._id };
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate({
        path: 'items.book',
        select: 'bookTitle imageURL'
      })
      .populate({
        path: 'items.seller',
        select: 'firstName lastName sellerInfo.businessName'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// Get single order by ID
router.get('/:orderId', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('customer', 'firstName lastName email')
      .populate({
        path: 'items.book',
        select: 'bookTitle imageURL authorName'
      })
      .populate({
        path: 'items.seller',
        select: 'firstName lastName sellerInfo.businessName'
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order or is admin/seller
    const canView = 
      order.customer._id.toString() === req.user._id.toString() ||
      req.user.role === 'admin' ||
      (req.user.role === 'seller' && order.items.some(item => 
        item.seller._id.toString() === req.user._id.toString()
      ));

    if (!canView) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Order fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
});

// Update order status (sellers and admins)
router.put('/:orderId/status', authenticateToken, requireSeller, async (req, res) => {
  try {
    const { status, note, trackingNumber, carrier } = req.body;
    const orderId = req.params.orderId;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user can update this order
    const canUpdate = 
      req.user.role === 'admin' ||
      (req.user.role === 'seller' && order.items.some(item => 
        item.seller.toString() === req.user._id.toString()
      ));

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update order status
    order.updateStatus(status, note, req.user._id);

    // Update tracking info if provided
    if (trackingNumber) {
      order.tracking.trackingNumber = trackingNumber;
    }
    if (carrier) {
      order.tracking.carrier = carrier;
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Order status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
});

// Cancel order (customers can cancel pending orders)
router.put('/:orderId/cancel', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order
    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Only allow cancellation of pending or confirmed orders
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Restore stock for cancelled items
    for (const item of order.items) {
      const book = await Book.findById(item.book);
      if (book && !book.isDigital) {
        await Book.findByIdAndUpdate(item.book, { 
          $inc: { stock: item.quantity, totalSales: -item.quantity }
        });
      }
    }

    order.updateStatus('cancelled', 'Cancelled by customer', req.user._id);
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Order cancellation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
});

// Get seller's orders
router.get('/seller/orders', authenticateToken, requireSeller, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const filter = { 'items.seller': req.user._id };
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('customer', 'firstName lastName email')
      .populate({
        path: 'items.book',
        select: 'bookTitle imageURL'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments(filter);

    // Calculate seller-specific summary
    const summary = await Order.aggregate([
      { $match: { 'items.seller': req.user._id } },
      { $unwind: '$items' },
      { $match: { 'items.seller': req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: { $sum: '$items.subtotal' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
        },
        summary
      }
    });
  } catch (error) {
    console.error('Seller orders fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch seller orders',
      error: error.message
    });
  }
});

// Admin: Get all orders
router.get('/admin/all-orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, seller, customer } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (status) filter.status = status;
    if (seller) filter['items.seller'] = seller;
    if (customer) filter.customer = customer;

    const orders = await Order.find(filter)
      .populate('customer', 'firstName lastName email')
      .populate({
        path: 'items.book',
        select: 'bookTitle imageURL'
      })
      .populate({
        path: 'items.seller',
        select: 'firstName lastName sellerInfo.businessName'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments(filter);

    // Get overall statistics
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$orderSummary.total' },
          averageOrderValue: { $avg: '$orderSummary.total' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
        },
        statistics: stats[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0
        }
      }
    });
  } catch (error) {
    console.error('Admin orders fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

module.exports = router;