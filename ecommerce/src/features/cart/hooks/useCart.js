import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCartStore } from '@/stores/cartStore';
import { useVariantStore } from '@/stores/variantStore';
import { cartService } from '@/features/cart/services/cartService';

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

export function useCart() {
  const queryClient = useQueryClient();
  const { cartOpen, setCartOpen } = useCartStore();
  const [pendingKey, setPendingKey] = useState(null);

  const { data: cartItems = [] } = useQuery({
    queryKey: ["cart-items"],
    queryFn: async () => {
      const resp = await cartService.getCartItems();
      const data = resp?.data || resp;
      const results = data?.results || data || [];
      return normalizeCartItems(results);
    },
  });

  const addMutation = useMutation({
    mutationFn: (product) => {
      const payload = product.variant_id
        ? { variant: product.variant_id, quantity: product.qty || 1 }
        : { product: product.id, quantity: product.qty || 1 };
      return cartService.addCartItems(payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart-items"] }),
  });

  const changeQtyMutation = useMutation({
    mutationFn: ({ lineId, quantity }) =>
      cartService.changeQuantityItem(lineId, { quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart-items"] }),
  });

  const removeMutation = useMutation({
    mutationFn: (payload) => cartService.removeCartItem(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart-items"] }),
  });

  const clearMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart-items"] }),
  });

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const addToCart = (product, openSidebar = true) => {
    if (product?.has_variant && !product.selectedVariants && !product.variant_id) {
      useVariantStore.getState().openVariant(product);
      return;
    }
    if (openSidebar) setCartOpen(true);
    addMutation.mutate(product);
  };

  const changeQty = (id, delta) => {
    const item = cartItems.find(i => (i.cartKey || String(i.id)) === id);
    if (!item) return;
    const cartKey = item.cartKey || String(item.id);
    setPendingKey(cartKey);
    changeQtyMutation.mutate(
      { lineId: item.lineId, quantity: Math.max(1, item.qty + delta) },
      { onSettled: () => setPendingKey(null) },
    );
  };

  const removeItem = (id) => {
    const item = cartItems.find(i => (i.cartKey || String(i.id)) === id);
    if (!item) return;
    const cartKey = item.cartKey || String(item.id);
    setPendingKey(cartKey);
    const payload = item.is_variant_item
      ? { variant_id: item.variant_id }
      : { product_id: item.id };
    removeMutation.mutate(payload, {
      onSettled: () => setPendingKey(null),
    });
  };

  const clearCart = () => clearMutation.mutate();

  const isPending = (itemKey) => pendingKey === itemKey;

  return {
    cartItems,
    cartOpen,
    setCartOpen,
    cartCount,
    addToCart,
    changeQty,
    removeItem,
    clearCart,
    isPending,
  };
}
