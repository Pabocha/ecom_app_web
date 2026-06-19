import { Headphones, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

const iconMap = { truck: Truck, shield: ShieldCheck, rotateLeft: RotateCcw, headset: Headphones };

const items = [
  { icon: 'truck', cls: 'bg-orange-50 text-orange-500', title: 'Livraison Rapide', sub: 'Dakar: 24h - National: 72h' },
  { icon: 'shield', cls: 'bg-green-50 text-green-600', title: 'Paiement Sécurisé', sub: 'Wave, OM, CB, Virement' },
  { icon: 'rotateLeft', cls: 'bg-blue-50 text-blue-500', title: 'Retour Facile', sub: '15 jours satisfait ou remboursé' },
  { icon: 'headset', cls: 'bg-amber-50 text-amber-500', title: 'Support 24/7', sub: 'Chat, appel, WhatsApp' },
];

export default function PromoStrip() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map(it => (
        <div key={it.title} className="bg-white rounded flex items-center gap-3 px-4 py-3.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className={`w-10 h-10 rounded-full ${it.cls} flex items-center justify-center text-[18px] shrink-0`}>
            {(() => { const Comp = iconMap[it.icon]; return Comp ? <Comp size={18} /> : null; })()}
          </div>
          <div>
            <strong className="text-[13px] font-bold text-[#0d1b2a] block">{it.title}</strong>
            <span className="text-[11px] text-gray-400">{it.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
