export function normalizeCartItems(results = []) {
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