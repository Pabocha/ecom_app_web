import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/features/cart/hooks/useCart';
import { useFlashSales } from '@/features/marketing/hooks/useMarketing';
import { filterAndSortDeals, normalizeDeal } from '@/utils/helpers';
import { Bolt } from 'lucide-react';

import FlashDealCard from '@/features/product/components/FlashDealCard';

export default function FlashDealsPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { data: sales = [], isLoading } = useFlashSales(100);
  const [activeCat, setActiveCat] = useState('Tous');
  const [sort, setSort] = useState('urgent');

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
    return all;
  }, [sales]);

  const categories = useMemo(() => ['Tous', ...new Set(deals.map(d => d.cat).filter(Boolean))], [deals]);

  const filtered = useMemo(() => filterAndSortDeals(deals, { activeCat, sort }), [deals, activeCat, sort]);

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      <div className="max-w-[1300px] mx-auto px-4 pt-5">
        <div className="grid grid-cols-[1fr_280px] gap-4 mb-5">
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 px-7 py-6">
            <div className="absolute right-6 top-4 text-[96px] font-black text-white/10 leading-none">FLASH</div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded bg-black/25 px-3 py-1 text-[12px] font-black uppercase">
                <Bolt size={14} /> Jusqu'à -70%
              </div>
              <h2 className="font-['Barlow_Condensed'] text-[46px] font-black leading-tight mt-3">Prix cassés avant minuit</h2>
              <p className="text-white/80 text-[14px] max-w-[560px]">Des deals courts, des stocks visibles, et une sélection plus agressive que la grille d'accueil.</p>
            </div>
          </div>

          <div className="rounded-lg bg-white text-[#0d1b2a] p-4 shadow">
            <div className="text-[12px] text-gray-400 font-bold mb-2">Trier les offres</div>
            <div className="grid gap-2">
              {[
                ['urgent', 'Fin bientôt'],
                ['discount', 'Meilleure remise'],
                ['sold', 'Plus vendus'],
              ].map(([value, label]) => (
                <button key={value} onClick={() => setSort(value)} className={`text-left rounded px-3 py-2 text-[13px] font-bold transition-colors ${sort === value ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)} className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors ${activeCat === cat ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg bg-white p-4 shadow">
                <div className="h-52 rounded bg-gray-200 mb-3" />
                <div className="h-4 rounded bg-gray-200 mb-2 w-3/4" />
                <div className="h-4 rounded bg-gray-200 w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg bg-white py-16 text-center shadow">
            <div className="text-5xl mb-4">⚡</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Aucune vente flash en cours</h2>
            <p className="text-gray-500">Revenez bientôt, de nouvelles offres arrivent !</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {filtered.map(deal => (
              <FlashDealCard
                key={deal.id}
                product={deal}
                onProductClick={(p) => navigate(`/product/${p.id}`)}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
