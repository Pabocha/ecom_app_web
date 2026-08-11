import { useEffect, useMemo, useState } from 'react';
import { useFlashSales } from '@/features/marketing/hooks/useMarketing';
import { normalizeDeal, getProductPricing, getCountdownParts } from '@/utils/helpers';
import { Bolt } from 'lucide-react';

export default function FlashDeals({ onOpenAllDeals, onOpenProduct }) {
  const { data: sales = [], isLoading } = useFlashSales(10);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const sale = useMemo(
    () => sales
      .filter(s => s?.products?.length)
      .sort((a, b) => (a.remaining_time?.total_seconds ?? 0) - (b.remaining_time?.total_seconds ?? 0))[0],
    [sales]
  );

  const deals = useMemo(
    () => (sale ? sale.products.slice(0, 5).map(p => normalizeDeal(p, sale)) : []),
    [sale]
  );

  if (isLoading) {
    return (
      <div className="rounded bg-white shadow-sm p-3">
        <div className="h-11 rounded bg-red-100 animate-pulse mb-3" />
        <div className="grid grid-cols-5 gap-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square rounded bg-gray-200 mb-2" />
              <div className="h-3 rounded bg-gray-200 mb-1" />
              <div className="h-3 rounded bg-gray-200 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!sale || deals.length === 0) return null;

  const countdown = getCountdownParts(sale.end_at, now);

  return (
    <div>
      <div className="bg-red-500 rounded-t px-4 py-2.5 flex items-center gap-4">
        <div className="font-['Barlow_Condensed'] text-[24px] font-black text-white flex items-center gap-2">
          <Bolt size={22} /> Ventes Flash
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-white/80">
          Fin dans
          {countdown.d > 0 && (
            <span className="bg-black/30 text-white font-['Barlow_Condensed'] text-[17px] font-black px-2 py-0.5 rounded min-w-[36px] text-center">{countdown.d}j</span>
          )}
          {[countdown.h, countdown.m, countdown.s].map((u, i) => (
            <span key={`${u}-${i}`} className="bg-black/30 text-white font-['Barlow_Condensed'] text-[17px] font-black px-2 py-0.5 rounded min-w-[36px] text-center">{u}{i < 2 ? <span className="opacity-60">:</span> : ''}</span>
          ))}
        </div>
        <button onClick={onOpenAllDeals} className="ml-auto text-[13px] text-white/70 cursor-pointer hover:text-white transition-colors">
          Toutes les offres →
        </button>
      </div>
      <div className="bg-white rounded-b shadow-sm p-3 grid grid-cols-5 gap-2.5">
        {deals.map(d => {
          const pricing = getProductPricing(d);
          return (
            <div key={d.id} onClick={() => onOpenProduct?.(d)} className="text-center cursor-pointer p-2 rounded hover:bg-orange-50 transition-colors">
              <div className="relative rounded overflow-hidden mb-2" style={{ paddingTop: '100%' }}>
                <img src={d.img} alt={d.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="text-[12px] font-black text-red-500">{d.discount}</div>
              <div className="font-['Barlow_Condensed'] text-[18px] font-black text-orange-500">{pricing.mainPrice}</div>
              {pricing.oldPrice ? (
                <div className="font-['Barlow_Condensed'] text-[13px] font-black text-gray-400 line-through">{pricing.oldPrice}</div>
              ) : null}
              <div className="text-[12px] text-gray-600 truncate mb-1.5">{d.name}</div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full" style={{ width: `${d.sold}%` }} />
              </div>
              <div className="text-[10px] text-gray-400 mt-1">Vendu: {d.sold}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
