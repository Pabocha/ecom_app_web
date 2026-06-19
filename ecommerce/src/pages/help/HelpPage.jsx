import { useNavigate } from 'react-router-dom';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function HelpPage() {
  const navigate = useNavigate();
  const faqs = [
    {
      category: 'Achat & Panier',
      questions: [
        { q: 'Comment puis-je ajouter un produit au panier?', a: 'Cliquez simplement sur le bouton "Ajouter au panier" sur la page produit. Vous pouvez ensuite modifier la quantité dans votre panier.' },
        { q: 'Quel est le délai de livraison?', a: 'Les délais varient selon votre localisation: Dakar (24-48h), régions du Sénégal (3-5 jours), sous-région (7-14 jours).' },
      ]
    },
    {
      category: 'Paiement & Sécurité',
      questions: [
        { q: 'Quels modes de paiement acceptez-vous?', a: 'Nous acceptons Wave, Orange Money, Carte bancaire, et Virement bancaire. Tous les paiements sont sécurisés.' },
        { q: 'Mon paiement est-il sécurisé?', a: 'Oui, tous les paiements sont cryptés avec SSL. Nous ne stockons jamais les détails complets de votre carte bancaire.' },
      ]
    },
    {
      category: 'Commandes',
      questions: [
        { q: 'Puis-je annuler ma commande?', a: 'Vous pouvez annuler votre commande dans les 30 minutes suivant la confirmation. Après, contactez notre support.' },
        { q: 'Comment suivre ma commande?', a: 'Vous recevrez un numéro de suivi par SMS et email. Vous pouvez aussi le vérifier dans votre compte.' },
      ]
    },
    {
      category: 'Retours & Remboursements',
      questions: [
        { q: 'Quelle est votre politique de retour?', a: '30 jours pour retourner un produit non utilisé et dans son emballage d\'origine pour un remboursement complet.' },
        { q: 'Combien de temps pour mon remboursement?', a: 'Les remboursements sont traités dans les 5-7 jours ouvrables après réception et vérification du produit.' },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pb-12">

      <div className="max-w-[1300px] mx-auto px-4 py-8">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-cyan-600 via-blue-500 to-indigo-400 px-7 py-8 mb-8">
          <div className="absolute right-6 top-4 text-[96px] font-black text-white/10 leading-none">?</div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded bg-black/25 px-3 py-1 text-[12px] font-black uppercase">
              <HelpCircle size={14} /> Nous sommes là pour vous
            </div>
            <h2 className="font-['Barlow_Condensed'] text-[46px] font-black leading-tight mt-3">Centre d'aide TradeHub</h2>
            <p className="text-white/80 text-[14px] max-w-[560px]">Trouvez les réponses à vos questions les plus courantes ou contactez notre équipe de support.</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { icon: '💬', label: 'Chat en direct', desc: 'Parlez à un agent' },
            { icon: '📧', label: 'Email', desc: 'support@tradehub.sn' },
            { icon: '📞', label: 'Téléphone', desc: '+221 77 XXX XXXX' },
            { icon: '⏰', label: 'Horaires', desc: '7j/7, 8h-22h' },
          ].map((contact, i) => (
            <button key={i} className="rounded-lg bg-white border border-gray-200 p-4 hover:shadow-md transition-shadow text-center shadow-sm">
              <div className="text-[32px] mb-2">{contact.icon}</div>
              <div className="font-bold text-[14px] text-gray-800">{contact.label}</div>
              <div className="text-[12px] text-gray-500">{contact.desc}</div>
            </button>
          ))}
        </div>

        <div className="mb-8">
          <h3 className="font-['Barlow_Condensed'] text-[28px] font-black text-gray-800 mb-6">Questions fréquemment posées</h3>
          {faqs.map((section, i) => (
            <div key={i} className="mb-8">
              <h4 className="text-[16px] font-bold mb-4 text-cyan-600">{section.category}</h4>
              <div className="space-y-4">
                {section.questions.map((item, j) => (
                  <details key={j} className="rounded-lg border border-gray-200 bg-white p-4 cursor-pointer group shadow-sm">
                    <summary className="flex items-start justify-between font-bold text-[14px] text-gray-800">
                      {item.q}
                      <ChevronDown size={18} className="group-open:rotate-180 transition-transform text-gray-400" />
                    </summary>
                    <p className="mt-3 text-[13px] text-gray-600 leading-relaxed">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-300 p-8">
            <h4 className="font-bold text-[18px] text-gray-800 mb-3">Besoin d'aide supplémentaire?</h4>
            <p className="text-gray-600 mb-4">Contactez notre équipe de support client. Nous répondons généralement en moins de 2 heures.</p>
            <button className="bg-cyan-600 hover:bg-cyan-700 px-6 py-2 rounded font-bold text-[14px] text-white">Ouvrir un ticket</button>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-300 p-8">
            <h4 className="font-bold text-[18px] text-gray-800 mb-3">Espace vendeur?</h4>
            <p className="text-gray-600 mb-4">Si vous êtes vendeur, consultez notre documentation complète pour les vendeurs.</p>
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-bold text-[14px] text-white">Docs vendeurs</button>
          </div>
        </div>
      </div>
    </div>
  );
}
