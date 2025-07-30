const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Book schema
const bookSchema = new Schema({
  bookTitle: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  imageURL: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  bookDescription: {
    type: String,
    required: true
  },
  bookPDFURL: {
    type: String,
    required: true
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
});

// Create the Book model
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
