import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Minus, 
  Plus,
  BookOpen,
  Calendar,
  User,
  Tag,
  Eye,
  MessageCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const SingleBook = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/books/${id}`);
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error('Error fetching book:', error);
        toast.error('Failed to load book details');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    const result = await addToCart(book, quantity);
    if (result.success) {
      toast.success('Added to cart successfully!');
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="mt-28 px-4 lg:px-24 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="mt-28 px-4 lg:px-24 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Book Not Found</h2>
          <p className="text-gray-600">The book you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-28 px-4 lg:px-24 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Book Image */}
        <div className="space-y-6">
          <div className="relative">
            <img
              src={book.imageURL && book.imageURL.startsWith('http') ? book.imageURL : `/${book.imageURL}`}
              alt={book.bookTitle}
              className="w-full h-auto rounded-lg shadow-lg"
            />
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button variant="ghost" size="icon" className="bg-white/80 hover:bg-white">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="bg-white/80 hover:bg-white">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Thumbnail Images */}
          <div className="flex space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <img
                key={i}
                src={book.imageURL && book.imageURL.startsWith('http') ? book.imageURL : `/${book.imageURL}`}
                alt={`${book.bookTitle} ${i}`}
                className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 hover:border-blue-500 cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Book Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{book.bookTitle}</h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
            
            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= (book.rating || 4) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">({book.rating || 4}.0)</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">128 reviews</span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-blue-600 mb-6">
              ${book.price}
              <span className="text-lg text-gray-500 line-through ml-2">${(book.price * 1.2).toFixed(2)}</span>
            </div>
          </div>

          {/* Book Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-gray-500" />
              <span className="text-gray-600">Pages: {book.pages || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="text-gray-600">Published: {book.publishedDate || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-gray-600">Publisher: {book.publisher || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Tag className="h-5 w-5 text-gray-500" />
              <span className="text-gray-600">ISBN: {book.isbn || 'N/A'}</span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="px-3 py-1"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-4 py-2 text-center min-w-[3rem]">{quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 10}
                className="px-3 py-1"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button 
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center space-x-2"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Add to Cart</span>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="flex-1"
            >
              Buy Now
            </Button>
          </div>

          {/* Stock Status */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-800 font-medium">In Stock</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Usually ships within 2-3 business days
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'description', label: 'Description', icon: Eye },
              { id: 'details', label: 'Details', icon: BookOpen },
              { id: 'reviews', label: 'Reviews', icon: MessageCircle }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {book.description || 
                  "This is a compelling book that takes readers on an unforgettable journey. " +
                  "With rich characters, intricate plotlines, and beautiful prose, this book " +
                  "will keep you engaged from the first page to the last. Perfect for readers " +
                  "who enjoy thought-provoking literature that challenges perspectives and " +
                  "expands horizons."
                }
              </p>
            </div>
          )}

          {activeTab === 'details' && (
            <Card>
              <CardHeader>
                <CardTitle>Book Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Title</h4>
                    <p className="text-gray-600">{book.bookTitle}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Author</h4>
                    <p className="text-gray-600">{book.author}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Publisher</h4>
                    <p className="text-gray-600">{book.publisher || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Publication Date</h4>
                    <p className="text-gray-600">{book.publishedDate || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Pages</h4>
                    <p className="text-gray-600">{book.pages || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">ISBN</h4>
                    <p className="text-gray-600">{book.isbn || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
                <Button variant="outline">Write a Review</Button>
              </div>
              
              {/* Sample Reviews */}
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">U{i}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className="h-4 w-4 text-yellow-400 fill-current"
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">2 days ago</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">Great Book!</h4>
                        <p className="text-gray-600">
                          This book exceeded my expectations. The writing is beautiful and the story is captivating. 
                          Highly recommend to anyone who loves good literature.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleBook;
