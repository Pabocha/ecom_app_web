import { useCartStore } from '@/stores/cartStore';
import { useShallow } from 'zustand/react/shallow';
import { useVariantStore } from '@/stores/variantStore';

export function useCart() {
  const wrapped = useCartStore(useShallow((state) => ({
    cartItems: state.cartItems,
    cartOpen: state.cartOpen,
    setCartOpen: state.setCartOpen,
    _addToCart: state.addToCart,
    changeQty: state.changeQty,
    removeItem: state.removeItem,
    clearCart: state.clearCart,
    cartCount: state.cartItems.reduce((sum, item) => sum + item.qty, 0),
  })));

  // wrapper that opens variant modal when a product has variants
  const addToCart = (product, openSidebar = true) => {
    // If product has variants but selection already provided, add directly
    if (product?.has_variant && !product.selectedVariants && !product.variant_id) {
      // open variant selector which will add to cart on confirm
      useVariantStore.getState().openVariant(product);
      return;
    }
    return wrapped._addToCart(product, openSidebar);
  };

  return { ...wrapped, addToCart };
}

// export function useCartActions() {
//   return useCartStore((state) => ({
//     addToCart: state.addToCart,
//     changeQty: state.changeQty,
//     removeItem: state.removeItem,
//     clearCart: state.clearCart,
//   }))
// }