import { BadgeCheck, Heart, ShoppingCart, Star } from 'lucide-react';
import * as helpers from '@/utils/helpers.js';

const badgeStyles = {
  sale: 'bg-red-500',
  new: 'bg-green-600',
  hot: 'bg-orange-500',
  b2b: 'bg-blue-600',
};

const badgeLabels = { sale: 'Promo', new: 'Nouveau', hot: '🔥 Hot', b2b: 'B2B' };

function getRating(value) {
  const rating = Number(value);
  if (!Number.isFinite(rating)) return 0;
  return Math.min(Math.max(rating, 0), 5);
}

function getStarFill(rating, index) {
  return Math.min(Math.max(rating - index, 0), 1) * 100;
}

export default function ProductCard({ product, sectionBadge, onAddToCart, onOpenProduct }) {
  const rating = getRating(product.average_rating);
  const pricing = helpers.getProductPricing(product);
  const badges = helpers.getProductBadges(product, sectionBadge);

  return (
    <div
      onClick={() => onOpenProduct?.(product)}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative flex flex-col"
    >
      {/* Image */}
      <div className="relative pt-[100%] overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {badges.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {badges.map(badge => (
              <span key={`${badge.key}-${badge.label || badgeLabels[badge.key]}`} className={`${badgeStyles[badge.key]} text-white text-[10px] font-black px-1.5 py-0.5 rounded-sm uppercase`}>
                {badge.label || badgeLabels[badge.key]}
              </span>
            ))}
          </div>
        )}
        {/* Wishlist */}
        <button
          onClick={e => e.stopPropagation()}
          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
        >
          <Heart size={13} />
        </button>
      </div>

      {/* Info */}
      <div className="p-2.5 flex-1 flex flex-col">
        <div title={product.name} className="text-[13px] font-semibold text-[#0d1b2a] leading-tight mb-1 truncate">{product.name}</div>
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className={`font-['Barlow_Condensed'] font-black text-orange-500 ${pricing.type === 'tiers' ? 'text-[15px]' : 'text-[17px]'}`}>
            {pricing.mainPrice}
          </span>
          {pricing.oldPrice && <span className="text-[12px] text-gray-400 line-through">{pricing.oldPrice}</span>}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-1">
          <div className="flex items-center gap-0.5" aria-label={`${rating.toFixed(1)} sur 5`}>
            {Array.from({ length: 5 }).map((_, index) => {
              const fill = getStarFill(rating, index);

              return (
                <span key={index} className="relative h-3 w-3 shrink-0">
                  <Star size={12} className="absolute inset-0 text-gray-300" />
                  {fill > 0 && (
                    <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%` }}>
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    </span>
                  )}
                </span>
              );
            })}
          </div>
          <span>({product.numbers_reviews.toLocaleString()})</span>
        </div>
        <div className="flex text-[11px] text-gray-400 truncate font-bold">
          {product.shop_name} {product.shop_is_verified && <span className="flex text-green-600 font-bold ml-1"><BadgeCheck size={12} /> Vérifié</span>}
        </div>
      </div>

      {/* Add to cart - appears on hover */}
      <button
        onClick={e => { e.stopPropagation(); onAddToCart(product); }}
        className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-bold transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5"
      >
        <ShoppingCart size={14} /> Ajouter au panier
      </button>
    </div>
  );
}
