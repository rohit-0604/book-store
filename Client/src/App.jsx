
import { useEffect } from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import MyFooter from './components/MyFooter';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './stores/authStore';
import useCartStore from './stores/cartStore';

function App() {
  const { initialize: initializeAuth, isAuthenticated } = useAuthStore();
  const { fetchCart } = useCartStore();

  useEffect(() => {
    // Initialize authentication state on app start
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // Fetch cart when user is authenticated
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10B981',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
      
      <Navbar />
      
      <div className='min-h-screen'>
        <Outlet />
      </div>
      
      <MyFooter />
    </>
  );
}

export default App;
