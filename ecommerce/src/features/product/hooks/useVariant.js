import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { productService } from '@/features/product/services/productService';
import { cartService } from '@/features/cart/services/cartService';
import { useVariantStore } from '@/stores/variantStore';
import { collectVariantMap, findLeafBySelection } from '@/features/product/utils/helpers';
import { CART_ITEMS_QUERY_KEY } from '@/features/cart/hooks/cartQueryKeys';

// Hook contenant la logique métier d'ouverture et confirmation de la modale variante
export function useVariantActions() {
  const queryClient = useQueryClient();

  // Ouvre la modale variante : fetch API + traitement + mise à jour du store
  const openVariant = useCallback(async (product) => {
    const store = useVariantStore.getState();
    store.setLoading(true);

    try {
      const resp = await productService.getProductVariant(product.id);
      const data = resp?.data || resp;
      const structure = data.structure || [];
      const nodes = data.variants || [];
      const variantsMap = collectVariantMap(structure, nodes);

      // Sélection initiale : première valeur de chaque niveau
      let initialSelection = {};
      let currentNodes = nodes;
      for (const attrCode of structure) {
        const firstVal = currentNodes[0]?.value;
        if (!firstVal) break;
        initialSelection[attrCode] = firstVal;
        const node = currentNodes.find(n => n.value === firstVal);
        if (!node?.children) break;
        currentNodes = node.children;
      }

      store.setRaw(data);
      store.setVariantsMap(variantsMap);
      store.setProduct(product);
      useVariantStore.setState({ selection: initialSelection, loading: false, open: true });
    } catch (error) {
      console.error('Erreur fetching variants', error);
      store.close();
    }
  }, []);

  // Confirme la sélection : construit l'item + appel API panier + invalidation cache
  const confirmVariant = useCallback(() => {
    const state = useVariantStore.getState();
    if (!state.raw) return;

    const structure = state.raw?.structure || [];
    const leaf = findLeafBySelection(structure, state.raw?.variants || [], state.selection);
    const price = leaf?.price_override ?? leaf?.price_override ?? state.product?.price ?? state.product?.base_price;

    const label = Object.entries(state.selection).map(([k, v]) => `${k}: ${v}`).join(' · ');

    // Appel API pour ajouter au panier
    cartService.addCartItems({ variant: leaf?.id, quantity: 1 });
    queryClient.invalidateQueries({ queryKey: CART_ITEMS_QUERY_KEY });
    state.close();
  }, [queryClient]);

  return { openVariant, confirmVariant };
}
