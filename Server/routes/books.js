const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Book = require('../models/book');
const Review = require('../models/Review');
const { authenticateToken, requireSeller, optionalAuth } = require('../middleware/auth');
const router = express.Router();

// Validation middleware
const validateBook = [
  body('bookTitle').trim().notEmpty().withMessage('Book title is required'),
  body('authorName').trim().notEmpty().withMessage('Author name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('bookDescription').trim().notEmpty().withMessage('Book description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('imageURL').isURL().withMessage('Valid image URL is required'),
];

// Get all books with advanced filtering and pagination
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      author,
      search,
      sort = 'createdAt',
      order = 'desc',
      featured,
      inStock
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (category && category !== 'all') {
      filter.category = new RegExp(category, 'i');
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (author) {
      filter.authorName = new RegExp(author, 'i');
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    if (inStock === 'true') {
      filter.$or = [
        { isDigital: true },
        { stock: { $gt: 0 } }
      ];
    }

    // Build sort object
    const sortOrder = order === 'desc' ? -1 : 1;
    let sortObj = {};
    
    switch (sort) {
      case 'price':
        sortObj.price = sortOrder;
        break;
      case 'rating':
        sortObj.averageRating = sortOrder;
        break;
      case 'popularity':
        sortObj.totalSales = sortOrder;
        break;
      case 'title':
        sortObj.bookTitle = sortOrder;
        break;
      default:
        sortObj.createdAt = sortOrder;
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const books = await Book.find(filter)
      .populate('seller', 'firstName lastName sellerInfo.businessName')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Book.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    // Get categories for filter dropdown
    const categories = await Book.distinct('category', { isActive: true });

    res.json({
      success: true,
      data: {
        books,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        },
        filters: {
          categories: categories.sort()
        }
      }
    });
  } catch (error) {
    console.error('Books fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch books',
      error: error.message
    });
  }
});

// Get single book by ID with reviews
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('seller', 'firstName lastName sellerInfo.businessName');

    if (!book || !book.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Increment view count
    await Book.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    // Get reviews for this book
    const reviews = await Review.find({ book: req.params.id, status: 'approved' })
      .populate('customer', 'firstName lastName profileImage')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get related books (same category)
    const relatedBooks = await Book.find({
      category: book.category,
      _id: { $ne: book._id },
      isActive: true
    })
      .limit(6)
      .sort({ averageRating: -1 });

    res.json({
      success: true,
      data: {
        book,
        reviews,
        relatedBooks
      }
    });
  } catch (error) {
    console.error('Book fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch book',
      error: error.message
    });
  }
});

// Create new book (sellers and admins only)
router.post('/', authenticateToken, requireSeller, validateBook, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const bookData = {
      ...req.body,
      seller: req.user._id
    };

    const book = new Book(bookData);
    await book.save();

    const populatedBook = await Book.findById(book._id)
      .populate('seller', 'firstName lastName sellerInfo.businessName');

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: { book: populatedBook }
    });
  } catch (error) {
    console.error('Book creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create book',
      error: error.message
    });
  }
});

// Update book (sellers can update their own books, admins can update all)
router.put('/:id', authenticateToken, requireSeller, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if user owns the book or is admin
    if (req.user.role !== 'admin' && book.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own books'
      });
    }

    // Filter allowed updates
    const allowedUpdates = [
      'bookTitle', 'authorName', 'imageURL', 'additionalImages', 'category', 
      'subcategory', 'bookDescription', 'bookPDFURL', 'price', 'originalPrice',
      'stock', 'isDigital', 'publisher', 'publicationDate', 'language', 
      'pages', 'format', 'dimensions', 'featured', 'isActive', 'tags',
      'metaTitle', 'metaDescription'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('seller', 'firstName lastName sellerInfo.businessName');

    res.json({
      success: true,
      message: 'Book updated successfully',
      data: { book: updatedBook }
    });
  } catch (error) {
    console.error('Book update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update book',
      error: error.message
    });
  }
});

// Delete book (sellers can delete their own books, admins can delete all)
router.delete('/:id', authenticateToken, requireSeller, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if user owns the book or is admin
    if (req.user.role !== 'admin' && book.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own books'
      });
    }

    // Soft delete by setting isActive to false
    await Book.findByIdAndUpdate(req.params.id, { isActive: false });

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Book deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete book',
      error: error.message
    });
  }
});

// Get books by seller
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const books = await Book.find({ 
      seller: req.params.sellerId, 
      isActive: true 
    })
      .populate('seller', 'firstName lastName sellerInfo.businessName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Book.countDocuments({ 
      seller: req.params.sellerId, 
      isActive: true 
    });

    res.json({
      success: true,
      data: {
        books,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Seller books fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch seller books',
      error: error.message
    });
  }
});

// Get my books (for sellers)
router.get('/my/books', authenticateToken, requireSeller, async (req, res) => {
  try {
    const { page = 1, limit = 12, status } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const filter = { seller: req.user._id };
    if (status) {
      filter.isActive = status === 'active';
    }

    const books = await Book.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Book.countDocuments(filter);

    // Get sales summary
    const salesSummary = await Book.aggregate([
      { $match: { seller: req.user._id } },
      {
        $group: {
          _id: null,
          totalBooks: { $sum: 1 },
          totalSales: { $sum: '$totalSales' },
          activeBooks: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          totalRevenue: {
            $sum: { $multiply: ['$totalSales', '$price'] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        books,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
        },
        summary: salesSummary[0] || {
          totalBooks: 0,
          totalSales: 0,
          activeBooks: 0,
          totalRevenue: 0
        }
      }
    });
  } catch (error) {
    console.error('My books fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your books',
      error: error.message
    });
  }
});

// Search books with advanced text search
router.get('/search/advanced', async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const filter = {
      isActive: true,
      $text: { $search: q }
    };

    if (category && category !== 'all') {
      filter.category = new RegExp(category, 'i');
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const books = await Book.find(filter, { score: { $meta: 'textScore' } })
      .populate('seller', 'firstName lastName sellerInfo.businessName')
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(limitNum);

    const total = await Book.countDocuments(filter);

    res.json({
      success: true,
      data: {
        books,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
        },
        query: q
      }
    });
  } catch (error) {
    console.error('Advanced search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
});

module.exports = router;