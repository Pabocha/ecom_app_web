import { create } from 'zustand';
import { productService } from '@/features/product/services/productService';
import { useCartStore } from '@/stores/cartStore';

function collectVariantMap(structure = [], nodes = []) {
  const map = {};
  structure.forEach((_, i) => map[structure[i]] = []);

  function traverse(list, depth = 0) {
    if (!list) return;
    for (const node of list) {
      const key = structure[depth];
      if (key && !map[key].includes(node.value)) map[key].push(node.value);
      if (node.children) traverse(node.children, depth + 1);
    }
  }

  traverse(nodes, 0);
  return map;
}

function findLeafBySelection(structure = [], nodes = [], selection = {}) {
  let current = nodes;
  for (let depth = 0; depth < structure.length; depth++) {
    const wanted = selection[structure[depth]];
    if (!current) return null;
    const found = current.find(n => n.value === wanted);
    if (!found) return null;
    current = found.children;
  }

  // current should now be an array of leaf variant objects (with id)
  if (!Array.isArray(current) || current.length === 0) return null;

  // If there are multiple leaves, try to match attributes
  const leaves = current;
  const leaf = leaves.find(l => {
    if (!l.attributes) return true;
    return l.attributes.every(attr => selection[attr.attribute_code] == null || selection[attr.attribute_code] === attr.value);
  }) || leaves[0];

  return leaf;
}

export const useVariantStore = create((set, get) => ({
  open: false,
  loading: false,
  product: null,
  raw: null,
  variantsMap: null,
  selection: {},

  openVariant: async (product) => {
    set({ loading: true, open: false, product, raw: null, variantsMap: null, selection: {} });
    try {
      const resp = await productService.getProductVariant(product.id);
      const data = resp?.data || resp;
      const structure = data.structure || [];
      const nodes = data.variants || [];
      const variantsMap = collectVariantMap(structure, nodes);
      const selection = Object.fromEntries(Object.keys(variantsMap).map(k => [k, variantsMap[k][0]]));

      set({ loading: false, open: true, raw: data, variantsMap, selection, product });
    } catch (error) {
      console.error('Erreur fetching variants', error);
      set({ loading: false, open: false, raw: null, variantsMap: null, selection: {}, product: null });
    }
  },

  setSelection: (name, value) => set(state => ({ selection: { ...state.selection, [name]: value } })),

  close: () => set({ open: false, product: null, raw: null, variantsMap: null, selection: {} }),

  confirm: () => {
    const state = get();
    const structure = state.raw?.structure || [];
    const leaf = findLeafBySelection(structure, state.raw?.variants || [], state.selection);
    const price = leaf?.price_override ?? leaf?.price_override ?? state.product?.price ?? state.product?.base_price;

    const label = Object.entries(state.selection).map(([k, v]) => `${k}: ${v}`).join(' · ');

    const cartItem = {
      ...state.product,
      cartKey: `${state.product.id}-${Object.values(state.selection).join('-')}`,
      name: `${state.product.name} (${label})`,
      selectedVariants: state.selection,
      variant_id: leaf?.id,
      sku: leaf?.sku,
      stock: leaf?.stock,
      price: price,
    };

    const addToCart = useCartStore.getState().addToCart;
    addToCart(cartItem, true);
    set({ open: false, product: null, raw: null, variantsMap: null, selection: {} });
  },
}));
