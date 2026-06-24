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
