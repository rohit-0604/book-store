const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Book = require('./models/book.js'); // Import the Book model
const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Configs
const uri = process.env.MONGO_URI || "mongodb+srv://AdminBook:TojikV87BfiG7L99@cluster0.9jkjolb.mongodb.net/?appName=Cluster0";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// API Routes

// Save the book to the database
app.post('/upload-book', async (req, res) => {
  try {
    const data = req.body;
    const book = new Book(data); // Create a new Book instance
    const result = await book.save(); 
    res.status(201).send(result); // Send 201 Created status
  } catch (error) {
    // Log the error to the server console
    console.error('Error saving book:', error);
    // Send an error response to the client
    res.status(500).send({ message: 'Failed to save book', error });
  }
});

// Find all books
app.get('/all-books', async (req, res) => {
  try {
    const books = await Book.find();
    res.send(books);
  } catch (error) {
    // Log the error to the server console
    console.error('Error fetching books:', error);
    // Send an error response to the client
    res.status(500).send({ message: 'Failed to fetch books', error });
  }
});

// Update book by ID
app.patch('/update-book/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updateBookData = req.body;
    const result = await Book.findByIdAndUpdate(id, updateBookData, { new: true, upsert: true }); 
    res.send(result);
  } catch (error) {
    // Log the error to the server console
    console.error('Error updating book:', error);
    // Send an error response to the client
    res.status(500).send({ message: 'Failed to update book', error });
  }
});

// Delete book by ID
app.delete('/delete-book/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Book.findByIdAndDelete(id); 
    res.send(result);
  } catch (error) {
    // Log the error to the server console
    console.error('Error deleting book:', error);
    // Send an error response to the client
    res.status(500).send({ message: 'Failed to delete book', error });
  }
});

// Find books by category
app.get('/books-by-category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const books = await Book.find({ category }); 
    res.send(books);
  } catch (error) {
    // Log the error to the server console
    console.error('Error finding books by category:', error);
    // Send an error response to the client
    res.status(500).send({ message: 'Failed to find books by category', error });
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
