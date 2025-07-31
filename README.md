# 📚 Enhanced Bookstore - Complete E-commerce Platform

A modern, full-featured online bookstore built with the MERN stack, featuring JWT authentication, role-based access control, shopping cart functionality, and comprehensive order management.

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based Authentication** - Secure token-based auth system
- **Role-based Access Control** - Admin, Seller, and Customer roles
- **Profile Management** - Complete user profile with shipping addresses
- **Role Upgrading** - Customers can become sellers seamlessly

### 🛒 E-commerce Functionality
- **Shopping Cart System** - Add, update, remove items with real-time updates
- **Advanced Search & Filtering** - Search by title, author, category with price filters
- **Inventory Management** - Real-time stock tracking and availability
- **Order Processing** - Complete order lifecycle from cart to delivery
- **Review System** - Rate and review purchased books

### 👥 User Roles & Permissions

#### 🛍️ Customer Features
- Browse and search books with advanced filters
- Add books to cart and wishlist
- Secure checkout with multiple payment options
- Order tracking and history
- Leave reviews for purchased books
- Manage shipping addresses

#### 🏪 Seller Features
- Add and manage book inventory
- Set pricing and stock levels
- View sales analytics and reports
- Manage orders for their books
- Update order status and tracking
- Business profile management

#### 👑 Admin Features
- Complete system oversight
- Manage all users and books
- View comprehensive analytics
- Moderate reviews and content
- System configuration and settings

### 🎨 Modern UI/UX
- **Responsive Design** - Mobile-first approach
- **Clean Interface** - Modern, intuitive design
- **Real-time Updates** - Instant feedback and notifications
- **Accessibility** - WCAG compliant interface
- **Dark Mode Ready** - Prepared for theme switching

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

### Frontend
- **React 18** - UI library with hooks
- **React Router** - Client-side routing
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Tailwind CSS** - Styling
- **React Icons** - Icon library

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd enhanced-bookstore
```

### 2. Backend Setup
```bash
cd Server
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URL and JWT secret
```

### 3. Frontend Setup
```bash
cd ../Client
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your API URL
```

### 4. Environment Configuration

#### Server `.env`
```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bookstore
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

#### Client `.env`
```env
VITE_API_URL=http://localhost:5001/api
VITE_APP_NAME=Enhanced Bookstore
VITE_APP_VERSION=2.0.0
```

### 5. Start the Application

#### Start Backend (Terminal 1)
```bash
cd Server
npm start
```

#### Start Frontend (Terminal 2)
```bash
cd Client
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5001`
- API Documentation: `http://localhost:5001/api`

## 🗂️ Project Structure

```
enhanced-bookstore/
├── Server/                 # Backend application
│   ├── models/            # Database models
│   │   ├── User.js        # User model with roles
│   │   ├── book.js        # Enhanced book model
│   │   ├── Order.js       # Order management
│   │   └── Review.js      # Review system
│   ├── routes/            # API routes
│   │   ├── auth.js        # Authentication routes
│   │   ├── books.js       # Book management
│   │   ├── cart.js        # Cart operations
│   │   └── orders.js      # Order processing
│   ├── middleware/        # Custom middleware
│   │   └── auth.js        # JWT authentication
│   ├── .env.example       # Environment template
│   ├── package.json       # Dependencies
│   └── index.js           # Server entry point
│
├── Client/                # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Login.jsx  # Authentication forms
│   │   │   ├── Signup.jsx
│   │   │   ├── Navbar.jsx # Navigation with cart
│   │   │   └── Cart.jsx   # Shopping cart
│   │   ├── stores/        # Zustand stores
│   │   │   ├── authStore.js   # Authentication state
│   │   │   └── cartStore.js   # Cart state
│   │   ├── services/      # API services
│   │   │   └── api.js     # HTTP client setup
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # App entry point
│   ├── .env.example       # Environment template
│   └── package.json       # Dependencies
│
├── bookData.json          # Sample book data
└── README.md             # This file
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/become-seller` - Upgrade to seller

### Books
- `GET /api/books` - Get all books with filters
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book (sellers/admins)
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `GET /api/books/my/books` - Get seller's books

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item
- `DELETE /api/cart/remove/:itemId` - Remove from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders
- `POST /api/orders/create` - Create new order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:orderId` - Get single order
- `PUT /api/orders/:orderId/cancel` - Cancel order
- `PUT /api/orders/:orderId/status` - Update order status

## 👥 Demo Accounts

The application comes with pre-configured demo accounts:

- **Admin**: admin@bookstore.com / password123
- **Seller**: seller@bookstore.com / password123
- **Customer**: customer@bookstore.com / password123

## 🎯 Key Improvements Over Original

1. **Replaced Firebase with JWT** - More control and security
2. **Added Role-based Access** - Comprehensive user management
3. **Shopping Cart System** - Full e-commerce functionality
4. **Order Management** - Complete order lifecycle
5. **Enhanced UI/UX** - Modern, responsive design
6. **Better State Management** - Zustand for predictable state
7. **Comprehensive Validation** - Both client and server-side
8. **Real-time Updates** - Instant feedback and notifications
9. **Mobile Responsive** - Works perfectly on all devices
10. **Scalable Architecture** - Clean, maintainable codebase

## 🚀 Deployment

### Backend (Heroku/Railway)
1. Set up MongoDB Atlas
2. Configure environment variables
3. Deploy using your preferred platform

### Frontend (Vercel/Netlify)
1. Build the React app: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Original MERN bookstore concept
- React and Node.js communities
- MongoDB for excellent documentation
- Tailwind CSS for styling system

---

**Made with ❤️ for the developer community**

For questions or support, please open an issue in the repository.
