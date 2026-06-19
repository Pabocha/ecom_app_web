import { useEffect, useState } from 'react';
import { flashDeals, formatPrice } from '@/data/data.js';
import { Bolt } from 'lucide-react';

export default function FlashDeals({ onOpenAllDeals, onOpenProduct }) {
  const [time, setTime] = useState({ h: 5, m: 42, s: 17 });

  useEffect(() => {
    const t = setInterval(() => setTime(prev => {
      let { h, m, s } = prev;
      s -= 1;
      if (s < 0) { s = 59; m -= 1; }
      if (m < 0) { m = 59; h -= 1; }
      if (h < 0) h = 0;
      return { h, m, s };
    }), 1000);

    return () => clearInterval(t);
  }, []);

  const pad = n => String(n).padStart(2, '0');

  return (
    <div>
      <div className="bg-red-500 rounded-t px-4 py-2.5 flex items-center gap-4">
        <div className="font-['Barlow_Condensed'] text-[24px] font-black text-white flex items-center gap-2">
          <Bolt size={22} /> Ventes Flash
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-white/80">
          Fin dans
          {[pad(time.h), pad(time.m), pad(time.s)].map((u, i) => (
            <span key={`${u}-${i}`} className="bg-black/30 text-white font-['Barlow_Condensed'] text-[17px] font-black px-2 py-0.5 rounded min-w-[36px] text-center">{u}{i < 2 ? <span className="opacity-60">:</span> : ''}</span>
          ))}
        </div>
        <button onClick={onOpenAllDeals} className="ml-auto text-[13px] text-white/70 cursor-pointer hover:text-white transition-colors">
          Toutes les offres →
        </button>
      </div>
      <div className="bg-white rounded-b shadow-sm p-3 grid grid-cols-5 gap-2.5">
        {flashDeals.map(d => (
          <div key={d.id} onClick={() => onOpenProduct?.({ ...d, supplier: 'TradeHub Flash', rating: 4.6, reviews: 120, verified: true, badges: ['sale'], oldPrice: Math.round(d.price * 1.4) })} className="text-center cursor-pointer p-2 rounded hover:bg-orange-50 transition-colors">
            <div className="relative rounded overflow-hidden mb-2" style={{ paddingTop: '100%' }}>
              <img src={d.img} alt={d.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="text-[12px] font-black text-red-500">{d.discount}</div>
            <div className="font-['Barlow_Condensed'] text-[18px] font-black text-orange-500">{formatPrice(d.price)}</div>
            <div className="text-[12px] text-gray-600 truncate mb-1.5">{d.name}</div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full" style={{ width: `${d.sold}%` }} />
            </div>
            <div className="text-[10px] text-gray-400 mt-1">Vendu: {d.sold}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
