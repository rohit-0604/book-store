import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Trash2, Plus, Minus, ShoppingBag, Heart, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

const Cart = () => {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();

  const handleQuantityChange = async (bookId, newQuantity) => {
    if (newQuantity < 1) return;
    const result = await updateQuantity(bookId, newQuantity);
    if (!result.success) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (bookId) => {
    const result = await removeFromCart(bookId);
    if (!result.success) {
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    const result = await clearCart();
    if (!result.success) {
      toast.error('Failed to clear cart');
    }
  };

  if (items.length === 0) {
    return (
      <div className="mt-28 px-4 lg:px-24 py-12">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any books to your cart yet.</p>
          <Link to="/shop">
            <Button size="lg">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-28 px-4 lg:px-24 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.bookId} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.imageURL && item.imageURL.startsWith('http') ? item.imageURL : `/${item.imageURL}`}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600 mb-2">${item.price}</p>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item.bookId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-2 py-1"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-3 py-1 text-center min-w-[2rem]">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item.bookId, item.quantity + 1)}
                            className="px-2 py-1"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.bookId)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={handleClearCart}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({items.length} items)</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${(total * 0.08).toFixed(2)}</span>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${(total * 1.08).toFixed(2)}</span>
                </div>
                
                <Link to="/checkout" className="w-full">
                  <Button className="w-full" size="lg">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Checkout
                  </Button>
                </Link>
                
                <Link to="/shop" className="w-full">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;