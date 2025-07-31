import React from 'react';
import { BookOpen, ShoppingCart, BarChart2, Package } from 'lucide-react';

const SellerDashboard = () => {
  return (
    <div className="mt-28 px-4 lg:px-24 py-12">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Package className="h-6 w-6 text-purple-600" /> Seller Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-4">
          <BookOpen className="h-10 w-10 text-blue-600" />
          <div>
            <div className="text-2xl font-bold">123</div>
            <div className="text-gray-500">Books</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-4">
          <ShoppingCart className="h-10 w-10 text-green-600" />
          <div>
            <div className="text-2xl font-bold">45</div>
            <div className="text-gray-500">Orders</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-4">
          <BarChart2 className="h-10 w-10 text-orange-600" />
          <div>
            <div className="text-2xl font-bold">$2,345</div>
            <div className="text-gray-500">Revenue</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-4">
          <Package className="h-10 w-10 text-purple-600" />
          <div>
            <div className="text-2xl font-bold">7</div>
            <div className="text-gray-500">Active Listings</div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Add Book</button>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">View Orders</button>
          <button className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors">Sales Report</button>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;