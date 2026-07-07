/**
 * Fonctions utilitaires réutilisables
 */


export function toPriceNumber(value) {
  const price = Number(value);
  return Number.isFinite(price) ? price : 0;
}

export function formatPriceAmount(value) {
  return formatPrice(toPriceNumber(value));
}

export function formatPriceRange(minPrice, maxPrice) {
  const minText = formatPriceAmount(minPrice).replace(/\s*FCFA$/, '');
  return `${minText} - ${formatPriceAmount(maxPrice)}`;
}

export function getProductPricing(product) {
  const pricing = product.pricing_display;

  if (pricing?.type === 'promo') {
    return {
      type: 'promo',
      mainPrice: formatPriceAmount(pricing.promo_price),
      oldPrice: pricing.should_strike_base ? formatPriceAmount(pricing.base_price) : null,
    };
  }

  if (pricing?.type === 'tiers') {
    return {
      type: 'tiers',
      mainPrice: formatPriceRange(pricing.min_price, pricing.max_price),
      oldPrice: null,
    };
  }

  if (pricing?.type === 'base') {
    return {
      type: 'base',
      mainPrice: formatPriceAmount(pricing.price),
      oldPrice: null,
    };
  }

  return {
    type: 'base',
    mainPrice: formatPriceAmount(product.base_price),
    oldPrice: product.oldPrice ? formatPriceAmount(product.oldPrice) : null,
  };
}

export function getPromoDiscount(pricing) {
  const basePrice = toPriceNumber(pricing?.base_price);
  const promoPrice = toPriceNumber(pricing?.promo_price);

  if (!basePrice || !promoPrice || promoPrice >= basePrice) return null;

  return `-${Math.round((1 - promoPrice / basePrice) * 100)}%`;
}

export function getProductBadges(product, sectionBadge) {
  const pricing = product.pricing_display;
  const badges = [];

  if (sectionBadge && sectionBadge !== 'new') {
    badges.push({
      key: sectionBadge,
      label: null,
    });
  }

  if (pricing?.type === 'promo') {
    badges.push({
      key: 'sale',
      label: getPromoDiscount(pricing),
    });
  }

  if (pricing?.type === 'tiers') {
    badges.push({
      key: 'b2b',
      label: pricing.tiers_count ? `${pricing.tiers_count} prix` : 'B2B',
    });
  }

  if (product.is_sponsored) {
    badges.push({
      key: 'hot',
      label: 'Sponsorise',
    });
  }

  if (sectionBadge === 'new') {
    badges.push({
      key: sectionBadge,
      label: null,
    });
  }

  return badges;
}

