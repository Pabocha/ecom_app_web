import { BadgeCheck, FileText, Globe, Headphones, Lock } from 'lucide-react';

const iconMap = { certificate: BadgeCheck, lock: Lock, globe: Globe, headset: Headphones, fileInvoiceDollar: FileText };

const items = [
  { icon: 'certificate', title: 'Fournisseurs Vérifiés', sub: 'Audit terrain & certification' },
  { icon: 'lock', title: 'Paiement Sécurisé', sub: 'Escrow & protection acheteur' },
  { icon: 'globe', title: 'Livraison Mondiale', sub: '+50 pays desservis' },
  { icon: 'headset', title: 'Assistance Dédiée', sub: 'Conseiller personnel B2B' },
  { icon: 'fileInvoiceDollar', title: 'Devis Gratuit', sub: 'Réponse sous 24h garantie' },
];

export default function TrustStrip() {
  return (
    <div className="bg-white rounded shadow-sm grid grid-cols-5 divide-x divide-gray-100">
      {items.map(it => (
        <div key={it.title} className="flex items-center gap-2.5 px-4 py-4">
          {(() => { const Comp = iconMap[it.icon]; return Comp ? <Comp size={24} className="text-orange-500" /> : null; })()}
          <div>
            <strong className="text-[13px] font-bold text-[#0d1b2a] block">{it.title}</strong>
            <span className="text-[11px] text-gray-400">{it.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
