import { useCartData } from './useCartData';
import { useCheckout } from './useCheckout';

export function useCart({ country } = {}) {
  const cartData = useCartData();
  const checkout = useCheckout({ cartItems: cartData.cartItems, country });

  return {
    ...cartData,
    checkout,
  };
}

export { useCartData } from './useCartData';
export { useCheckout } from './useCheckout';
