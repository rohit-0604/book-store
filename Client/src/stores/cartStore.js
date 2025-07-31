import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartAPI } from '../services/api';
import toast from 'react-hot-toast';

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      cart: {
        items: [],
        summary: {
          totalItems: 0,
          subtotal: 0,
          tax: 0,
          shipping: 0,
          total: 0,
          hasUnavailableItems: false,
        },
      },
      isLoading: false,
      isSubmitting: false,

      // Fetch cart from server
      fetchCart: async () => {
        set({ isLoading: true });
        
        try {
          const response = await cartAPI.getCart();
          const cartData = response.data.data.cart;
          
          set({
            cart: cartData,
            isLoading: false,
          });
          
          return { success: true, cart: cartData };
        } catch (error) {
          set({ isLoading: false });
          
          // If user is not authenticated, clear cart
          if (error.response?.status === 401) {
            set({
              cart: {
                items: [],
                summary: {
                  totalItems: 0,
                  subtotal: 0,
                  tax: 0,
                  shipping: 0,
                  total: 0,
                  hasUnavailableItems: false,
                },
              },
            });
          }
          
          return { success: false, error: error.response?.data?.message };
        }
      },

      // Add item to cart
      addToCart: async (bookId, quantity = 1) => {
        set({ isSubmitting: true });
        
        try {
          const response = await cartAPI.addToCart({ bookId, quantity });
          
          // Refresh cart after adding
          await get().fetchCart();
          
          set({ isSubmitting: false });
          toast.success('Item added to cart');
          
          return { success: true };
        } catch (error) {
          set({ isSubmitting: false });
          
          const message = error.response?.data?.message || 'Failed to add item to cart';
          toast.error(message);
          
          return { success: false, error: message };
        }
      },

      // Update cart item quantity
      updateCartItem: async (itemId, quantity) => {
        set({ isSubmitting: true });
        
        try {
          await cartAPI.updateCartItem(itemId, { quantity });
          
          // Update local state optimistically
          const currentCart = get().cart;
          const updatedItems = currentCart.items.map(item => 
            item._id === itemId 
              ? { ...item, quantity, itemSubtotal: item.book.price * quantity }
              : item
          );
          
          // Recalculate summary
          const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
          const subtotal = updatedItems.reduce((sum, item) => sum + item.itemSubtotal, 0);
          const tax = subtotal * 0.08;
          const shipping = subtotal > 50 ? 0 : 5.99;
          const total = subtotal + tax + shipping;
          
          set({
            cart: {
              items: updatedItems,
              summary: {
                totalItems,
                subtotal: parseFloat(subtotal.toFixed(2)),
                tax: parseFloat(tax.toFixed(2)),
                shipping: parseFloat(shipping.toFixed(2)),
                total: parseFloat(total.toFixed(2)),
                hasUnavailableItems: currentCart.summary.hasUnavailableItems,
              },
            },
            isSubmitting: false,
          });
          
          toast.success('Cart updated');
          return { success: true };
        } catch (error) {
          set({ isSubmitting: false });
          
          const message = error.response?.data?.message || 'Failed to update cart';
          toast.error(message);
          
          return { success: false, error: message };
        }
      },

      // Remove item from cart
      removeFromCart: async (itemId) => {
        set({ isSubmitting: true });
        
        try {
          await cartAPI.removeFromCart(itemId);
          
          // Update local state optimistically
          const currentCart = get().cart;
          const updatedItems = currentCart.items.filter(item => item._id !== itemId);
          
          // Recalculate summary
          const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
          const subtotal = updatedItems.reduce((sum, item) => sum + item.itemSubtotal, 0);
          const tax = subtotal * 0.08;
          const shipping = subtotal > 50 ? 0 : 5.99;
          const total = subtotal + tax + shipping;
          
          set({
            cart: {
              items: updatedItems,
              summary: {
                totalItems,
                subtotal: parseFloat(subtotal.toFixed(2)),
                tax: parseFloat(tax.toFixed(2)),
                shipping: parseFloat(shipping.toFixed(2)),
                total: parseFloat(total.toFixed(2)),
                hasUnavailableItems: false,
              },
            },
            isSubmitting: false,
          });
          
          toast.success('Item removed from cart');
          return { success: true };
        } catch (error) {
          set({ isSubmitting: false });
          
          const message = error.response?.data?.message || 'Failed to remove item';
          toast.error(message);
          
          return { success: false, error: message };
        }
      },

      // Clear entire cart
      clearCart: async () => {
        set({ isSubmitting: true });
        
        try {
          await cartAPI.clearCart();
          
          set({
            cart: {
              items: [],
              summary: {
                totalItems: 0,
                subtotal: 0,
                tax: 0,
                shipping: 0,
                total: 0,
                hasUnavailableItems: false,
              },
            },
            isSubmitting: false,
          });
          
          toast.success('Cart cleared');
          return { success: true };
        } catch (error) {
          set({ isSubmitting: false });
          
          const message = error.response?.data?.message || 'Failed to clear cart';
          toast.error(message);
          
          return { success: false, error: message };
        }
      },

      // Move item to wishlist
      moveToWishlist: async (itemId) => {
        set({ isSubmitting: true });
        
        try {
          await cartAPI.moveToWishlist(itemId);
          
          // Remove item from cart
          await get().removeFromCart(itemId);
          
          toast.success('Item moved to wishlist');
          return { success: true };
        } catch (error) {
          set({ isSubmitting: false });
          
          const message = error.response?.data?.message || 'Failed to move item to wishlist';
          toast.error(message);
          
          return { success: false, error: message };
        }
      },

      // Get cart item count
      getCartCount: () => {
        const { cart } = get();
        return cart.summary.totalItems;
      },

      // Check if book is in cart
      isInCart: (bookId) => {
        const { cart } = get();
        return cart.items.some(item => item.book._id === bookId);
      },

      // Get cart item by book ID
      getCartItem: (bookId) => {
        const { cart } = get();
        return cart.items.find(item => item.book._id === bookId);
      },

      // Quick add to cart (with optimistic updates)
      quickAddToCart: async (book, quantity = 1) => {
        // Optimistic update
        const currentCart = get().cart;
        const existingItem = currentCart.items.find(item => item.book._id === book._id);
        
        let updatedItems;
        if (existingItem) {
          updatedItems = currentCart.items.map(item =>
            item.book._id === book._id
              ? { ...item, quantity: item.quantity + quantity, itemSubtotal: book.price * (item.quantity + quantity) }
              : item
          );
        } else {
          const newItem = {
            _id: `temp-${Date.now()}`,
            book: book,
            quantity: quantity,
            itemSubtotal: book.price * quantity,
            isAvailable: true,
            addedAt: new Date().toISOString(),
          };
          updatedItems = [...currentCart.items, newItem];
        }
        
        // Recalculate summary
        const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = updatedItems.reduce((sum, item) => sum + item.itemSubtotal, 0);
        const tax = subtotal * 0.08;
        const shipping = subtotal > 50 ? 0 : 5.99;
        const total = subtotal + tax + shipping;
        
        set({
          cart: {
            items: updatedItems,
            summary: {
              totalItems,
              subtotal: parseFloat(subtotal.toFixed(2)),
              tax: parseFloat(tax.toFixed(2)),
              shipping: parseFloat(shipping.toFixed(2)),
              total: parseFloat(total.toFixed(2)),
              hasUnavailableItems: currentCart.summary.hasUnavailableItems,
            },
          },
        });
        
        // Then sync with server
        return await get().addToCart(book._id, quantity);
      },

      // Reset cart (for logout)
      resetCart: () => {
        set({
          cart: {
            items: [],
            summary: {
              totalItems: 0,
              subtotal: 0,
              tax: 0,
              shipping: 0,
              total: 0,
              hasUnavailableItems: false,
            },
          },
          isLoading: false,
          isSubmitting: false,
        });
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        cart: state.cart,
      }),
    }
  )
);

export default useCartStore;