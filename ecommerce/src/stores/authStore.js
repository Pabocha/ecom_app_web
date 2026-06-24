import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      access: null,
      refresh: null,
      isAuthenticated: false,

      loginSuccess: (user, access, refresh) =>
        set({ user, access, refresh, isAuthenticated: true }),

      logout: () =>
        set({ user: null, access: null, refresh: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, access: state.access, refresh: state.refresh, isAuthenticated: state.isAuthenticated }),
    }
  )
);