export const formatPrice = (n) => {
  if (n === undefined || n === null || isNaN(Number(n))) {
    return "0 FCFA";
  }
  return Number(n).toLocaleString("fr-FR") + " FCFA";
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const debounce = (fn, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const throttle = (fn, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// ============================
// Helpers B2B / prix par paliers
// ============================

// Génère les paliers de prix dégressifs B2B à partir d'un prix de base
export function getPricingTiers(basePrice) {
  return [
    { min: 1, max: 9, discount: 0, price: basePrice },
    { min: 10, max: 49, discount: 10, price: basePrice * 0.9 },
    { min: 50, max: 99, discount: 15, price: basePrice * 0.85 },
    { min: 100, max: 249, discount: 20, price: basePrice * 0.8 },
    { min: 250, max: 499, discount: 25, price: basePrice * 0.75 },
    { min: 500, max: null, discount: 30, price: basePrice * 0.7 },
  ];
}

// Calcule le prix appliqué selon la quantité pour les tarifs B2B
export function getAppliedPrice(basePrice, qty) {
  const tiers = getPricingTiers(basePrice);
  const tier = tiers.find(t => qty >= t.min && (!t.max || qty <= t.max));
  return tier ? tier.price : basePrice;
}

// ============================
// Helpers catalogue / produits
// ============================

// Normalise un objet produit pour l'affichage (badges, discount)
export function normalizeProduct(product) {
  return {
    ...product,
    badges: product.badges || (product.badge ? ['sale'] : []),
    discount: product.discount || (product.oldPrice ? `-${Math.round((1 - product.price / product.oldPrice) * 100)}%` : null),
  };
}

// Normalise un deal flash pour l'affichage
export function normalizeDeal(deal) {
  return {
    ...deal,
    oldPrice: deal.oldPrice || Math.round(deal.price * 1.45),
    supplier: 'TradeHub Flash',
    verified: true,
    badges: ['sale', 'hot'],
  };
}

// Filtre des produits par recherche textuelle (nom, description, catégorie)
export function searchProducts(products, query) {
  if (!query?.trim()) return [];
  const lowerQuery = query.toLowerCase();
  return products.filter(p =>
    p.name?.toLowerCase().includes(lowerQuery) ||
    p.description?.toLowerCase().includes(lowerQuery) ||
    p.category?.toLowerCase().includes(lowerQuery)
  );
}

// Filtre et trie des produits par sous-catégorie, avec normalisation et tri
export function filterAndSortProducts(products, { activeSubcat, sort } = {}) {
  return products
    .filter(product => !activeSubcat || activeSubcat === 'Tous' || product.subcat === activeSubcat)
    .map(normalizeProduct)
    .sort((a, b) => {
      if (sort === 'priceAsc') return a.price - b.price;
      if (sort === 'priceDesc') return b.price - a.price;
      if (sort === 'new') return Number(Boolean(b.isNew)) - Number(Boolean(a.isNew));
      return (b.reviews || 0) - (a.reviews || 0);
    });
}

// Normalise un produit de catégorie (avec cartKey 'cat')
export function normalizeCatProduct(p) {
  return {
    ...p,
    badges: p.badges || (p.badge ? [p.badge.toLowerCase()] : p.isNew ? ['new'] : []),
    discount: p.discount || (p.oldPrice ? `-${Math.round((1 - p.price / p.oldPrice) * 100)}%` : null),
    cartKey: 'cat',
  };
}

// Assemble la liste complète de tous les produits (featured + flash + catégories)
export function buildAllProducts(featuredItems, flashDeals, catProducts) {
  return [
    ...featuredItems.map(p => ({ ...p, cartKey: 'featured' })),
    ...flashDeals.map(d => ({
      ...d,
      supplier: d.supplier || 'TradeHub Flash',
      rating: d.rating || 4.5,
      reviews: d.reviews || 100,
      verified: true,
      badges: ['sale'],
      oldPrice: d.oldPrice || Math.round(d.price * 1.4),
      cartKey: 'flash',
    })),
    ...Object.values(catProducts).flat().map(normalizeCatProduct),
  ];
}

// Filtre, déduplique et trie la liste de tous les produits
export function filterAllProducts(products, { activeCat, sort, categoryProducts } = {}) {
  if (!products.length) return [];

  let items = activeCat === 'Tous'
    ? products
    : products.filter(p => p.category === activeCat || p.subcat || true);

  if (activeCat !== 'Tous' && categoryProducts) {
    const catProds = categoryProducts[activeCat] || [];
    const catNames = catProds.map(cp => cp.name);
    items = items.filter(p => catNames.includes(p.name));
  }

  // Déduplication par id
  items = [...new Map(items.map(p => [p.id, p])).values()];

  // Tri
  if (sort === 'priceAsc') items.sort((a, b) => a.price - b.price);
  else if (sort === 'priceDesc') items.sort((a, b) => b.price - a.price);
  else if (sort === 'new') items.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  else items.sort((a, b) => b.reviews - a.reviews);

  return items;
}

// Filtre et trie des deals flash
export function filterAndSortDeals(deals, { activeCat, sort } = {}) {
  return deals
    .filter(deal => !activeCat || activeCat === 'Tous' || deal.cat === activeCat)
    .sort((a, b) => {
      if (sort === 'discount') return Math.abs(Number.parseInt(b.discount)) - Math.abs(Number.parseInt(a.discount));
      if (sort === 'sold') return b.sold - a.sold;
      return (a.timeLeft || '').localeCompare(b.timeLeft || '');
    });
}
