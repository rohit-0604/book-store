const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Book = require('../models/book');
const { authenticateToken, requireCustomer } = require('../middleware/auth');
const router = express.Router();

// Validation middleware
const validateCartItem = [
  body('bookId').isMongoId().withMessage('Valid book ID is required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
];

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'cart.book',
        select: 'bookTitle price originalPrice imageURL stock isDigital seller availabilityStatus discountPercentage',
        populate: {
          path: 'seller',
          select: 'firstName lastName sellerInfo.businessName'
        }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Filter out books that are no longer available or inactive
    const validCartItems = user.cart.filter(item => 
      item.book && item.book.isActive !== false
    );

    // Calculate cart summary
    let subtotal = 0;
    let totalItems = 0;
    let hasUnavailableItems = false;

    const cartItems = validCartItems.map(item => {
      const book = item.book;
      const quantity = item.quantity;
      const itemSubtotal = book.price * quantity;
      
      subtotal += itemSubtotal;
      totalItems += quantity;

      // Check availability
      const isAvailable = book.isDigital || book.stock >= quantity;
      if (!isAvailable) {
        hasUnavailableItems = true;
      }

      return {
        _id: item._id,
        book: book,
        quantity: quantity,
        itemSubtotal: itemSubtotal,
        isAvailable: isAvailable,
        addedAt: item.addedAt
      };
    });

    // Calculate tax and shipping (can be customized based on business logic)
    const taxRate = 0.08; // 8% tax
    const tax = subtotal * taxRate;
    const shippingCost = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const total = subtotal + tax + shippingCost;

    res.json({
      success: true,
      data: {
        cart: {
          items: cartItems,
          summary: {
            totalItems,
            subtotal: parseFloat(subtotal.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            shipping: parseFloat(shippingCost.toFixed(2)),
            total: parseFloat(total.toFixed(2)),
            hasUnavailableItems
          }
        }
      }
    });
  } catch (error) {
    console.error('Cart fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error.message
    });
  }
});

// Add item to cart
router.post('/add', authenticateToken, validateCartItem, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { bookId, quantity = 1 } = req.body;

    // Check if book exists and is active
    const book = await Book.findById(bookId);
    if (!book || !book.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Book not found or not available'
      });
    }

    // Check stock availability for physical books
    if (!book.isDigital && book.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${book.stock} items available in stock`
      });
    }

    const user = await User.findById(req.user._id);
    
    // Check if item already exists in cart
    const existingCartItem = user.cart.find(item => 
      item.book.toString() === bookId
    );

    if (existingCartItem) {
      // Update quantity
      const newQuantity = existingCartItem.quantity + quantity;
      
      // Check stock again for new quantity
      if (!book.isDigital && book.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${book.stock} items available in stock`
        });
      }

      existingCartItem.quantity = newQuantity;
      existingCartItem.addedAt = new Date();
    } else {
      // Add new item to cart
      user.cart.push({
        book: bookId,
        quantity: quantity,
        addedAt: new Date()
      });
    }

    await user.save();

    // Populate the cart and return updated cart
    const updatedUser = await User.findById(req.user._id)
      .populate({
        path: 'cart.book',
        select: 'bookTitle price imageURL stock isDigital availabilityStatus'
      });

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: {
        cart: updatedUser.cart
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
});

// Update cart item quantity
router.put('/update/:itemId', authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const user = await User.findById(req.user._id);
    const cartItem = user.cart.id(itemId);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Get book details to check stock
    const book = await Book.findById(cartItem.book);
    if (!book || !book.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Book not found or not available'
      });
    }

    // Check stock availability for physical books
    if (!book.isDigital && book.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${book.stock} items available in stock`
      });
    }

    cartItem.quantity = quantity;
    cartItem.addedAt = new Date();
    
    await user.save();

    res.json({
      success: true,
      message: 'Cart item updated successfully'
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart item',
      error: error.message
    });
  }
});

// Remove item from cart
router.delete('/remove/:itemId', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.params;

    const user = await User.findById(req.user._id);
    const cartItem = user.cart.id(itemId);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    cartItem.remove();
    await user.save();

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error.message
    });
  }
});

// Clear entire cart
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $set: { cart: [] } });

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
});

// Move item to wishlist
router.post('/move-to-wishlist/:itemId', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.params;

    const user = await User.findById(req.user._id);
    const cartItem = user.cart.id(itemId);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    const bookId = cartItem.book;

    // Check if book is already in wishlist
    if (!user.wishlist.includes(bookId)) {
      user.wishlist.push(bookId);
    }

    // Remove from cart
    cartItem.remove();
    await user.save();

    res.json({
      success: true,
      message: 'Item moved to wishlist successfully'
    });
  } catch (error) {
    console.error('Move to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to move item to wishlist',
      error: error.message
    });
  }
});

// Apply coupon code (placeholder for future implementation)
router.post('/apply-coupon', authenticateToken, async (req, res) => {
  try {
    const { couponCode } = req.body;

    // Placeholder - implement coupon logic here
    res.json({
      success: false,
      message: 'Coupon functionality will be implemented soon'
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to apply coupon',
      error: error.message
    });
  }
});

// Get cart item count
router.get('/count', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const totalItems = user.cart.reduce((total, item) => total + item.quantity, 0);

    res.json({
      success: true,
      data: {
        count: totalItems
      }
    });
  } catch (error) {
    console.error('Cart count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cart count',
      error: error.message
    });
  }
});

module.exports = router;