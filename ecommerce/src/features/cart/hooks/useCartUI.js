import { useState } from 'react';
import { useCartStore } from '@/stores/cartStore';

export function useCartUI() {
  const { cartOpen, setCartOpen } = useCartStore();
  const [pendingKey, setPendingKey] = useState(null);

  const isPending = (itemKey) => pendingKey === itemKey;

  return {
    cartOpen,
    setCartOpen,
    pendingKey,
    setPendingKey,
    isPending,
  };
}
