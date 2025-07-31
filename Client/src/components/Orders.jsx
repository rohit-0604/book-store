import React from 'react';
import { Box, Truck, CheckCircle, XCircle, Eye } from 'lucide-react';

const Orders = () => {
  // Dummy data for demonstration
  const orders = [
    {
      id: '1',
      status: 'Delivered',
      total: 41.97,
      date: '2024-04-01',
      items: 3
    },
    {
      id: '2',
      status: 'Shipped',
      total: 29.99,
      date: '2024-03-28',
      items: 2
    },
    {
      id: '3',
      status: 'Cancelled',
      total: 0,
      date: '2024-03-20',
      items: 1
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'Shipped':
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'Cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Box className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="mt-28 px-4 lg:px-24 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">My Orders</h1>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getStatusIcon(order.status)}
                <div>
                  <div className="font-semibold">Order #{order.id}</div>
                  <div className="text-gray-500 text-sm">{order.items} items • {order.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="font-bold text-lg">${order.total.toFixed(2)}</div>
                <button className="text-blue-600 hover:text-blue-800 transition-colors">
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;