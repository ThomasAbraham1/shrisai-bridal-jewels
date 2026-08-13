import { create } from 'zustand';
import { BaseCrudService } from '@/integrations/BaseCrudService';

export const CartItem = null as unknown as CartItem;
export interface CartItem {
  id: string;
  collectionId: string;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  isOpen: boolean;
  isCheckingOut: boolean;
  addingItemId: string | null;
  _initialized: boolean;
}

interface CartActions {
  addToCart: (params: { collectionId: string; itemId: string; quantity?: number }) => Promise<void>;
  removeFromCart: (item: CartItem) => Promise<void>;
  updateQuantity: (item: CartItem, quantity: number) => Promise<void>;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  checkout: () => Promise<void>;
  _initialize: () => Promise<void>;
}

type CartStore = CartState & { actions: CartActions };

/**
 * Zustand store for managing shopping cart
 * Integrates with Wix eCommerce cart system
 */
export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  itemCount: 0,
  totalPrice: 0,
  isOpen: false,
  isCheckingOut: false,
  addingItemId: null,
  _initialized: false,

  actions: {
    _initialize: async () => {
      try {
        // Initialize with empty cart
        set({ _initialized: true });
      } catch (error) {
        console.error('Failed to initialize cart:', error);
        set({ _initialized: true });
      }
    },

    addToCart: async (params: { collectionId: string; itemId: string; quantity?: number }) => {
      const { collectionId, itemId, quantity = 1 } = params;
      set({ addingItemId: itemId });

      try {
        const state = get();
        const existingItem = state.items.find(item => item.itemId === itemId);
        
        if (existingItem) {
          const updatedItems = state.items.map(item =>
            item.itemId === itemId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
          const totalPrice = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
          set({ items: updatedItems, itemCount, totalPrice, addingItemId: null });
        } else {
          // Fetch product details from CMS
          const product = await BaseCrudService.getById<any>(collectionId, itemId);
          
          let productName = 'Product';
          let productPrice = 0;
          let productImage: string | undefined;

          // Handle different collection types
          if (collectionId === 'jewelleryproducts') {
            productName = product?.itemName || 'Product';
            productPrice = product?.itemPrice || product?.ourPrice || 0;
            productImage = product?.itemImage;
          } else if (collectionId === 'rentalproducts') {
            productName = product?.name || 'Product';
            productPrice = product?.price || 0;
            productImage = product?.image;
          }

          const newItem: CartItem = {
            id: `${collectionId}-${itemId}`,
            collectionId: collectionId,
            itemId: itemId,
            name: productName,
            price: productPrice,
            quantity: quantity,
            image: productImage,
          };
          const updatedItems = [...state.items, newItem];
          const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
          const totalPrice = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
          set({ items: updatedItems, itemCount, totalPrice, addingItemId: null });
        }
      } catch (error) {
        console.error('Failed to add to cart:', error);
        set({ addingItemId: null });
      }
    },

    removeFromCart: async (item: CartItem) => {
      try {
        const state = get();
        const updatedItems = state.items.filter(cartItem => cartItem.id !== item.id);
        const itemCount = updatedItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
        const totalPrice = updatedItems.reduce((sum, cartItem) => sum + cartItem.price * cartItem.quantity, 0);
        set({ items: updatedItems, itemCount, totalPrice });
      } catch (error) {
        console.error('Failed to remove from cart:', error);
      }
    },

    updateQuantity: async (item: CartItem, quantity: number) => {
      if (quantity < 1) return;

      try {
        const state = get();
        const updatedItems = state.items.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity }
            : cartItem
        );
        const itemCount = updatedItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
        const totalPrice = updatedItems.reduce((sum, cartItem) => sum + cartItem.price * cartItem.quantity, 0);
        set({ items: updatedItems, itemCount, totalPrice });
      } catch (error) {
        console.error('Failed to update quantity:', error);
      }
    },

    toggleCart: () => {
      set((state) => ({ isOpen: !state.isOpen }));
    },

    openCart: () => {
      set({ isOpen: true });
    },

    closeCart: () => {
      set({ isOpen: false });
    },

    clearCart: async () => {
      try {
        set({ items: [], itemCount: 0, totalPrice: 0 });
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    },

    checkout: async () => {
      try {
        set({ isCheckingOut: true });
        // Get current cart items
        const state = get();
        if (state.items.length === 0) {
          set({ isCheckingOut: false });
          return;
        }
        
        // Prepare items for checkout
        const checkoutItems = state.items.map(item => ({
          collectionId: item.collectionId,
          itemId: item.itemId,
          quantity: item.quantity
        }));
        
        // Log checkout attempt
        console.log('Initiating checkout with items:', checkoutItems);
        
        // Close cart and reset checkout state
        // The Cart component will handle the navigation via useNavigate
        set({ isCheckingOut: false, isOpen: false });
      } catch (error) {
        console.error('Failed to checkout:', error);
        set({ isCheckingOut: false });
      }
    },
  },
}));
