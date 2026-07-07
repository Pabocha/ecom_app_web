import { useCartData } from './useCartData';
import { useCartUI } from './useCartUI';
import { useCheckout } from './useCheckout';

// MODIFICATION ICI — Accepte form pour la synchro store (CheckoutPage)
export function useCart({ form } = {}) {
  const cartUI = useCartUI();
  const cartData = useCartData({
    setCartOpen: cartUI.setCartOpen,
    setPendingKey: cartUI.setPendingKey,
  });
  const checkout = useCheckout({ cartItems: cartData.cartItems, form });

  return {
    ...cartData,
    cartOpen: cartUI.cartOpen,
    setCartOpen: cartUI.setCartOpen,
    isPending: cartUI.isPending,
    checkout,
  };
}

export { useCartData } from './useCartData';
export { useCartUI } from './useCartUI';
export { useCheckout } from './useCheckout';
