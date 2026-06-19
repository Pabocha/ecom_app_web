import { b2bProducts } from '@/data/data.js';
import { Building2 } from 'lucide-react';

export default function B2BSection() {
  return (
    <div>
      <div className="bg-gradient-to-r from-[#0d1b2a] to-[#1a2e45] rounded-t px-5 py-3.5 flex items-center gap-4">
        <div className="font-['Barlow_Condensed'] text-[22px] font-black text-white">
          Espace <span className="text-orange-500">B2B & Gros</span>
        </div>
        <span className="text-[12px] text-white/50">Commandes en volume · Fabricants vérifiés · Prix négociables</span>
        <span className="ml-auto text-[13px] text-white/60 cursor-pointer">Voir tout →</span>
      </div>
      <div className="bg-white rounded-b shadow-sm p-3 grid grid-cols-4 gap-2.5">
        {b2bProducts.map(p => (
          <div key={p.id} className="border border-gray-100 rounded-lg p-3.5 cursor-pointer hover:border-orange-400 hover:shadow-md hover:shadow-orange-500/10 transition-all">
            <div className="flex items-start gap-2.5 mb-2.5">
              <img src={p.img} alt={p.name} className="w-14 h-14 rounded object-cover shrink-0" loading="lazy" />
              <div>
                <div className="text-[13px] font-bold text-[#0d1b2a] leading-tight mb-1">{p.name}</div>
                <div className="text-[11px] text-gray-400 flex items-center gap-1"><Building2 size={12} /> {p.company}</div>
              </div>
            </div>
            <div className="font-['Barlow_Condensed'] text-[15px] font-black text-orange-500">{p.price}</div>
            <div className="text-[11px] text-blue-500 font-semibold mb-2">{p.moq}</div>
            <div className="flex flex-wrap gap-1">
              {p.tags.map(t => <span key={t} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-semibold">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
