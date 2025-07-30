const express = require('express');
const Cart = require('../models/cart');
const Book = require('../models/book');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const router = express.Router();

// Get current user's cart (auto create if not exist)
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ owner: req.user._id }).populate('items.book');
    if (!cart) {
      cart = await Cart.create({ owner: req.user._id, items: [] });
    }
    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Failed to get cart' });
  }
});

// Add item to cart
router.post('/add', protect, async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    let cart = await Cart.findOne({ owner: req.user._id });
    if (!cart) cart = await Cart.create({ owner: req.user._id, items: [] });

    const existingItem = cart.items.find((item) => item.book.toString() === bookId);
    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ book: bookId, quantity: quantity || 1 });
    }
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add to cart' });
  }
});

// Remove item
router.post('/remove', protect, async (req, res) => {
  try {
    const { bookId } = req.body;
    let cart = await Cart.findOne({ owner: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter((item) => item.book.toString() !== bookId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove from cart' });
  }
});

// Clear cart (checkout placeholder)
router.post('/checkout', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ owner: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    // TODO: handle payment integration
    cart.items = [];
    await cart.save();
    res.json({ message: 'Checkout success' });
  } catch (error) {
    res.status(500).json({ message: 'Checkout failed' });
  }
});

module.exports = router;