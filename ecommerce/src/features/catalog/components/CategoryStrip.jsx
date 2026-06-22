import { categories } from '@/data/data.js';
import { Cpu, Shirt, House, Car, HeartPulse, Factory, ShoppingBag, Dumbbell } from 'lucide-react';

import SectionHeader from '@/features/home/components/SectionHeader.jsx';

const iconMap = { microchip: Cpu, shirt: Shirt, house: House, car: Car, heartPulse: HeartPulse, industry: Factory, shoppingBasket: ShoppingBag, dumbbell: Dumbbell };

export default function CategoryStrip({ onOpenCategory }) {
  return (
    <>
      <SectionHeader title="Naviguer par catégorie" />
      <div className="grid grid-cols-8 gap-2">
        {categories.map(c => (
          <div key={c.name} onClick={() => onOpenCategory?.(c)} className="bg-white rounded-lg py-3.5 px-2 text-center cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="w-13 h-13 rounded-full mx-auto mb-2 flex items-center justify-center text-[22px]" style={{ background: c.bg, color: c.color, width: 52, height: 52 }}>
              {(() => { const Comp = iconMap[c.icon]; return Comp ? <Comp size={16} /> : null; })()}
            </div>
            <div className="text-[11px] font-bold text-[#0d1b2a] leading-tight">{c.name}</div>
          </div>
        ))}
      </div>
    </>
  );
}
