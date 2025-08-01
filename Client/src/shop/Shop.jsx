import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ShoppingCart } from 'lucide-react';

const Shop = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Use relative path for Vercel deployment or environment variable for development
        const apiUrl = import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5001/api');
        const response = await fetch(`${apiUrl}/books`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        
        const data = await response.json();
        // Handle the API response structure correctly
        if (data.success && data.data && data.data.books) {
          setBooks(data.data.books);
        } else if (Array.isArray(data)) {
          setBooks(data);
        } else {
          setBooks([]);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="mt-28 px-4 lg:px-24">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-28 px-4 lg:px-24">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-500 text-center">
            <h2 className="text-2xl font-bold mb-4">Error Loading Books</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='mt-28 px-4 lg:px-24'>
      <h2 className='text-5xl font-bold text-center mb-12'>All Books are Here</h2>

      {books.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">No Books Available</h3>
            <p className="text-gray-600">Check back later for new books!</p>
          </div>
        </div>
      ) : (
        <div className='grid gap-8 my-12 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1'> 
          {books.map((book) => (
            <Card key={book._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <img 
                  src={book.imageURL ? (book.imageURL.startsWith('http') ? book.imageURL : `/${book.imageURL}`) : '/placeholder-book.jpg'}
                  alt={book.bookTitle || 'Book'}
                  className='h-96 w-full object-cover'
                  onError={(e) => {
                    e.target.src = '/placeholder-book.jpg';
                  }}
                />
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl font-bold mb-2">
                  {book.bookTitle || 'Untitled Book'}
                </CardTitle>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {book.description || "Discover this amazing book and dive into a world of knowledge and imagination."}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">
                    ${book.price || '0.00'}
                  </span>
                  <Button className="flex items-center space-x-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Buy Now</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
