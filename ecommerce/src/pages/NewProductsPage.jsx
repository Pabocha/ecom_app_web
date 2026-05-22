import { featuredProducts, formatPrice } from '../data/data.js';
import Icon from '../components/shared/Icon.jsx';

export default function NewProductsPage({ onClose, onAddToCart, onOpenProduct }) {
  const newProducts = featuredProducts.filter(p => p.badges?.includes('new'));

  return (
    <div className="min-h-screen bg-[#111827] pb-12 text-white">
      <div className="sticky top-0 z-20 border-b border-white/10 bg-[#111827]/95 backdrop-blur">
        <div className="max-w-[1300px] mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[2px] text-green-300 font-black">Découvertes</div>
            <h1 className="font-['Barlow_Condensed'] text-[34px] font-black leading-none">Nouveautés</h1>
          </div>
          <button onClick={onClose} className="bg-white/10 hover:bg-white/15 text-white px-3.5 py-2 rounded text-[13px] font-bold flex items-center gap-2">
            <Icon name="arrowLeft" /> Retour
          </button>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-4 pt-5">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 px-7 py-6 mb-5">
          <div className="absolute right-6 top-4 text-[96px] font-black text-white/10 leading-none">NEW</div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded bg-black/25 px-3 py-1 text-[12px] font-black uppercase">
              <Icon name="sparkles" size={14} /> Juste arrivé
            </div>
            <h2 className="font-['Barlow_Condensed'] text-[46px] font-black leading-tight mt-3">Les derniers produits</h2>
            <p className="text-white/80 text-[14px] max-w-[560px]">Découvrez les nouveaux articles ajoutés à notre catalogue. Soyez parmi les premiers à les essayer!</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {featuredProducts.map(product => (
            <div key={product.id} onClick={() => onOpenProduct(product)} className="group cursor-pointer overflow-hidden rounded-lg bg-white text-[#0d1b2a] shadow-lg shadow-black/20 transition-transform hover:-translate-y-1">
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
                  <button onClick={e => { e.stopPropagation(); onAddToCart(product); }} className="rounded bg-[#0d1b2a] px-3 py-2 text-[11px] font-bold text-white hover:bg-green-600">
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
