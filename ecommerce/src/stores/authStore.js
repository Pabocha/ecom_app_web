import { create } from 'zustand';

// MODIFICATION ICI — Store mémoire, plus de persist (refresh token HttpOnly cookie)
export const useAuthStore = create((set) => ({
  user: null,
  access: null,
  isAuthenticated: false,

  // AJOUT — setUser pour useCheckAuth
  setUser: (user) => set({ user, isAuthenticated: true }),

  loginSuccess: (user, access) =>
    set({ user, access, isAuthenticated: true }),

  logout: () =>
    set({ user: null, access: null, isAuthenticated: false }),
}));
