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
      lineId: item.id,
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
  loadingKeys: {},

  setCartOpen: (open) => set({ cartOpen: open }),

  setLoadingKey: (key, value) => set(state => ({
    loadingKeys: { ...state.loadingKeys, [key]: value },
  })),

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

  changeQty: async (id, delta) => {
    const { cartItems } = get();
    const item = cartItems.find(i => (i.cartKey || String(i.id)) === id);
    if (!item) return;
    const cartKey = item.cartKey || String(item.id);
    get().setLoadingKey(cartKey, true);
    const newQty = Math.max(1, item.qty + delta);
    try {
      await cartService.changeQuantityItem(item.lineId, { quantity: newQty });
      await get().fetchCart();
    } catch (error) {
      console.error('Erreur changement quantité:', error);
    } finally {
      get().setLoadingKey(cartKey, false);
    }
  },

  removeItem: async (id) => {
    const { cartItems } = get();
    const item = cartItems.find(i => (i.cartKey || String(i.id)) === id);
    if (!item) return;
    const cartKey = item.cartKey || String(item.id);
    get().setLoadingKey(cartKey, true);
    try {
      const payload = item.is_variant_item
        ? { variant_id: item.variant_id }
        : { product_id: item.id };
      await cartService.removeCartItem(payload);
      await get().fetchCart();
    } catch (error) {
      console.error('Erreur suppression article:', error);
    } finally {
      get().setLoadingKey(cartKey, false);
    }
  },

  clearCart: async () => {
    try {
      await cartService.clearCart();
      set({ cartItems: [] });
    } catch (error) {
      console.error('Erreur vidage panier:', error);
    }
  },
}));
