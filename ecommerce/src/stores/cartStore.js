import { create } from 'zustand';

export const useCartStore = create((set) => ({
  cartOpen: false,
  setCartOpen: (open) => set({ cartOpen: open }),
}));
