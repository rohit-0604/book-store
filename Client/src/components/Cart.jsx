import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaHeart } from 'react-icons/fa';
import { MdShoppingCartCheckout } from 'react-icons/md';
import useCartStore from '../stores/cartStore';
import useAuthStore from '../stores/authStore';
import toast from 'react-hot-toast';

const Cart = () => {
  const { isAuthenticated } = useAuthStore();
  const {
    cart,
    isLoading,
    isSubmitting,
    fetchCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    moveToWishlist
  } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaShoppingBag className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sign in to view your cart</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to add items to your cart.</p>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-4">
                <div className="h-20 w-16 bg-gray-300 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaShoppingBag className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Start shopping to add items to your cart.</p>
          <Link
            to="/shop"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId) => {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
      await removeFromCart(itemId);
    }
  };

  const handleMoveToWishlist = async (itemId) => {
    await moveToWishlist(itemId);
  };

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    if (cart.summary.hasUnavailableItems) {
      toast.error('Please remove unavailable items before proceeding to checkout');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Shopping Cart ({cart.summary.totalItems} items)
          </h1>
          {cart.items.length > 0 && (
            <button
              onClick={handleClearCart}
              disabled={isSubmitting}
              className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
            >
              Clear Cart
            </button>
          )}
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Cart Items */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Items in your cart</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <div key={item._id} className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Book Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.book.imageURL}
                          alt={item.book.bookTitle}
                          className="h-24 w-16 object-cover rounded-lg"
                        />
                      </div>

                      {/* Book Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link
                              to={`/book/${item.book._id}`}
                              className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                            >
                              {item.book.bookTitle}
                            </Link>
                            {item.book.seller && (
                              <p className="text-sm text-gray-500 mt-1">
                                Sold by: {item.book.seller.sellerInfo?.businessName || 
                                        `${item.book.seller.firstName} ${item.book.seller.lastName}`}
                              </p>
                            )}
                            <div className="flex items-center mt-2">
                              <span className="text-lg font-semibold text-gray-900">
                                ${item.book.price.toFixed(2)}
                              </span>
                              {item.book.originalPrice && item.book.originalPrice > item.book.price && (
                                <span className="ml-2 text-sm text-gray-500 line-through">
                                  ${item.book.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            disabled={isSubmitting}
                            className="text-red-400 hover:text-red-600 disabled:opacity-50"
                          >
                            <FaTrash />
                          </button>
                        </div>

                        {/* Availability Status */}
                        <div className="mt-2">
                          {item.isAvailable ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              In Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Out of Stock
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls and Actions */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-500">Quantity:</span>
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || isSubmitting}
                                className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <FaMinus className="text-xs" />
                              </button>
                              <span className="px-3 py-2 text-sm font-medium">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                disabled={isSubmitting}
                                className="p-2 hover:bg-gray-50 disabled:opacity-50"
                              >
                                <FaPlus className="text-xs" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => handleMoveToWishlist(item._id)}
                              disabled={isSubmitting}
                              className="flex items-center text-sm text-gray-500 hover:text-red-500 disabled:opacity-50 transition-colors"
                            >
                              <FaHeart className="mr-1" />
                              Save for later
                            </button>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-gray-900">
                                ${item.itemSubtotal.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                to="/shop"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cart.summary.totalItems} items)</span>
                  <span className="font-medium">${cart.summary.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {cart.summary.shipping === 0 ? 'Free' : `$${cart.summary.shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${cart.summary.tax.toFixed(2)}</span>
                </div>

                {cart.summary.shipping === 0 && cart.summary.subtotal < 50 && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Add ${(50 - cart.summary.subtotal).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${cart.summary.total.toFixed(2)}</span>
                  </div>
                </div>

                {cart.summary.hasUnavailableItems && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700">
                      Some items in your cart are no longer available. Please remove them to continue.
                    </p>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={cart.summary.hasUnavailableItems || isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
                >
                  <MdShoppingCartCheckout className="mr-2" />
                  Proceed to Checkout
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Secure checkout powered by SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;