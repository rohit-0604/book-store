const express = require('express');
const Book = require('../models/book');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const router = express.Router();

// Create book (seller or admin)
router.post('/', protect, authorizeRoles('seller', 'admin'), async (req, res) => {
  try {
    const { bookTitle, authorName, imageURL, category, bookDescription, bookPDFURL, price, stock } = req.body;
    const newBook = await Book.create({
      bookTitle,
      authorName,
      imageURL,
      category,
      bookDescription,
      bookPDFURL,
      price,
      stock,
      seller: req.user._id,
    });
    res.status(201).json(newBook);
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ message: 'Failed to create book' });
  }
});

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().populate('seller', 'name email');
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books' });
  }
});

// Get books by category
router.get('/category/:category', async (req, res) => {
  try {
    const books = await Book.find({ category: req.params.category });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch by category' });
  }
});

// Update book (seller or admin)
router.patch('/:id', protect, authorizeRoles('seller', 'admin'), async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    // Only seller owner or admin can edit
    if (!req.user.roles.includes('admin') && book.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this book' });
    }
    Object.assign(book, req.body);
    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update book' });
  }
});

// Delete book
router.delete('/:id', protect, authorizeRoles('seller', 'admin'), async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (!req.user.roles.includes('admin') && book.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this book' });
    }
    await book.remove();
    res.json({ message: 'Book removed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book' });
  }
});

module.exports = router;