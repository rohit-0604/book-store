import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const PrivateRoute = ({ children, requiredRole = null, requiredRoles = [] }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for specific role requirement
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page.
            {requiredRole && ` Required role: ${requiredRole}`}
          </p>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  // Check for multiple allowed roles
  if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page.
            Required roles: {requiredRoles.join(', ')}
          </p>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  return children;
};

// Convenience components for specific roles
export const AdminRoute = ({ children }) => (
  <PrivateRoute requiredRole="admin">{children}</PrivateRoute>
);

export const SellerRoute = ({ children }) => (
  <PrivateRoute requiredRoles={['seller', 'admin']}>{children}</PrivateRoute>
);

export const CustomerRoute = ({ children }) => (
  <PrivateRoute requiredRoles={['customer', 'seller', 'admin']}>{children}</PrivateRoute>
);

export default PrivateRoute;