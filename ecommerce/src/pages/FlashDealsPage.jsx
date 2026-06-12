import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { allFlashDeals, flashDealCategories, formatPrice } from '../data/data.js';
import Icon from '@/components/shared/Icon.jsx';

const normalizeDeal = deal => ({
  ...deal,
  oldPrice: deal.oldPrice || Math.round(deal.price * 1.45),
  supplier: 'TradeHub Flash',
  verified: true,
  badges: ['sale', 'hot'],
});

export default function FlashDealsPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [activeCat, setActiveCat] = useState('Tous');
  const [sort, setSort] = useState('urgent');

  const filtered = allFlashDeals
    .filter(deal => activeCat === 'Tous' || deal.cat === activeCat)
    .sort((a, b) => {
      if (sort === 'discount') return Math.abs(Number.parseInt(b.discount)) - Math.abs(Number.parseInt(a.discount));
      if (sort === 'sold') return b.sold - a.sold;
      return a.timeLeft.localeCompare(b.timeLeft);
    });

  return (
    <div className="min-h-screen bg-[#111827] pb-12 text-white">
      <div className="sticky top-0 z-20 border-b border-white/10 bg-[#111827]/95 backdrop-blur">
        <div className="max-w-[1300px] mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[2px] text-red-300 font-black">Offres limitées</div>
            <h1 className="font-['Barlow_Condensed'] text-[34px] font-black leading-none">Ventes Flash</h1>
          </div>
          <button onClick={() => navigate('/')} className="bg-white/10 hover:bg-white/15 text-white px-3.5 py-2 rounded text-[13px] font-bold flex items-center gap-2">
            <Icon name="arrowLeft" /> Retour
          </button>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-4 pt-5">
        <div className="grid grid-cols-[1fr_280px] gap-4 mb-5">
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 px-7 py-6">
            <div className="absolute right-6 top-4 text-[96px] font-black text-white/10 leading-none">FLASH</div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded bg-black/25 px-3 py-1 text-[12px] font-black uppercase">
                <Icon name="bolt" size={14} /> Jusqu'à -70%
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
          {flashDealCategories.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)} className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors ${activeCat === cat ? 'bg-white text-red-600' : 'bg-white/10 text-white/70 hover:bg-white/15'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {filtered.map(deal => {
            const product = normalizeDeal(deal);
            return (
              <div key={deal.id} onClick={() => navigate(`/product/${product.id}`)} className="group cursor-pointer overflow-hidden rounded-lg bg-white text-[#0d1b2a] shadow-lg shadow-black/20 transition-transform hover:-translate-y-1">
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  <img src={deal.img} alt={deal.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded bg-red-600 px-2.5 py-1 text-[13px] font-black text-white">{deal.discount}</span>
                  <span className="absolute right-3 top-3 rounded bg-black/70 px-2.5 py-1 text-[12px] font-black text-white">{deal.timeLeft}</span>
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="rounded bg-orange-50 px-2 py-0.5 text-[11px] font-black text-orange-600">{deal.cat}</span>
                    <span className="text-[12px] text-gray-400">{deal.reviews} avis</span>
                  </div>
                  <h3 className="min-h-[40px] text-[15px] font-black leading-tight">{deal.name}</h3>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <div className="font-['Barlow_Condensed'] text-[26px] font-black text-red-600">{formatPrice(deal.price)}</div>
                      <div className="text-[12px] text-gray-400 line-through">{formatPrice(deal.oldPrice)}</div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); addToCart(product); }} className="rounded bg-[#0d1b2a] px-3 py-2 text-[12px] font-black text-white hover:bg-red-600">
                      Ajouter
                    </button>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400" style={{ width: `${deal.sold}%` }} />
                  </div>
                  <div className="mt-1 text-[11px] font-bold text-gray-400">{deal.sold}% du stock vendu</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
