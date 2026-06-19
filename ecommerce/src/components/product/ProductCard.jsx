import { formatPrice } from '@/data/data.js';
import { CheckCircle, Heart, ShoppingCart } from 'lucide-react';

const badgeStyles = {
  sale: 'bg-red-500',
  new: 'bg-green-600',
  hot: 'bg-orange-500',
  b2b: 'bg-blue-600',
};
const badgeLabels = { sale: null, new: 'Nouveau', hot: '🔥 Hot', b2b: 'B2B' };

export default function ProductCard({ product, onAddToCart, onOpenProduct }) {
  const stars = Math.floor(product.rating);

  return (
    <div
      onClick={() => onOpenProduct?.(product)}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative flex flex-col"
    >
      {/* Image */}
      <div className="relative pt-[100%] overflow-hidden bg-gray-50">
        <img
          src={product.img}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badges.map(b => (
            <span key={b} className={`${badgeStyles[b]} text-white text-[10px] font-black px-1.5 py-0.5 rounded-sm uppercase`}>
              {badgeLabels[b] || product.discount}
            </span>
          ))}
        </div>
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
        <div className="text-[13px] font-semibold text-[#0d1b2a] leading-tight mb-1 line-clamp-2 flex-1">{product.name}</div>
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="font-['Barlow_Condensed'] text-[17px] font-black text-orange-500">{formatPrice(product.price)}</span>
          {product.oldPrice && <span className="text-[12px] text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-1">
          <span className="text-yellow-400 tracking-[-1px]">{'★'.repeat(stars)}</span>
          <span>({product.reviews.toLocaleString()})</span>
        </div>
        <div className="text-[11px] text-gray-400 truncate">
          {product.supplier}
          {product.verified && <span className="text-green-600 font-bold ml-1"><CheckCircle size={12} /> Vérifié</span>}
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
