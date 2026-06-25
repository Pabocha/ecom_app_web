import { CheckCircle } from 'lucide-react';
import { formatPrice } from '@/data/data.js';

export default function CategoryProductCard({ product, onProductClick, onAddToCart }) {
  return (
    <article onClick={() => onProductClick(product)} className="group cursor-pointer rounded-lg bg-white p-3 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden rounded bg-gray-50" style={{ aspectRatio: '4 / 3' }}>
        <img src={product.img} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {product.discount && <span className="absolute left-2 top-2 rounded bg-orange-500 px-2 py-0.5 text-[11px] font-black text-white">{product.discount}</span>}
        {product.isNew && <span className="absolute right-2 top-2 rounded bg-green-600 px-2 py-0.5 text-[11px] font-black text-white">Nouveau</span>}
      </div>
      <div className="pt-3">
        <div className="mb-1 text-[11px] font-bold text-orange-500">{product.subcat}</div>
        <h3 className="min-h-[40px] text-[14px] font-black leading-tight text-[#0d1b2a]">{product.name}</h3>
        <div className="mt-2 flex items-center gap-1 text-[11px] text-gray-400">
          <span className="text-yellow-400">{'★'.repeat(Math.floor(product.rating))}</span>
          <span>({product.reviews?.toLocaleString()})</span>
          {product.verified && <span className="ml-auto flex items-center gap-1 font-bold text-green-600"><CheckCircle size={12} /> Vérifié</span>}
        </div>
        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <div className="font-['Barlow_Condensed'] text-[24px] font-black text-orange-500">{formatPrice(product.price)}</div>
            {product.oldPrice && <div className="text-[12px] text-gray-400 line-through">{formatPrice(product.oldPrice)}</div>}
          </div>
          <button onClick={e => { e.stopPropagation(); onAddToCart(product); }} className="rounded bg-orange-500 px-3 py-2 text-[12px] font-black text-white hover:bg-[#0d1b2a]">
            Ajouter
          </button>
        </div>
      </div>
    </article>
  );
}
