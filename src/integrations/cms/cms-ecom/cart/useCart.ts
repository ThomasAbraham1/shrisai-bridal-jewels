import { useEffect } from 'react';
import { useCartStore } from './useCartStore';

/**
 * Hook to access cart state and actions
 * Automatically initializes cart on first use
 *
 * @returns Object with cart items, total price, and actions
 *
 * @example
 * ```typescript
 * const { items, itemCount, totalPrice, isOpen, actions } = useCart();
 * 
 * // Add to cart
 * actions.addToCart({ collectionId: 'products', itemId: 'item-123', quantity: 1 });
 * 
 * // Remove from cart
 * actions.removeFromCart(cartItem);
 * 
 * // Update quantity
 * actions.updateQuantity(cartItem, 5);
 * 
 * // Toggle cart visibility
 * actions.toggleCart();
 * ```
 */
export function useCart() {
  const store = useCartStore();
  const { _initialized, actions } = store;

  useEffect(() => {
    if (!_initialized) {
      actions._initialize();
    }
  }, [_initialized, actions]);

  return {
    items: store.items,
    itemCount: store.itemCount,
    totalPrice: store.totalPrice,
    isOpen: store.isOpen,
    isCheckingOut: store.isCheckingOut,
    addingItemId: store.addingItemId,
    actions: {
      addToCart: actions.addToCart,
      removeFromCart: actions.removeFromCart,
      updateQuantity: actions.updateQuantity,
      toggleCart: actions.toggleCart,
      openCart: actions.openCart,
      closeCart: actions.closeCart,
      clearCart: actions.clearCart,
      checkout: actions.checkout,
    },
  };
}
