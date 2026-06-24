import { useNavigate } from 'react-router-dom';
import { useCart } from '@/features/cart/hooks/useCart';
import { allFlashDeals, formatPrice } from '@/data/data.js';
import { Tag } from 'lucide-react';

export default function DealsPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      <div className="max-w-[1300px] mx-auto px-4 pt-5">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 px-7 py-6 mb-5">
          <div className="absolute right-6 top-4 text-[96px] font-black text-white/10 leading-none">DEALS</div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded bg-black/25 px-3 py-1 text-[12px] font-black uppercase">
              <Tag size={14} /> Réductions quotidiennes
            </div>
            <h2 className="font-['Barlow_Condensed'] text-[46px] font-black leading-tight mt-3">Les meilleures affaires du jour</h2>
            <p className="text-white/80 text-[14px] max-w-[560px]">Sélection d'offres exclusives mises à jour chaque jour pour vous offrir les meilleurs prix.</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {allFlashDeals.slice(0, 9).map(deal => (
            <div key={deal.id} onClick={() => navigate(`/product/${deal.id}`)} className="group cursor-pointer overflow-hidden rounded-lg bg-white text-[#0d1b2a] shadow-lg shadow-black/20 transition-transform hover:-translate-y-1">
              <div className="relative h-52 overflow-hidden bg-gray-100">
                <img src={deal.img} alt={deal.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded bg-blue-600 px-2.5 py-1 text-[13px] font-black text-white">{deal.discount}</span>
              </div>
              <div className="p-4">
                <h3 className="min-h-[40px] text-[15px] font-black leading-tight">{deal.name}</h3>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <div className="font-['Barlow_Condensed'] text-[26px] font-black text-blue-600">{formatPrice(deal.price)}</div>
                    <div className="text-[12px] text-gray-400 line-through">{formatPrice(deal.oldPrice || deal.price * 1.45)}</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); addToCart({ ...deal, badges: ['sale'] }); }} className="rounded bg-[#0d1b2a] px-3 py-2 text-[12px] font-black text-white hover:bg-blue-600">
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
