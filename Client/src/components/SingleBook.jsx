import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart, FaShare, FaArrowLeft } from 'react-icons/fa';
import { booksAPI } from '../services/api';
import useAuthStore from '../stores/authStore';
import useCartStore from '../stores/cartStore';
import toast from 'react-hot-toast';

const SingleBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { addToCart } = useCartStore();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await booksAPI.getBook(id);
        setBook(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load book details');
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
      navigate('/login', { state: { from: `/book/${id}` } });
      return;
    }

    try {
      await addToCart({ bookId: id, quantity });
      toast.success('Book added to cart successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (book?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Book Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The book you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const averageRating = book.reviews?.length > 0 
    ? (book.reviews.reduce((sum, review) => sum + review.rating, 0) / book.reviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>

        {/* Book Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Book Image */}
            <div className="md:w-1/3 lg:w-1/4">
              <img
                src={book.imageURL}
                alt={book.bookTitle}
                className="w-full h-96 md:h-full object-cover"
              />
            </div>

            {/* Book Info */}
            <div className="md:w-2/3 lg:w-3/4 p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {book.bookTitle}
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  by {book.authorName}
                </p>
                
                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`w-5 h-5 ${
                          star <= averageRating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {averageRating} ({book.reviews?.length || 0} reviews)
                  </span>
                </div>

                {/* Price and Stock */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-3xl font-bold text-green-600">
                      ${book.price}
                    </span>
                    {book.originalPrice && book.originalPrice > book.price && (
                      <span className="ml-2 text-lg text-gray-500 line-through">
                        ${book.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${
                      book.stock > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>

                {/* Quantity and Add to Cart */}
                {book.stock > 0 && (
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="px-3 py-2 text-gray-600 hover:text-gray-800"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="px-3 py-2 text-gray-600 hover:text-gray-800"
                        disabled={quantity >= book.stock}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaShoppingCart className="mr-2" />
                      Add to Cart
                    </button>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center space-x-4">
                  <button className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
                    <FaHeart className="mr-2" />
                    Add to Wishlist
                  </button>
                  <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                    <FaShare className="mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200">
            <div className="flex border-b border-gray-200">
              {[
                { id: 'description', label: 'Description' },
                { id: 'details', label: 'Details' },
                { id: 'reviews', label: 'Reviews' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'description' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Book Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {book.description || 'No description available for this book.'}
                  </p>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Book Details
                    </h3>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Title</dt>
                        <dd className="text-sm text-gray-900">{book.bookTitle}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Author</dt>
                        <dd className="text-sm text-gray-900">{book.authorName}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Category</dt>
                        <dd className="text-sm text-gray-900">{book.category}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">ISBN</dt>
                        <dd className="text-sm text-gray-900">{book.isbn || 'N/A'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Publisher</dt>
                        <dd className="text-sm text-gray-900">{book.publisher || 'N/A'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Publication Date</dt>
                        <dd className="text-sm text-gray-900">{book.publicationDate || 'N/A'}</dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Seller Information
                    </h3>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Seller</dt>
                        <dd className="text-sm text-gray-900">{book.seller?.firstName} {book.seller?.lastName}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Stock</dt>
                        <dd className="text-sm text-gray-900">{book.stock} copies</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Condition</dt>
                        <dd className="text-sm text-gray-900">{book.condition || 'New'}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Customer Reviews
                  </h3>
                  {book.reviews && book.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {book.reviews.map((review, index) => (
                        <div key={index} className="border-b border-gray-200 pb-6">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <FaStar
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= review.rating
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="ml-2 text-sm text-gray-600">
                                {review.rating}/5
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">
                            {review.title}
                          </h4>
                          <p className="text-gray-700">{review.comment}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            - {review.user?.firstName} {review.user?.lastName}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No reviews yet. Be the first to review this book!</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBook;
