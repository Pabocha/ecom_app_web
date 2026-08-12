export function normalizeApiProduct(p) {
  const pricing = p.pricing_display || {};
  let price = p.base_price;
  let oldPrice = null;

  if (pricing.type === 'promo') {
    price = pricing.promo_price;
    oldPrice = pricing.should_strike_base ? pricing.base_price : null;
  } else if (pricing.type === 'base') {
    price = pricing.price ?? p.base_price;
  }

  return {
    id: p.id,
    name: p.name,
    img: p.image,
    description: p.description || '',
    price,
    oldPrice,
    discount: oldPrice ? `-${Math.round((1 - price / oldPrice) * 100)}%` : null,
    rating: p.average_rating || 0,
    reviews: p.numbers_reviews || 0,
    verified: p.shop_is_verified || false,
    isNew: false,
    subcat: p.category_name || '',
  };
}
