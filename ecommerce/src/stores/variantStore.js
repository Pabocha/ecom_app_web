import { create } from 'zustand';
import { getValidSelection } from '@/features/product/utils/helpers';

// Store mémoire pour l'état de la modale variante
// Toute la logique métier (appels API, mutations panier) est dans features/product/hooks/useVariant.js
export const useVariantStore = create((set) => ({
  open: false,
  loading: false,
  product: null,
  raw: null,
  variantsMap: null,
  selection: {},

  setLoading: (loading) => set({ loading }),
  setOpen: (open) => set({ open }),
  setProduct: (product) => set({ product }),
  setRaw: (raw) => set({ raw }),
  setVariantsMap: (variantsMap) => set({ variantsMap }),

  // Cascade dans l'arbre lors du changement de sélection
  setSelection: (name, value) => set(state => {
    const newSelection = { ...state.selection, [name]: value };
    if (state.raw) {
      const validSelection = getValidSelection(state.raw, newSelection);
      return { selection: validSelection };
    }
    return { selection: newSelection };
  }),

  // Réinitialise tout l'état de la modale
  close: () => set({ open: false, product: null, raw: null, variantsMap: null, selection: {}, loading: false }),
}));
