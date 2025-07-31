import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ShoppingCart } from 'lucide-react';

const Shop = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/books");
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
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

  return (
    <div className='mt-28 px-4 lg:px-24'>
      <h2 className='text-5xl font-bold text-center mb-12'>All Books are Here</h2>

      <div className='grid gap-8 my-12 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1'> 
        {books.map((book) => (
          <Card key={book._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <img 
                src={book.imageURL} 
                alt={book.bookTitle}
                className='h-96 w-full object-cover'
              />
            </CardHeader>
            <CardContent className="p-6">
              <CardTitle className="text-xl font-bold mb-2">
                {book.bookTitle}
              </CardTitle>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {book.description || "Discover this amazing book and dive into a world of knowledge and imagination."}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">
                  ${book.price}
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
    </div>
  );
};

export default Shop;
