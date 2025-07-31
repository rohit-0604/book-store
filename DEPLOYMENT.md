# 🚀 Deployment Guide - Enhanced Bookstore

This guide will help you deploy the Enhanced Bookstore application on third-party platforms.

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Third-party hosting platform account (Vercel, Netlify, Railway, etc.)

## 🔧 Environment Setup

### 1. Backend Environment Variables

Create a `.env` file in the `Server/` directory:

```env
PORT=5001
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
CLIENT_URL=your_frontend_url
```

### 2. Frontend Environment Variables

Create a `.env` file in the `Client/` directory:

```env
VITE_API_URL=your_backend_api_url
VITE_APP_NAME=Enhanced Bookstore
VITE_APP_VERSION=2.0.0
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended for Frontend)

#### Frontend Deployment:
1. Connect your GitHub repository to Vercel
2. Set build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `cd Client && npm install && npm run build`
   - **Output Directory**: `Client/dist`
   - **Install Command**: `cd Client && npm install`
3. Add environment variables in Vercel dashboard
4. Deploy

#### Backend Deployment:
1. Use Vercel for API routes or deploy separately on Railway/Render
2. Set environment variables
3. Deploy

### Option 2: Netlify

#### Frontend Deployment:
1. Connect your GitHub repository to Netlify
2. Set build settings:
   - **Build Command**: `cd Client && npm install && npm run build`
   - **Publish Directory**: `Client/dist`
3. Add environment variables
4. Deploy

### Option 3: Railway

#### Full Stack Deployment:
1. Connect your GitHub repository to Railway
2. Set up two services:
   - **Frontend Service**:
     - Build Command: `cd Client && npm install && npm run build`
     - Start Command: `cd Client && npm run preview`
   - **Backend Service**:
     - Build Command: `cd Server && npm install`
     - Start Command: `cd Server && npm start`
3. Add environment variables for both services
4. Deploy

### Option 4: Render

#### Backend Deployment:
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `cd Server && npm install`
4. Set start command: `cd Server && npm start`
5. Add environment variables
6. Deploy

#### Frontend Deployment:
1. Create a new Static Site
2. Set build command: `cd Client && npm install && npm run build`
3. Set publish directory: `Client/dist`
4. Add environment variables
5. Deploy

## 🔗 Database Setup

### MongoDB Atlas:
1. Create a new cluster
2. Set up database access (username/password)
3. Set up network access (IP whitelist or 0.0.0.0/0 for all)
4. Get your connection string
5. Update the `MONGO_URI` in your backend environment variables

## 🔐 Security Considerations

1. **JWT Secret**: Use a strong, unique secret key
2. **MongoDB**: Enable authentication and network security
3. **Environment Variables**: Never commit `.env` files
4. **CORS**: Update `CLIENT_URL` to match your frontend URL
5. **HTTPS**: Ensure your deployment uses HTTPS

## 📊 Post-Deployment

### 1. Test All Features:
- User registration and login
- Book browsing and search
- Shopping cart functionality
- Order placement and management
- Admin and seller dashboards

### 2. Monitor Performance:
- Check API response times
- Monitor database performance
- Set up error tracking (optional)

### 3. Set Up Analytics (Optional):
- Google Analytics
- Error tracking (Sentry)
- Performance monitoring

## 🛠️ Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Ensure `CLIENT_URL` is set correctly
   - Check that frontend and backend URLs match

2. **Database Connection Issues**:
   - Verify MongoDB Atlas connection string
   - Check network access settings
   - Ensure database user has proper permissions

3. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for missing environment variables

4. **API Errors**:
   - Verify API URL in frontend environment
   - Check backend logs for errors
   - Ensure all routes are properly configured

## 📞 Support

If you encounter any issues during deployment:

1. Check the application logs
2. Verify environment variables
3. Test locally first
4. Check platform-specific documentation

## 🎉 Success!

Once deployed, your Enhanced Bookstore will be accessible at your chosen platform's URL with all features fully functional:

- ✅ User authentication and authorization
- ✅ Book browsing and search
- ✅ Shopping cart and checkout
- ✅ Order management
- ✅ Admin and seller dashboards
- ✅ Responsive design
- ✅ Real-time updates

---

**Happy Deploying! 🚀**