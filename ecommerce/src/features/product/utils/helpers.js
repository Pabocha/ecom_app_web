// MODIFICATION ICI — Arbre de variantes dynamique (N niveaux)
export function extractVariantData(tree) {
  if (!tree?.variants?.length) return null;

  const findLeaf = (n) => n.children?.length ? findLeaf(n.children[0]) : n;
  const leaf = tree.variants.length ? findLeaf(tree.variants[0]) : null;

  const attrInfo = (tree.structure || []).map(code => {
    const attr = leaf?.attributes?.find(a => a.attribute_code === code);
    return {
      code,
      name: attr?.attribute_name || code,
      hasHex: !!attr?.hex_color,
    };
  });

  return {
    structure: tree.structure || [],
    attrInfo,
    levels: tree.variants,
  };
}

export function buildSpecs(p) {
  const s = [];
  if (p.brand) s.push(['Marque', p.brand]);
  if (p.country_origin) s.push(['Origine', p.country_origin]);
  if (p.min_order_quantity && p.min_order_quantity > 1) s.push(['Quantité min.', p.min_order_quantity]);
  if (p.specific_fields_display) Object.entries(p.specific_fields_display).forEach(([k, v]) => { if (v) s.push([k, v]); });
  if (p.status) s.push(['Statut', p.status === 'available' ? 'Disponible' : p.status]);
  return s;
}

export function buildVolumePricing(priceTiers, pricingDisplay) {
  return (priceTiers || []).map((tier, i, arr) => {
    const base = pricingDisplay?.price || tier.price;
    const economia = tier.max_quantity ? `Éco. ${Math.round((1 - tier.price / base) * 100)}%` : '';
    return {
      qty: `${tier.min_quantity}${tier.max_quantity ? '-' + tier.max_quantity : '+'}`,
      price: tier.price,
      best: i === arr.length - 1,
      label: economia,
    };
  });
}

export function buildDetailFromApi(productDetail) {
  const variantData = extractVariantData(productDetail.variant_tree);
  const volumePricing = buildVolumePricing(productDetail.price_tiers, productDetail.pricing_display);
  const specs = buildSpecs(productDetail);
  const stock = productDetail.stock_quantity ?? productDetail.total_stock ?? 0;

  return {
    description: productDetail.description || '',
    descLines: (productDetail.description || '').split('\n').filter(Boolean),
    specs,
    volumePricing,
    ratingDist: [0, 0, 0, 0, 0],
    reviews: [],
    questions: [],
    supplier: {
      name: productDetail.shop_name || '',
      logo: '',
      location: '',
      since: '',
      transactions: '',
      responseRate: '',
    },
    variantData,
    stock,
  };
}
