// ============================
// Helpers arbre de variantes (variant_tree)
// ============================

// Extrait les infos de structure d'un arbre de variantes (N niveaux)
export function extractVariantData(tree) {
  if (!tree?.variants?.length) return null;

  const findLeaf = (n) => n.children?.length ? findLeaf(n.children[0]) : n;
  const leaf = tree.variants.length ? findLeaf(tree.variants[0]) : null;
  
  const attrInfo = (tree.structure || []).map(code => {
    const attr = leaf?.attributes?.find(a => a.attribute_code === code);
    console.log(`trouvaille : ${leaf?.attributes}`)
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

// Reconstruit une sélection valide dans l'arbre (corrige les incohérences)
export function getValidSelection(raw, selection) {
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

// Collecte toutes les valeurs possibles pour chaque niveau de l'arbre
export function collectVariantMap(structure = [], nodes = []) {
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

// Trouve la feuille (variante finale) correspondant à une sélection donnée
export function findLeafBySelection(structure = [], nodes = [], selection = {}) {
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

// Retourne les options disponibles à un niveau donné selon la sélection courante
export function getAvailableOptionsAtLevel(raw, selection) {
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

// Récupère la couleur hexa d'une valeur dans l'arbre
export function getHexForValue(raw, selection, attrCode, value) {
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

// Retourne les options disponibles à un niveau donné (pour VariantModal - arbre raw)
export function getOptionsAtLevelFromRaw(rawData, sel, level) {
  if (!rawData?.structure?.length || !rawData?.variants?.length) return [];
  const { structure, variants } = rawData;
  let nodes = variants;
  for (let i = 0; i < level; i++) {
    const attrCode = structure[i];
    const val = sel[attrCode];
    if (!val) break;
    const node = (nodes || []).find(n => n.value === val);
    if (!node?.children) break;
    nodes = node.children;
  }
  const attrCode = structure[level];
  return (nodes || []).map(n => {
    let leaf = n;
    while (leaf?.children?.length) leaf = leaf.children[0];
    const hex = leaf?.attributes?.find(a => a.attribute_code === attrCode)?.hex_color || null;
    return { value: n.value, hexColor: hex };
  });
}

// Récupère le nom d'attribut français depuis l'arbre
export function getAttrNameFromRaw(rawData, attrCode) {
  function walk(nodes) {
    if (!nodes) return null;
    for (const n of nodes) {
      if (n.attributes) {
        const attr = n.attributes.find(a => a.attribute_code === attrCode);
        if (attr) return attr.attribute_name;
      }
      if (n.children) {
        const found = walk(n.children);
        if (found) return found;
      }
    }
    return null;
  }
  return walk(rawData?.variants) || attrCode;
}

// Libellé texte de la sélection courante (ex: "Couleur: Bleu · Taille: M")
export function variantLabel(selection) {
  return Object.entries(selection).map(([key, value]) => `${key}: ${value}`).join(' · ');
}

// ============================
// Helpers navigation dans l'arbre (par indices)
// ============================

// Retourne les options d'un niveau dans un arbre structuré par indices
export function getOptionsAtLevel(variantData, selIndices, level) {
  if (!variantData?.levels?.length) return [];
  if (level === 0) return variantData.levels;
  let node = variantData.levels[selIndices[0]];
  for (let i = 1; i < level; i++) {
    if (!node?.children?.[selIndices[i]]) return [];
    node = node.children[selIndices[i]];
  }
  return node?.children || [];
}

// Extrait la couleur hexa d'une option dans un arbre par indices
export function getHexForOption(variantData, selIndices, level, optionIdx) {
  if (!variantData?.levels?.length) return '#ccc';
  let node = variantData.levels[selIndices[0]];
  for (let i = 1; i < level; i++) {
    if (!node?.children?.[selIndices[i]]) return '#ccc';
    node = node.children[selIndices[i]];
  }
  if (level > 0) {
    node = node?.children?.[optionIdx];
  } else {
    node = variantData.levels[optionIdx];
  }
  if (!node) return '#ccc';
  const findLeaf = (n) => n.children?.length ? findLeaf(n.children[0]) : n;
  const leaf = findLeaf(node);
  const attrCode = variantData.attrInfo[level]?.code;
  const attr = leaf?.attributes?.find(a => a.attribute_code === attrCode);
  return attr?.hex_color || '#ccc';
}

// Récupère la variante feuille (finale) pour une sélection par indices
export function getLeafVariant(variantData, selIndices) {
  if (!variantData?.levels?.length) return null;
  const lastLevel = variantData.structure.length - 1;
  if (lastLevel < 0) return null;
  const options = getOptionsAtLevel(variantData, selIndices, lastLevel);
  const node = options?.[selIndices[lastLevel]];
  return node?.children?.[0] || null;
}

// Met à jour un niveau de sélection et reset les niveaux suivants
export function updateLevelSelection(selIndices, level, idx) {
  const next = [...selIndices];
  next[level] = idx;
  for (let d = level + 1; d < next.length; d++) next[d] = 0;
  return next;
}

// ============================
// Helpers d'affichage produit
// ============================

// Construit la liste des caractéristiques affichables d'un produit
export function buildSpecs(p) {
  const s = [];
  if (p.brand) s.push(['Marque', p.brand]);
  if (p.country_origin) s.push(['Origine', p.country_origin]);
  if (p.min_order_quantity && p.min_order_quantity > 1) s.push(['Quantité min.', p.min_order_quantity]);
  if (p.specific_fields_display) Object.entries(p.specific_fields_display).forEach(([k, v]) => { if (v) s.push([k, v]); });
  if (p.status) s.push(['Statut', p.status === 'available' ? 'Disponible' : p.status]);
  return s;
}

// Construit les données de prix par paliers pour l'affichage
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

// Assemble les données d'un produit pour la page détail
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
