import { navLinks } from '@/data/data.js';
import { Zap, Globe, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SubNav({ onOpenCategories }) {
  const navigate = useNavigate();

  const linkRoutes = {
    "Deals du Jour": "/deals",
    "B2B & Gros": "/b2b",
    "Nouveautés": "/new-products",
    "Import Direct": "/import",
    "Top Vendeurs": "/top-sellers",
    "Ventes Flash": "/flash-deals",
    "Programme Pro": "/pro",
    "Aide": "/help",
  };

  const handleNavClick = (link) => {
    const route = linkRoutes[link];
    if (route) navigate(route);
  };
  return (
    <div className="bg-orange-500 sticky top-0 z-50 shadow-lg shadow-black/30">
      <div className="max-w-[1300px] mx-auto flex items-center">
        <button
          onClick={onOpenCategories}
          className="bg-orange-700 hover:bg-orange-800 text-white px-4 py-3 text-[14px] font-bold flex items-center gap-2 whitespace-nowrap transition-colors shrink-0"
        >
          <Menu size={16} /> Toutes les catégories
        </button>
        <div className="flex items-center overflow-x-auto scrollbar-hide">
          {navLinks.map((l, i) => (
            <span
              key={l}
              onClick={() => handleNavClick(l)}
              className={`px-3.5 py-3 text-[13px] font-semibold whitespace-nowrap cursor-pointer hover:bg-black/15 transition-colors flex items-center gap-1 ${i === 5 ? 'text-yellow-300' : 'text-white'}`}
            >
              {i === 5 && <Zap size={13} strokeWidth={3} />} {l}
            </span>
          ))}
        </div>
        <div className="ml-auto shrink-0 flex items-center gap-0">
          <span className="px-4 py-3 text-[13px] font-semibold text-white cursor-pointer hover:bg-black/15 transition-colors flex items-center gap-1">
            <Globe size={13} strokeWidth={3} /> Importer
          </span>
        </div>
      </div>
    </div>
  );
}
