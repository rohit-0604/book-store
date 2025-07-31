import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, Lock, ArrowLeft } from 'lucide-react';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // The cart is no longer managed by Zustand, so this check is no longer relevant.
    // If you want to redirect if the cart is empty, you'd need to manage cart state elsewhere.
    // For now, removing the cart check as it's no longer available.
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate shipping address
    if (!formData.shippingAddress.street) {
      newErrors['shippingAddress.street'] = 'Street address is required';
    }
    if (!formData.shippingAddress.city) {
      newErrors['shippingAddress.city'] = 'City is required';
    }
    if (!formData.shippingAddress.state) {
      newErrors['shippingAddress.state'] = 'State is required';
    }
    if (!formData.shippingAddress.zipCode) {
      newErrors['shippingAddress.zipCode'] = 'ZIP code is required';
    }
    if (!formData.shippingAddress.country) {
      newErrors['shippingAddress.country'] = 'Country is required';
    }

    // Validate payment information
    if (!formData.cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    if (!formData.cardName) {
      newErrors.cardName = 'Cardholder name is required';
    }

    if (!formData.cardExpiry) {
      newErrors.cardExpiry = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
      newErrors.cardExpiry = 'Expiry date must be in MM/YY format';
    }

    if (!formData.cardCvv) {
      newErrors.cardCvv = 'CVV is required';
    } else if (formData.cardCvv.length !== 3) {
      newErrors.cardCvv = 'CVV must be 3 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: [], // Cart items are no longer available, so this will be empty
        shippingAddress: formData.shippingAddress,
        totalAmount: 0, // Cart total is no longer available
        paymentMethod: formData.paymentMethod
      };

      const response = await ordersAPI.createOrder(orderData);
      
      // Clear cart after successful order
      // No cart clearing logic as cart is no longer managed by Zustand
      
      toast.success('Order placed successfully!');
      navigate(`/order/${response.data.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // The cart.length === 0 check is no longer relevant as cart is no longer managed by Zustand.
  // If you want to show a message if the cart is empty, you'd need to manage cart state elsewhere.
  // For now, removing the cart check.

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft className="mr-2" />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <MapPin className="mr-2 text-blue-600" />
                    Shipping Information
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="shippingAddress.street"
                        value={formData.shippingAddress.street}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors['shippingAddress.street'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors['shippingAddress.street'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['shippingAddress.street']}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="shippingAddress.city"
                        value={formData.shippingAddress.city}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors['shippingAddress.city'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors['shippingAddress.city'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['shippingAddress.city']}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="shippingAddress.state"
                        value={formData.shippingAddress.state}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors['shippingAddress.state'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors['shippingAddress.state'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['shippingAddress.state']}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="shippingAddress.zipCode"
                        value={formData.shippingAddress.zipCode}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors['shippingAddress.zipCode'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors['shippingAddress.zipCode'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['shippingAddress.zipCode']}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        name="shippingAddress.country"
                        value={formData.shippingAddress.country}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors['shippingAddress.country'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors['shippingAddress.country'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['shippingAddress.country']}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <CreditCard className="mr-2 text-blue-600" />
                    Payment Information
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          setFormData(prev => ({ ...prev, cardNumber: formatted }));
                        }}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.cardNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.cardName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.cardName && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={(e) => {
                            const formatted = formatExpiry(e.target.value);
                            setFormData(prev => ({ ...prev, cardExpiry: formatted }));
                          }}
                          placeholder="MM/YY"
                          maxLength="5"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.cardExpiry ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.cardExpiry && (
                          <p className="text-red-500 text-sm mt-1">{errors.cardExpiry}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cardCvv"
                          value={formData.cardCvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          maxLength="3"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.cardCvv ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.cardCvv && (
                          <p className="text-red-500 text-sm mt-1">{errors.cardCvv}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Lock className="mr-2" />
                    {loading ? 'Processing...' : `Place Order - $0.00`}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* Cart items are no longer available, so this will be empty */}
                </div>
                <div className="border-t border-gray-200 mt-6 pt-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${0.00.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-lg font-semibold text-gray-900">${0.00.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;