const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the enhanced Book schema
const bookSchema = new Schema({
  bookTitle: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  authorName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  imageURL: {
    type: String,
    required: true
  },
  additionalImages: [String],
  category: {
    type: String,
    required: true,
    index: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  bookDescription: {
    type: String,
    required: true
  },
  bookPDFURL: {
    type: String,
    required: false // Made optional for physical books
  },
  // Pricing and inventory
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  isDigital: {
    type: Boolean,
    default: false
  },
  // Seller information
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Book details
  publisher: {
    type: String,
    trim: true
  },
  publicationDate: {
    type: Date
  },
  language: {
    type: String,
    default: 'English'
  },
  pages: {
    type: Number,
    min: 1
  },
  format: {
    type: String,
    enum: ['hardcover', 'paperback', 'ebook', 'audiobook'],
    default: 'paperback'
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number
  },
  // Features and status
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Rating and reviews
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  // SEO and search
  tags: [String],
  metaTitle: String,
  metaDescription: String,
  // Sales data
  totalSales: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better performance
bookSchema.index({ bookTitle: 'text', authorName: 'text', category: 'text', tags: 'text' });
bookSchema.index({ price: 1 });
bookSchema.index({ averageRating: -1 });
bookSchema.index({ createdAt: -1 });
bookSchema.index({ featured: -1, averageRating: -1 });

// Virtual for discount percentage
bookSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for availability status
bookSchema.virtual('availabilityStatus').get(function() {
  if (this.isDigital) return 'Available';
  if (this.stock === 0) return 'Out of Stock';
  if (this.stock <= 5) return 'Limited Stock';
  return 'In Stock';
});

// Pre-save middleware to calculate original price if not set
bookSchema.pre('save', function(next) {
  if (!this.originalPrice) {
    this.originalPrice = this.price;
  }
  next();
});

// Ensure virtual fields are serialized
bookSchema.set('toJSON', { virtuals: true });

// Create the Book model
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
