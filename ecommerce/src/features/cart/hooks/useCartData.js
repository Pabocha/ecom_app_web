import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useVariantActions } from '@/features/product/hooks/useVariant';
import { cartService } from '@/features/cart/services/cartService';
import { normalizeCartItems } from '@/features/cart/utils/helpers.js';
import { CART_ITEMS_QUERY_KEY } from './cartQueryKeys';

export function useCartData() {
  const queryClient = useQueryClient();
  const { openVariant } = useVariantActions();
  const [pendingKey, setPendingKey] = useState(null);
  const [addingId, setAddingId] = useState(null);

  const isPending = (itemKey) => pendingKey === itemKey;

  const { data: cartItems = [] } = useQuery({
    queryKey: CART_ITEMS_QUERY_KEY,
    queryFn: async () => {
      const resp = await cartService.getCartItems();
      const data = resp?.data || resp;
      const results = data?.results || data || [];
      return normalizeCartItems(results);
    },
    staleTime: 30_000,
  });

  const addMutation = useMutation({
    mutationFn: (product) => {
      const payload = product.variant_id
        ? { variant: product.variant_id, quantity: product.qty || 1 }
        : { product: product.id, quantity: product.qty || 1 };
      return cartService.addCartItems(payload);
    },
    onSuccess: () => {
      setAddingId(null);
      queryClient.invalidateQueries({ queryKey: CART_ITEMS_QUERY_KEY });
    },
    onError: () => {
      setAddingId(null);
    },
  });

  const changeQtyMutation = useMutation({
    mutationFn: ({ lineId, quantity }) =>
      cartService.changeQuantityItem(lineId, { quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_ITEMS_QUERY_KEY }),
  });

  const removeMutation = useMutation({
    mutationFn: (payload) => cartService.removeCartItem(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_ITEMS_QUERY_KEY }),
  });

  const clearMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_ITEMS_QUERY_KEY }),
  });

  const addToCart = (product) => {
    if (product?.has_variant && !product.selectedVariants && !product.variant_id) {
      openVariant(product);
      return;
    }
    setAddingId(product.id);
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
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return {
    cartItems,
    cartCount,
    addToCart,
    addingId,
    changeQty,
    removeItem,
    clearCart,
    clearMutation,
    isPending,
  };
}
