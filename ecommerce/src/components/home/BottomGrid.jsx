import { suppliers } from '../../data/data.js';
import Icon from '../shared/Icon.jsx';

export default function BottomGrid() {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <div className="bg-gradient-to-br from-[#0d1b2a] to-[#1a3a5c] rounded-lg p-7 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-orange-500/10 rounded-full" />
        <div className="font-['Barlow_Condensed'] text-[28px] font-black text-white mb-1.5">
          Demande de <span className="text-orange-500">Devis</span>
        </div>
        <p className="text-[13px] text-white/60 mb-4 leading-relaxed">
          Décrivez votre besoin et recevez des offres de plusieurs fournisseurs qualifiés en moins de 24h.
          Idéal pour les achats en volume et l'import.
        </p>
        <div className="flex gap-2">
          <input placeholder="Ex: 500 kg de coton bio, certification GOTS..." className="flex-1 px-3.5 py-2.5 rounded text-[13px] outline-none bg-white" />
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-[13px] font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap">
            <Icon name="paperPlane" /> Envoyer
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-5 shadow-sm">
        <div className="font-['Barlow_Condensed'] text-[20px] font-black text-[#0d1b2a] mb-3 flex items-center gap-2">
          <Icon name="star" className="text-yellow-400" /> Fournisseurs Top
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {suppliers.map(s => (
            <div key={s.name} className="flex items-center gap-2.5 p-2.5 border border-gray-100 rounded hover:border-orange-400 hover:bg-orange-50 cursor-pointer transition-all">
              <img src={s.img} alt={s.name} className="w-10 h-10 rounded object-contain bg-gray-50 p-1" loading="lazy" />
              <div className="flex-1 min-w-0">
                <strong className="text-[12px] text-[#0d1b2a] font-bold block truncate">{s.name}</strong>
                <span className="text-[11px] text-gray-400">{s.country}</span>
              </div>
              <div className="text-center shrink-0">
                <div className="text-yellow-400 text-[10px]">{'★'.repeat(Math.floor(s.rating))}</div>
                <div className="text-[12px] font-black text-[#0d1b2a]">{s.score}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
