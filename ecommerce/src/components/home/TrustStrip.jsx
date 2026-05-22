import Icon from '../shared/Icon.jsx';

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
          <Icon name={it.icon} size={24} className="text-orange-500" />
          <div>
            <strong className="text-[13px] font-bold text-[#0d1b2a] block">{it.title}</strong>
            <span className="text-[11px] text-gray-400">{it.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
