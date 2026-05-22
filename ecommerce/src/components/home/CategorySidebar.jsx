import { categories } from '../../data/data.js';
import Icon from '../shared/Icon.jsx';

export default function CategorySidebar({ onOpenCategory }) {
  return (
    <div className="bg-white rounded shadow-sm overflow-hidden">
      <div className="bg-[#0d1b2a] text-white px-3.5 py-2.5 text-[13px] font-bold uppercase tracking-[0.5px]">
        <Icon name="thLarge" className="text-orange-500 mr-2" /> Catégories
      </div>
      {categories.map(c => (
        <div key={c.name} onClick={() => onOpenCategory?.(c)} className="flex items-center justify-between px-3.5 py-2.5 text-[13px] border-b border-gray-50 text-gray-600 cursor-pointer hover:bg-orange-50 hover:text-orange-500 hover:pl-5 transition-all group">
          <span>
            <Icon name={c.icon} className="mr-2" style={{ color: c.color }} />
            {c.name}
          </span>
          <Icon name="chevronRight" size={12} className="text-gray-300 group-hover:text-orange-400" />
        </div>
      ))}
    </div>
  );
}
