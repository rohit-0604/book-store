import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaBox, 
  FaDollarSign, 
  FaShoppingCart,
  FaChartLine,
  FaFileAlt,
  FaUsers
} from 'react-icons/fa';
import { booksAPI, ordersAPI } from '../services/api';
import useAuthStore from '../stores/authStore';
import toast from 'react-hot-toast';

const SellerDashboard = () => {
  const { user } = useAuthStore();
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    totalBooks: 0,
    totalSales: 0,
    activeBooks: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch seller's books
      const booksResponse = await booksAPI.getMyBooks();
      setBooks(booksResponse.data.data.books);
      setSummary(booksResponse.data.data.summary);
      
      // Fetch seller's orders
      const ordersResponse = await ordersAPI.getSellerOrders();
      setOrders(ordersResponse.data.data.orders);
      
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await booksAPI.deleteBook(bookId);
        toast.success('Book deleted successfully');
        fetchDashboardData();
      } catch (error) {
        toast.error('Failed to delete book');
      }
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="text-white text-xl" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="flex items-center">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {change && (
              <span className="ml-2 text-sm text-green-600">+{change}%</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.sellerInfo?.businessName || user?.displayName}
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: FaChartLine },
              { id: 'books', label: 'My Books', icon: FaBox },
              { id: 'orders', label: 'Orders', icon: FaShoppingCart },
              { id: 'profile', label: 'Business Profile', icon: FaUsers }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Books"
                value={summary.totalBooks}
                icon={FaBox}
                color="bg-blue-500"
              />
              <StatCard
                title="Active Books"
                value={summary.activeBooks}
                icon={FaEye}
                color="bg-green-500"
              />
              <StatCard
                title="Total Sales"
                value={summary.totalSales}
                icon={FaShoppingCart}
                color="bg-purple-500"
              />
              <StatCard
                title="Revenue"
                value={`$${summary.totalRevenue?.toFixed(2) || '0.00'}`}
                icon={FaDollarSign}
                color="bg-yellow-500"
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/dashboard/add-book"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaPlus className="text-blue-600 mr-3" />
                  <span className="font-medium">Add New Book</span>
                </Link>
                <button 
                  onClick={() => setActiveTab('books')}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaBox className="text-green-600 mr-3" />
                  <span className="font-medium">Manage Inventory</span>
                </button>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaShoppingCart className="text-purple-600 mr-3" />
                  <span className="font-medium">View Orders</span>
                </button>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
              </div>
              <div className="p-6">
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Order #{order.orderNumber}</p>
                          <p className="text-sm text-gray-500">
                            {order.customer?.firstName} {order.customer?.lastName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${order.orderSummary.total.toFixed(2)}</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.displayStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No orders yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Books Tab */}
        {activeTab === 'books' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Books</h2>
              <Link
                to="/dashboard/add-book"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <FaPlus className="mr-2" />
                Add New Book
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Book
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sales
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {books.map((book) => (
                    <tr key={book._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img className="h-12 w-8 object-cover rounded" src={book.imageURL} alt={book.bookTitle} />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{book.bookTitle}</div>
                            <div className="text-sm text-gray-500">{book.authorName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${book.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {book.isDigital ? 'Digital' : book.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {book.totalSales || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          book.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {book.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/book/${book._id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FaEye />
                          </Link>
                          <Link
                            to={`/dashboard/edit-book/${book._id}`}
                            className="text-green-600 hover:text-green-900"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDeleteBook(book._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.customer?.firstName} {order.customer?.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${order.orderSummary.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.displayStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/order/${order._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Business Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Business Profile</h2>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <p className="text-gray-900">{user?.sellerInfo?.businessName || 'Not set'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <p className="text-gray-900">{user?.email}</p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Description
                  </label>
                  <p className="text-gray-900">
                    {user?.sellerInfo?.businessDescription || 'No description provided'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <Link
                  to="/profile"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;