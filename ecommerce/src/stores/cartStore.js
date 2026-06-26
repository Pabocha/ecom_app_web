import { create } from 'zustand';
import { cartService } from '@/features/cart/services/cartService';

// MODIFICATION ICI — Normalise la réponse API vers le format attendu par les composants
function normalizeCartItems(results = []) {
  return results.map(item => {
    const base = {
      name: item.product_name || item.name || 'Produit',
      img: item.product_image || item.image || '',
      price: Number(item.price || item.unit_price || 0),
      qty: item.quantity || 1,
      supplier: item.shop_name || item.supplier || '',
    };
    if (item.is_variant_item) {
      const attributes = item.variant_attributes || [];
      return {
        ...base,
        id: item.variant,
        cartKey: `v-${item.variant}`,
        selectedVariants: attributes.reduce((acc, a) => ({ ...acc, [a.attribute]: a.value }), {}),
        variant_id: item.variant,
        is_variant_item: true,
      };
    }
    return {
      ...base,
      id: item.product,
      cartKey: String(item.product),
      is_variant_item: false,
    };
  });
}

export const useCartStore = create((set, get) => ({
  cartItems: [],
  cartOpen: false,
  loading: false,

  setCartOpen: (open) => set({ cartOpen: open }),

  // MODIFICATION ICI — Récupère le panier depuis l'API
  fetchCart: async () => {
    set({ loading: true });
    try {
      const resp = await cartService.getCartItems();
      const data = resp?.data || resp;
      const results = data?.results || data || [];
      set({ cartItems: normalizeCartItems(results), loading: false });
    } catch (error) {
      console.error('Erreur chargement panier:', error);
      set({ loading: false });
    }
  },

  // MODIFICATION ICI — Ajoute via API puis refetch
  addToCart: async (product, openSidebar = true) => {
    if (openSidebar) set({ cartOpen: true });
    try {
      const payload = product.variant_id
        ? { variant: product.variant_id, quantity: product.qty || 1 }
        : { product: product.id, quantity: product.qty || 1 };
      await cartService.addCartItems(payload);
      await get().fetchCart();
    } catch (error) {
      console.error('Erreur ajout panier:', error);
    }
  },

  // MODIFICATION ICI — Change la quantité via API puis refetch
  changeQty: async (id, delta) => {
    const { cartItems } = get();
    const item = cartItems.find(i => (i.cartKey || String(i.id)) === id);
    if (!item) return;
    const newQty = Math.max(1, item.qty + delta);
    try {
      const payload = item.is_variant_item
        ? { variant: item.variant_id, quantity: newQty }
        : { product: item.id, quantity: newQty };
      await cartService.changeQuantityItem(payload);
      await get().fetchCart();
    } catch (error) {
      console.error('Erreur changement quantité:', error);
    }
  },

  // MODIFICATION ICI — Supprime via API puis refetch
  removeItem: async (id) => {
    const { cartItems } = get();
    const item = cartItems.find(i => (i.cartKey || String(i.id)) === id);
    if (!item) return;
    try {
      const payload = item.is_variant_item
        ? { data: { variant: item.variant_id } }
        : { data: { product: item.id } };
      await cartService.removeCartItem(payload);
      await get().fetchCart();
    } catch (error) {
      console.error('Erreur suppression article:', error);
    }
  },

  // MODIFICATION ICI — Vide le panier via API
  clearCart: async () => {
    try {
      await cartService.clearCart();
      set({ cartItems: [] });
    } catch (error) {
      console.error('Erreur vidage panier:', error);
    }
  },
}));
