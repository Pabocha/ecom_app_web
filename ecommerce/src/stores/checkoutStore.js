import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialCheckoutData = {
  full_address: '',
  city: '',
  postal_code: '',
  country: 'SN',
  phone_number: '',
};

export const useCheckoutStore = create(
  persist(
    (set) => ({
      checkoutData: initialCheckoutData,
      setCheckoutData: (data) => set((state) => ({
        checkoutData: {
          ...state.checkoutData,
          ...data,
        },
      })),
      clearCheckoutData: () => set({ checkoutData: initialCheckoutData }),
    }),
    {
      name: 'checkout-storage',
    },
  ),
);
