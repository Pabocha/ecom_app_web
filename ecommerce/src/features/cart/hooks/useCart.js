import { useCartStore } from '@/stores/cartStore';
import { useShallow } from 'zustand/react/shallow';

export function useCart() {
  return useCartStore(useShallow((state) => ({
    cartItems: state.cartItems,
    cartOpen: state.cartOpen,
    setCartOpen: state.setCartOpen,
    // addToCart: state.addToCart,
    // changeQty: state.changeQty,
    // removeItem: state.removeItem,
    // clearCart: state.clearCart,
    cartCount: state.cartItems.reduce((sum, item) => sum + item.qty, 0),
  })));
}

export function useCartActions() {
  return useCartStore((state) => ({
    addToCart: state.addToCart,
    changeQty: state.changeQty,
    removeItem: state.removeItem,
    clearCart: state.clearCart,
  }))
}