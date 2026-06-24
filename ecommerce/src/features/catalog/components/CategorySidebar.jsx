import { categories } from '@/data/data.js';
import { ChevronRight, Cpu, LayoutGrid, Shirt, House, Car, HeartPulse, Factory, ShoppingBag, Dumbbell } from 'lucide-react';

const iconMap = { microchip: Cpu, shirt: Shirt, house: House, car: Car, heartPulse: HeartPulse, industry: Factory, shoppingBasket: ShoppingBag, dumbbell: Dumbbell };

export default function CategorySidebar({ onOpenCategory }) {
  return (
    <div className="bg-white rounded shadow-sm overflow-hidden">
      <div className="bg-[#0d1b2a] text-white px-3.5 py-2.5 text-[13px] font-bold uppercase tracking-[0.5px]">
        <LayoutGrid size={16} className="inline-block shrink-0 align-[-0.125em] text-orange-500 mr-2" /> Catégories
      </div>
      {categories.map(c => (
        <div key={c.name} onClick={() => onOpenCategory?.(c)} className="flex items-center justify-between px-3.5 py-2.5 text-[13px] border-b border-gray-50 text-gray-600 cursor-pointer hover:bg-orange-50 hover:text-orange-500 hover:pl-5 transition-all group">
          <span>
            {(() => { const Comp = iconMap[c.icon]; return Comp ? <Comp size={16} className="inline-block shrink-0 align-[-0.125em] mr-2" style={{ color: c.color }} /> : null; })()}
            {c.name}
          </span>
          <ChevronRight size={12} className="text-gray-300 group-hover:text-orange-400" />
        </div>
      ))}
    </div>
  );
}
