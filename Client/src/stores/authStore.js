import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI, tokenManager } from '../services/api';
import toast from 'react-hot-toast';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      // Initialize auth state
      initialize: async () => {
        const token = tokenManager.getToken();
        
        if (token && tokenManager.isValidToken(token)) {
          set({ token, isLoading: true });
          
          try {
            const response = await authAPI.verifyToken();
            const userData = response.data.data.user;
            
            set({
              user: userData,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            // Token is invalid, clear it
            tokenManager.removeToken();
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } else {
          set({ isLoading: false });
        }
      },

      // Login function
      login: async (credentials) => {
        set({ isLoading: true });
        
        try {
          const response = await authAPI.login(credentials);
          const { user, token } = response.data.data;
          
          tokenManager.setToken(token);
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          toast.success(`Welcome back, ${user.firstName}!`);
          return { success: true, user };
        } catch (error) {
          set({ isLoading: false });
          
          const message = error.response?.data?.message || 'Login failed';
          toast.error(message);
          
          return { 
            success: false, 
            error: message,
            errors: error.response?.data?.errors 
          };
        }
      },

      // Register function
      register: async (userData) => {
        set({ isLoading: true });
        
        try {
          const response = await authAPI.register(userData);
          const { user, token } = response.data.data;
          
          tokenManager.setToken(token);
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          toast.success(`Welcome to our bookstore, ${user.firstName}!`);
          return { success: true, user };
        } catch (error) {
          set({ isLoading: false });
          
          const message = error.response?.data?.message || 'Registration failed';
          toast.error(message);
          
          return { 
            success: false, 
            error: message,
            errors: error.response?.data?.errors 
          };
        }
      },

      // Logout function
      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          // Even if logout fails on server, clear local state
          console.error('Logout error:', error);
        }
        
        tokenManager.removeToken();
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        
        toast.success('Logged out successfully');
      },

      // Update profile
      updateProfile: async (profileData) => {
        try {
          const response = await authAPI.updateProfile(profileData);
          const updatedUser = response.data.data.user;
          
          set({ user: updatedUser });
          toast.success('Profile updated successfully');
          
          return { success: true, user: updatedUser };
        } catch (error) {
          const message = error.response?.data?.message || 'Profile update failed';
          toast.error(message);
          
          return { success: false, error: message };
        }
      },

      // Update user (for external updates)
      updateUser: (userData) => {
        set({ user: userData });
      },

      // Change password
      changePassword: async (passwordData) => {
        try {
          await authAPI.changePassword(passwordData);
          toast.success('Password changed successfully');
          
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Password change failed';
          toast.error(message);
          
          return { success: false, error: message };
        }
      },

      // Become seller
      becomeSeller: async (sellerInfo) => {
        try {
          const response = await authAPI.becomeSeller({ sellerInfo });
          const updatedUser = response.data.data.user;
          
          set({ user: updatedUser });
          toast.success('Successfully upgraded to seller account!');
          
          return { success: true, user: updatedUser };
        } catch (error) {
          const message = error.response?.data?.message || 'Seller upgrade failed';
          toast.error(message);
          
          return { success: false, error: message };
        }
      },

      // Check if user has specific role
      hasRole: (role) => {
        const { user } = get();
        return user?.role === role;
      },

      // Check if user has any of the specified roles
      hasAnyRole: (roles) => {
        const { user } = get();
        return roles.includes(user?.role);
      },

      // Check if user is admin
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      },

      // Check if user is seller
      isSeller: () => {
        const { user } = get();
        return user?.role === 'seller' || user?.role === 'admin';
      },

      // Check if user is customer
      isCustomer: () => {
        const { user } = get();
        return user?.role === 'customer' || user?.role === 'seller' || user?.role === 'admin';
      },

      // Get user display name
      getDisplayName: () => {
        const { user } = get();
        return user ? `${user.firstName} ${user.lastName}` : '';
      },

      // Clear any errors (useful for forms)
      clearErrors: () => {
        // This can be extended if we add error state
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;