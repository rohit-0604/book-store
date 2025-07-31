import React from 'react';
import { ShoppingCart } from 'lucide-react';

const BookCards = ({ book, onAddToCart }) => (
  <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col">
    <img src={book.imageURL} alt={book.bookTitle} className="h-48 w-full object-cover rounded mb-4" />
    <h3 className="text-lg font-bold mb-2">{book.bookTitle}</h3>
    <p className="text-gray-600 mb-4 line-clamp-2">{book.description}</p>
    <div className="flex items-center justify-between mt-auto">
      <span className="text-xl font-bold text-blue-600">${book.price}</span>
      <button
        onClick={() => onAddToCart(book)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
      >
        <ShoppingCart className="h-4 w-4" /> Add to Cart
      </button>
    </div>
  </div>
);

export default BookCards;
