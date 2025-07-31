import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
export const tokenManager = {
  getToken: () => localStorage.getItem('bookstore_token'),
  setToken: (token) => localStorage.setItem('bookstore_token', token),
  removeToken: () => localStorage.removeItem('bookstore_token'),
  isValidToken: (token) => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token && tokenManager.isValidToken(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenManager.removeToken();
      if (window.location.pathname !== '/login') {
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
      }
    }
    
    // Handle other common errors
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.message) {
      toast.error(error.message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  becomeSeller: (sellerInfo) => api.post('/auth/become-seller', sellerInfo),
  verifyToken: () => api.get('/auth/verify-token'),
  logout: () => api.post('/auth/logout'),
};

// Books API endpoints
export const booksAPI = {
  getBooks: (params) => api.get('/books', { params }),
  getBook: (id) => api.get(`/books/${id}`),
  createBook: (bookData) => api.post('/books', bookData),
  updateBook: (id, bookData) => api.put(`/books/${id}`, bookData),
  deleteBook: (id) => api.delete(`/books/${id}`),
  getMyBooks: (params) => api.get('/books/my/books', { params }),
  getSellerBooks: (sellerId, params) => api.get(`/books/seller/${sellerId}`, { params }),
  searchBooks: (params) => api.get('/books/search/advanced', { params }),
};

// Cart API endpoints
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart/add', data),
  updateCartItem: (itemId, data) => api.put(`/cart/update/${itemId}`, data),
  removeFromCart: (itemId) => api.delete(`/cart/remove/${itemId}`),
  clearCart: () => api.delete('/cart/clear'),
  getCartCount: () => api.get('/cart/count'),
  moveToWishlist: (itemId) => api.post(`/cart/move-to-wishlist/${itemId}`),
  applyCoupon: (data) => api.post('/cart/apply-coupon', data),
};

// Orders API endpoints
export const ordersAPI = {
  createOrder: (orderData) => api.post('/orders/create', orderData),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getOrder: (orderId) => api.get(`/orders/${orderId}`),
  cancelOrder: (orderId) => api.put(`/orders/${orderId}/cancel`),
  updateOrderStatus: (orderId, data) => api.put(`/orders/${orderId}/status`, data),
  getSellerOrders: (params) => api.get('/orders/seller/orders', { params }),
  getAllOrders: (params) => api.get('/orders/admin/all-orders', { params }),
};

// Generic API methods
export const apiCall = {
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  delete: (url, config) => api.delete(url, config),
  patch: (url, data, config) => api.patch(url, data, config),
};

export default api;