import { formatPrice } from '@/data/data.js';

function hasVariants(product) {
  return product.has_variant || (product.variants && Object.keys(product.variants).length > 0);
}

export default function CartRecommendationsCard({ product, onProductClick, onAddToCart }) {
  return (
    <article className="group rounded-lg border border-gray-100 bg-white p-3 transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <button onClick={() => onProductClick(product.id)} className="relative block w-full overflow-hidden rounded bg-gray-50" style={{ aspectRatio: '4 / 3' }}>
        <img src={product.img} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        {product.discount && <span className="absolute left-2 top-2 rounded bg-orange-500 px-2 py-0.5 text-[11px] font-black text-white">{product.discount}</span>}
        {hasVariants(product) && <span className="absolute right-2 top-2 rounded bg-[#0d1b2a] px-2 py-0.5 text-[10px] font-black text-white">Variantes</span>}
      </button>
      <div className="pt-3">
        <h3 className="min-h-[38px] text-[13px] font-black leading-tight text-[#0d1b2a]">{product.name}</h3>
        <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-400">
          <span className="text-yellow-400">{'★'.repeat(Math.floor(product.rating))}</span>
          <span>({product.reviews})</span>
        </div>
        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <div className="font-['Barlow_Condensed'] text-[22px] font-black text-orange-500">{formatPrice(product.price)}</div>
            {product.oldPrice && <div className="text-[11px] text-gray-400 line-through">{formatPrice(product.oldPrice)}</div>}
          </div>
          <button onClick={() => onAddToCart(product)} className="rounded bg-[#0d1b2a] px-3 py-2 text-[12px] font-black text-white hover:bg-orange-500">
            Ajouter
          </button>
        </div>
      </div>
    </article>
  );
}
