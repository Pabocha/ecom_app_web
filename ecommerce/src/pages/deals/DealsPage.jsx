import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/features/cart/hooks/useCart';
import { useFlashSales } from '@/features/marketing/hooks/useMarketing';
import { formatPrice, normalizeDeal } from '@/utils/helpers';
import { Tag } from 'lucide-react';

import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DealsPage() {
  const navigate = useNavigate();
  const { addToCart, addingId } = useCart();
  const { data: sales = [], isLoading } = useFlashSales(100);

  const deals = useMemo(() => {
    const seen = new Set();
    const all = [];
    sales.forEach(sale =>
      (sale.products || []).forEach(p => {
        if (seen.has(p.id)) return;
        seen.add(p.id);
        all.push(normalizeDeal(p, sale));
      })
    );
    return all.slice(0, 9);
  }, [sales]);

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

        {isLoading ? (
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg bg-white p-4 shadow">
                <div className="h-52 rounded bg-gray-200 mb-3" />
                <div className="h-4 rounded bg-gray-200 mb-2 w-3/4" />
                <div className="h-4 rounded bg-gray-200 w-1/2" />
              </div>
            ))}
          </div>
        ) : deals.length === 0 ? (
          <div className="rounded-lg bg-white py-16 text-center shadow">
            <div className="text-5xl mb-4">🏷️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Aucune offre en cours</h2>
            <p className="text-gray-500">Revenez bientôt, de nouvelles réductions arrivent !</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {deals.map(deal => (
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
                      <div className="text-[12px] text-gray-400 line-through">{formatPrice(deal.oldPrice)}</div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); addToCart({ ...deal, badges: ['sale'] }); }} disabled={addingId === deal.id} className="rounded bg-[#0d1b2a] px-3 py-2 text-[12px] font-black text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
                      {addingId === deal.id ? <LoadingSpinner size={12} className="text-white" /> : 'Ajouter'}
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
