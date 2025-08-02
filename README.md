# 📚 Enhanced Bookstore - Modern MERN Stack E-commerce Platform

A modern, full-featured online bookstore built with the MERN stack, featuring JWT authentication, role-based access control, shopping cart functionality, and comprehensive order management. Built with modern UI components and clean architecture.

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based Authentication** - Secure token-based auth system
- **Role-based Access Control** - Admin, Seller, and Customer roles
- **Profile Management** - Complete user profile with shipping addresses
- **Role Upgrading** - Customers can become sellers seamlessly
- **Context-based State Management** - React Context API for auth and cart state

### 🛒 E-commerce Functionality
- **Shopping Cart System** - Add, update, remove items with real-time updates
- **Advanced Search & Filtering** - Search by title, author, category with price filters
- **Inventory Management** - Real-time stock tracking and availability
- **Order Processing** - Complete order lifecycle from cart to delivery
- **Review System** - Rate and review purchased books
- **Checkout Process** - Secure payment and shipping information

### 👥 User Roles & Permissions

#### 🛍️ Customer Features
- Browse and search books with advanced filters
- Add books to cart and manage quantities
- Secure checkout with shipping information
- Order tracking and history
- Leave reviews for purchased books
- Manage shipping addresses and profile

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
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Modern Components** - shadcn/ui components for consistent design
- **Lucide React Icons** - Beautiful, customizable icons
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
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Cookie handling

### Frontend
- **React 18** - UI library with hooks
- **React Router DOM** - Client-side routing
- **React Context API** - State management (replaced Zustand)
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **shadcn/ui** - Modern UI component library
- **Swiper** - Touch slider for carousels
- **Vite** - Fast build tool and dev server

### UI Components & Styling
- **Radix UI** - Headless UI primitives
- **Class Variance Authority** - Component variant management
- **clsx & tailwind-merge** - Conditional styling utilities

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/rohit-0604/book-store.git
cd book-store
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
book-store/
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
│   │   │   ├── ui/        # shadcn/ui components
│   │   │   │   ├── button.jsx
│   │   │   │   ├── card.jsx
│   │   │   │   ├── input.jsx
│   │   │   │   └── avatar.jsx
│   │   │   ├── Login.jsx  # Authentication forms
│   │   │   ├── Signup.jsx
│   │   │   ├── Navbar.jsx # Navigation with cart
│   │   │   ├── Cart.jsx   # Shopping cart
│   │   │   ├── Checkout.jsx # Checkout process
│   │   │   ├── Profile.jsx # User profile
│   │   │   ├── AdminDashboard.jsx # Admin panel
│   │   │   ├── SellerDashboard.jsx # Seller panel
│   │   │   └── PrivateRoute.jsx # Route protection
│   │   ├── context/       # React Context providers
│   │   │   ├── AuthContext.jsx   # Authentication state
│   │   │   └── CartContext.jsx   # Cart state
│   │   ├── services/      # API services
│   │   │   └── api.js     # HTTP client setup
│   │   ├── home/          # Home page components
│   │   │   ├── Banner.jsx
│   │   │   └── Reviews.jsx
│   │   ├── shop/          # Shop components
│   │   │   └── Shop.jsx
│   │   ├── lib/           # Utility functions
│   │   │   └── utils.js   # Tailwind class merging
│   │   ├── routers/       # Routing configuration
│   │   │   └── router.jsx
│   │   ├── App.jsx        # App entry point
│   │   └── main.jsx       # React root
│   ├── .env.example       # Environment template
│   ├── tailwind.config.js # Tailwind configuration
│   ├── index.css          # Global styles
│   └── package.json       # Dependencies
│
├── bookData.json          # Sample book data
├── DEPLOYMENT.md          # Deployment guide
└── README.md             # This file
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/become-seller` - Upgrade to seller
- `POST /api/auth/change-password` - Change password

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
- `GET /api/orders/seller/orders` - Get seller's orders

## 🎯 Key Features & Improvements

### Modern Architecture
1. **React Context API** - Replaced Zustand with native React state management
2. **shadcn/ui Components** - Modern, accessible UI components
3. **Lucide React Icons** - Beautiful, customizable icon library
4. **Tailwind CSS** - Utility-first styling approach
5. **Vite Build Tool** - Fast development and optimized builds

### Enhanced User Experience
1. **Responsive Design** - Mobile-first approach
2. **Real-time Updates** - Instant feedback and notifications
3. **Modern UI/UX** - Clean, intuitive interface
4. **Accessibility** - WCAG compliant components
5. **Performance** - Optimized loading and rendering

### Security & Reliability
1. **JWT Authentication** - Secure token-based auth
2. **Role-based Access** - Comprehensive permissions
3. **Input Validation** - Both client and server-side
4. **Error Handling** - Graceful error management
5. **Data Validation** - Mongoose schemas and validation

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas cluster
2. Configure environment variables
3. Deploy to Heroku, Railway, or DigitalOcean
4. Set up CORS for frontend domain

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the `dist` folder to Vercel, Netlify, or similar
3. Configure environment variables
4. Set up custom domain (optional)

### Environment Variables for Production
```env
# Backend
NODE_ENV=production
MONGO_URI=your-mongodb-atlas-url
JWT_SECRET=your-production-jwt-secret
CLIENT_URL=https://your-frontend-domain.com

# Frontend
VITE_API_URL=https://your-backend-domain.com/api
```
