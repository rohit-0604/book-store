import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Truck, CheckCircle, XCircle, MapPin, Phone, Mail } from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  // Dummy data for demonstration
  const order = {
    id,
    status: 'Delivered',
    items: [
      { title: 'Book 1', quantity: 2, price: 15.99 },
      { title: 'Book 2', quantity: 1, price: 9.99 }
    ],
    shipping: {
      name: 'John Doe',
      address: '123 Main St, City, Country',
      phone: '+1234567890',
      email: 'john@example.com'
    },
    total: 41.97
  };

  return (
    <div className="mt-28 px-4 lg:px-24 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center gap-4">
            {order.status === 'Delivered' ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : order.status === 'Shipped' ? (
              <Truck className="h-6 w-6 text-blue-600" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600" />
            )}
            <span className="text-lg font-semibold">{order.status}</span>
          </div>
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Items</h3>
            <ul className="space-y-2">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{item.title} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Shipping Information</h3>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{order.shipping.address}</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{order.shipping.phone}</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{order.shipping.email}</span>
            </div>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetails;