import { useNavigate } from 'react-router-dom';
import { useCart } from '@/features/cart/hooks/useCart';
import { useProducts } from '@/features/product/hooks/useProduct';
import { formatPrice } from '@/utils/helpers.js';
import { Sparkles } from 'lucide-react';

export default function NewProductsPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { data: res, isLoading } = useProducts({ tab: "recent" });
  const products = res?.data?.results || res?.data || [];

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      <div className="max-w-[1300px] mx-auto px-4 pt-5">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 px-7 py-6 mb-5">
          <div className="absolute right-6 top-4 text-[96px] font-black text-white/10 leading-none">NEW</div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded bg-black/25 px-3 py-1 text-[12px] font-black uppercase">
              <Sparkles size={14} /> Juste arrivé
            </div>
            <h2 className="font-['Barlow_Condensed'] text-[46px] font-black leading-tight mt-3">Les derniers produits</h2>
            <p className="text-white/80 text-[14px] max-w-[560px]">Découvrez les nouveaux articles ajoutés à notre catalogue. Soyez parmi les premiers à les essayer!</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-lg bg-white shadow-lg shadow-black/20 animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {products.map(product => (
              <div key={product.id} onClick={() => navigate(`/product/${product.id}`)} className="group cursor-pointer overflow-hidden rounded-lg bg-white text-[#0d1b2a] shadow-lg shadow-black/20 transition-transform hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img src={product.img} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  {product.badges?.includes('new') && (
                    <span className="absolute left-3 top-3 rounded bg-green-600 px-2.5 py-1 text-[11px] font-black text-white">NOUVEAU</span>
                  )}
                  {product.discount && (
                    <span className="absolute right-3 top-3 rounded bg-orange-600 px-2.5 py-1 text-[11px] font-black text-white">{product.discount}</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-[12px] text-gray-400 mb-2">{product.supplier}</div>
                  <h3 className="min-h-[40px] text-[14px] font-bold leading-tight">{product.name}</h3>
                  <div className="mt-2 flex items-center gap-1 text-[12px]">
                    <span className="font-bold">★ {product.rating}</span>
                    <span className="text-gray-400">({product.reviews} avis)</span>
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <div className="font-['Barlow_Condensed'] text-[22px] font-black text-green-600">{formatPrice(product.price)}</div>
                      {product.oldPrice && <div className="text-[11px] text-gray-400 line-through">{formatPrice(product.oldPrice)}</div>}
                    </div>
                    <button onClick={e => { e.stopPropagation(); addToCart(product); }} className="rounded bg-[#0d1b2a] px-3 py-2 text-[11px] font-bold text-white hover:bg-green-600">
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
