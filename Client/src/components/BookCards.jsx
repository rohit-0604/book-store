import React from 'react';
import { ShoppingCart } from 'lucide-react';

const BookCards = ({ book, books, onAddToCart, headLine }) => {
  // Handle both single book and books array
  const bookData = book || (books && books.length > 0 ? books[0] : null);
  
  if (!bookData) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col">
        <div className="h-48 w-full bg-gray-200 rounded mb-4 flex items-center justify-center">
          <span className="text-gray-500">No book data available</span>
        </div>
        <h3 className="text-lg font-bold mb-2">Book Title</h3>
        <p className="text-gray-600 mb-4">No description available</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-blue-600">$0.00</span>
          <button
            disabled
            className="bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-not-allowed"
          >
            <ShoppingCart className="h-4 w-4" /> Add to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col">
      <img 
        src={bookData.imageURL && bookData.imageURL.startsWith('http') 
          ? bookData.imageURL 
          : bookData.imageURL 
            ? `/${bookData.imageURL}` 
            : '/book1.png'
        }
        alt={bookData.bookTitle || 'Book'} 
        className="h-48 w-full object-cover rounded mb-4" 
        onError={(e) => {
          // Fallback to available public images
          const fallbacks = ['/book1.png', '/book2.png', '/book3.png', '/book4.png', '/book5.png'];
          const currentSrc = e.target.src;
          const currentIndex = fallbacks.findIndex(img => currentSrc.includes(img));
          if (currentIndex < fallbacks.length - 1) {
            e.target.src = fallbacks[currentIndex + 1];
          }
        }}
      />
      <h3 className="text-lg font-bold mb-2">{bookData.bookTitle || 'Untitled Book'}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{bookData.description || 'No description available'}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-xl font-bold text-blue-600">${bookData.price || '0.00'}</span>
        <button
          onClick={() => onAddToCart && onAddToCart(bookData)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <ShoppingCart className="h-4 w-4" /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default BookCards;
