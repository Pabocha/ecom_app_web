import { create } from 'zustand';

// AJOUT — Store UI pour les modales et états d'interface
export const useUIStore = create((set) => ({
  loginModalOpen: false,

  openLoginModal: () => set({ loginModalOpen: true }),
  closeLoginModal: () => set({ loginModalOpen: false }),
}));
