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

export const formatLastSeen = (lastSeen) => {
  if (!lastSeen) return 'Hors ligne';
  const date = new Date(lastSeen);
  if (Number.isNaN(date.getTime())) return 'Hors ligne';
  const now = new Date();
  const diffMin = Math.floor((now - date) / 60000);
  if (diffMin < 1) return "Dernière vue à l'instant";
  if (diffMin < 60) return `Dernière vue il y a ${diffMin} min`;
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday.getTime() - 86400000);
  if (date >= startOfToday) return `Dernière vue aujourd'hui à ${time}`;
  if (date >= startOfYesterday) return `Dernière vue hier à ${time}`;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `Dernière vue le ${day}/${month}/${date.getFullYear()} à ${time}`;
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

// Normalise un deal flash (produit issu de l'API /v1/marketing/flash-sales/products/)
export function normalizeDeal(deal, flashSale) {
  const pricing = deal.pricing_display || {};
  const price = toPriceNumber(pricing.promo_price ?? pricing.price ?? deal.base_price);
  const oldPrice = pricing.should_strike_base
    ? toPriceNumber(pricing.base_price)
    : deal.oldPrice || Math.round(price * 1.45);

  return {
    ...deal,
    price,
    oldPrice,
    discount: getPromoDiscount(pricing) || deal.discount,
    sold: getSoldPercentage(deal),
    timeLeft: flashSale?.remaining_time || deal.remaining_time || null,
    endAt: flashSale?.end_at || deal.end_at || null,
    cat: deal.category_name || deal.cat,
    rating: toPriceNumber(deal.average_rating) || 4.5,
    reviews: deal.numbers_reviews || 0,
    img: deal.image,
    flashSale,
    supplier: deal.shop_name || 'TradeHub Flash',
    verified: !!deal.shop_is_verified,
    badges: ['sale', 'hot'],
  };
}

// Pourcentage "vendu" inventé mais déterministe (stable par produit, cohérent sur toutes les pages)
export function getSoldPercentage(product) {
  const id = toPriceNumber(product?.id) || 1;
  return 5 + (id * 37) % 90;
}

// Décompte du temps restant (jours inclus si > 24h), recalculé à chaque tick
export function getCountdownParts(endAt, now = Date.now()) {
  const total = endAt ? Math.max(Math.round((new Date(endAt).getTime() - now) / 1000), 0) : 0;
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = n => String(n).padStart(2, '0');
  return {
    d,
    h: pad(h),
    m: pad(m),
    s: pad(s),
    text: d > 0 ? `${d}j ${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(h)}:${pad(m)}:${pad(s)}`,
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
    ...flashDeals.map(d => {
      const pricing = d.pricing_display || {};
      const price = toPriceNumber(pricing.promo_price ?? pricing.price ?? d.base_price);
      const oldPrice = pricing.should_strike_base
        ? toPriceNumber(pricing.base_price)
        : d.oldPrice || Math.round(price * 1.4);
      return {
        ...d,
        supplier: d.shop_name || 'TradeHub Flash',
        rating: toPriceNumber(d.average_rating) || 4.5,
        reviews: d.numbers_reviews || 100,
        verified: !!d.shop_is_verified,
        badges: ['sale'],
        price,
        oldPrice,
        cartKey: 'flash',
      };
    }),
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
      if (sort === 'sold') return (b.sold || 0) - (a.sold || 0);
      return (a.timeLeft?.total_seconds ?? 0) - (b.timeLeft?.total_seconds ?? 0);
    });
}

// ============================
// Helpers devis (quotes)
// ============================

// Libellé FR d'un statut de devis
export function formatQuoteStatus(status) {
  const labels = {
    draft: 'Brouillon',
    sent: 'Envoyé',
    countered: 'Contre-proposition',
    accepted: 'Accepté',
    rejected: 'Refusé',
    expired: 'Expiré',
    converted: 'Converti en commande',
  };
  return labels[status] || status || '—';
}

// Prix unitaire d'une ligne de devis (défensif : accepte {amount} ou nombre)
export function quoteLineUnitPrice(line) {
  const raw = line?.negotiated_price;
  const amount = typeof raw === 'object' && raw !== null ? raw.amount : raw;
  const price = Number(amount);
  return Number.isFinite(price) ? price : 0;
}

// Total d'une ligne de devis (prix unitaire × quantité)
export function quoteLineTotal(line) {
  return quoteLineUnitPrice(line) * Number(line?.quantity || 0);
}

// Total du devis (somme des lignes)
export function quoteTotal(quote) {
  if (!quote?.lines) return 0;
  return quote.lines.reduce((sum, line) => sum + quoteLineTotal(line), 0);
}

// Prix actif d'un produit (promo > base) pour pré-remplir une proposition
export function activeProductPrice(product) {
  const pricing = product?.pricing_display;
  if (pricing?.type === 'promo') return Number(pricing.promo_price);
  if (pricing?.type === 'base') return Number(pricing.price);
  return Number(product?.base_price?.amount);
}
