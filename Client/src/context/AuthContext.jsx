import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isAdmin: false,
  isSeller: false,
  isCustomer: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        isAdmin: action.payload.user.role === 'admin',
        isSeller: action.payload.user.role === 'seller',
        isCustomer: action.payload.user.role === 'customer',
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isAdmin: false,
        isSeller: false,
        isCustomer: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
        isAdmin: action.payload.role === 'admin',
        isSeller: action.payload.role === 'seller',
        isCustomer: action.payload.role === 'customer',
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app start
  const initialize = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: response.data.user } });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      localStorage.removeItem('token');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user } });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user } });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Update user function
  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  // Change password function
  const changePassword = async (passwordData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/change-password`,
        passwordData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Password change failed' };
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    changePassword,
    initialize,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};