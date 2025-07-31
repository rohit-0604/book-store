import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
  isLoading: false,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        total: action.payload.total || 0,
        isLoading: false,
      };
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.bookId === action.payload.bookId);
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.bookId === action.payload.bookId
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        };
      } else {
        const newItems = [...state.items, action.payload];
        return {
          ...state,
          items: newItems,
          total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        };
      }
    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.bookId === action.payload.bookId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      };
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.bookId !== action.payload);
      return {
        ...state,
        items: filteredItems,
        total: filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Fetch cart from server
  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      dispatch({ type: 'SET_CART', payload: response.data });
    } catch (error) {
      console.error('Error fetching cart:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Add item to cart
  const addToCart = async (book, quantity = 1) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to add items to cart');
        return { success: false };
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart/add`,
        {
          bookId: book._id,
          quantity,
          price: book.price,
          title: book.bookTitle,
          imageURL: book.imageURL,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      dispatch({ type: 'ADD_ITEM', payload: response.data.item });
      toast.success('Item added to cart!');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
      return { success: false };
    }
  };

  // Update item quantity
  const updateQuantity = async (bookId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return { success: false };

      await axios.put(
        `${import.meta.env.VITE_API_URL}/cart/update`,
        { bookId, quantity },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      dispatch({ type: 'UPDATE_QUANTITY', payload: { bookId, quantity } });
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update quantity');
      return { success: false };
    }
  };

  // Remove item from cart
  const removeFromCart = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return { success: false };

      await axios.delete(`${import.meta.env.VITE_API_URL}/cart/remove`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { bookId }
      });

      dispatch({ type: 'REMOVE_ITEM', payload: bookId });
      toast.success('Item removed from cart');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove item');
      return { success: false };
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return { success: false };

      await axios.delete(`${import.meta.env.VITE_API_URL}/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      dispatch({ type: 'CLEAR_CART' });
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to clear cart');
      return { success: false };
    }
  };

  const value = {
    ...state,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};