import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      cartOpen: false,

      setCartOpen: (open) => set({ cartOpen: open }),

      addToCart: (product, openSidebar = true) =>
        set((state) => {
          const cartKey = product.cartKey || String(product.id);
          const existing = state.cartItems.find(
            (item) => (item.cartKey || String(item.id)) === cartKey
          );

          if (existing) {
            const nextItems = state.cartItems.map((item) =>
              (item.cartKey || String(item.id)) === cartKey
                ? { ...item, qty: item.qty + 1 }
                : item
            );
            return {
              cartItems: nextItems,
              cartOpen: openSidebar ? true : state.cartOpen,
            };
          }

          return {
            cartItems: [
              ...state.cartItems,
              { ...product, cartKey, qty: 1 },
            ],
            cartOpen: openSidebar ? true : state.cartOpen,
          };
        }),

      changeQty: (id, delta) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            (item.cartKey || item.id) === id
              ? { ...item, qty: Math.max(1, item.qty + delta) }
              : item
          ),
        })),

      removeItem: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter(
            (item) => (item.cartKey || item.id) !== id
          ),
        })),

      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cartItems: state.cartItems, cartOpen: state.cartOpen }),
    }
  )
);