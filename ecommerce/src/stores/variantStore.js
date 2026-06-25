import { create } from 'zustand';
import { productService } from '@/features/product/services/productService';
import { useCartStore } from '@/stores/cartStore';

// MODIFICATION ICI — Reconstruction de la sélection valide dans l'arbre
function getValidSelection(raw, selection) {
  const { structure, variants } = raw;
  const result = {};
  let nodes = variants;

  for (let i = 0; i < structure.length; i++) {
    const attrCode = structure[i];
    const currentVal = selection[attrCode];
    const availableValues = (nodes || []).map(n => n.value);
    const validVal = availableValues.includes(currentVal) ? currentVal : availableValues[0];
    if (!validVal) break;
    result[attrCode] = validVal;
    const node = (nodes || []).find(n => n.value === validVal);
    if (!node?.children) break;
    nodes = node.children;
  }

  return result;
}

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

  if (!Array.isArray(current) || current.length === 0) return null;

  const leaves = current;
  const leaf = leaves.find(l => {
    if (!l.attributes) return true;
    return l.attributes.every(attr => selection[attr.attribute_code] == null || selection[attr.attribute_code] === attr.value);
  }) || leaves[0];

  return leaf;
}

// MODIFICATION ICI — Helper pour les options disponibles à un niveau donné
function getAvailableOptionsAtLevel(raw, selection) {
  const { structure, variants } = raw;
  const keys = Object.keys(selection);
  let nodes = variants;

  for (let i = 0; i < keys.length; i++) {
    const attrCode = structure[i];
    const val = selection[attrCode];
    if (!val) break;
    const node = (nodes || []).find(n => n.value === val);
    if (!node?.children) break;
    nodes = node.children;
  }

  const nextAttrCode = structure[keys.length];
  if (!nextAttrCode) return { attribute: null, options: [], isLeaf: true };

  return {
    attribute: nextAttrCode,
    options: (nodes || []).map(n => ({
      value: n.value,
      hexColor: null,
    })),
    isLeaf: false,
  };
}

// MODIFICATION ICI — Récupère hex_color pour une valeur à un niveau donné
function getHexForValue(raw, selection, attrCode, value) {
  const { structure, variants } = raw;
  const tempSel = { ...selection, [attrCode]: value };
  let nodes = variants;
  for (let i = 0; i < structure.length; i++) {
    const key = structure[i];
    const val = tempSel[key];
    if (!val) break;
    const node = (nodes || []).find(n => n.value === val);
    if (!node) break;
    if (!node.children || node.children.length === 0) {
      const attr = node.attributes?.find(a => a.attribute_code === attrCode);
      return attr?.hex_color || null;
    }
    nodes = node.children;
  }
  return null;
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

      // MODIFICATION ICI — Sélection initiale via l'arbre (pas à plat)
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

      set({ loading: false, open: true, raw: data, variantsMap, selection: initialSelection, product });
    } catch (error) {
      console.error('Erreur fetching variants', error);
      set({ loading: false, open: false, raw: null, variantsMap: null, selection: {}, product: null });
    }
  },

  // MODIFICATION ICI — Cascade dans l'arbre lors du changement de sélection
  setSelection: (name, value) => set(state => {
    const newSelection = { ...state.selection, [name]: value };
    if (state.raw) {
      const validSelection = getValidSelection(state.raw, newSelection);
      return { selection: validSelection };
    }
    return { selection: newSelection };
  }),

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
