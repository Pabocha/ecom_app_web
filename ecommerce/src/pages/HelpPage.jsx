import { useNavigate } from 'react-router-dom';
import Icon from '@/components/shared/Icon.jsx';

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
    <div className="min-h-screen bg-[#111827] pb-12 text-white">
      <div className="sticky top-0 z-20 border-b border-white/10 bg-[#111827]/95 backdrop-blur">
        <div className="max-w-[1300px] mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[2px] text-cyan-300 font-black">Support</div>
            <h1 className="font-['Barlow_Condensed'] text-[34px] font-black leading-none">Aide & Support</h1>
          </div>
          <button onClick={() => navigate('/')} className="bg-white/10 hover:bg-white/15 text-white px-3.5 py-2 rounded text-[13px] font-bold flex items-center gap-2">
            <Icon name="arrowLeft" /> Retour
          </button>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-4 py-8">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-cyan-600 via-blue-500 to-indigo-400 px-7 py-8 mb-8">
          <div className="absolute right-6 top-4 text-[96px] font-black text-white/10 leading-none">?</div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded bg-black/25 px-3 py-1 text-[12px] font-black uppercase">
              <Icon name="help" size={14} /> Nous sommes là pour vous
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
            <button key={i} className="rounded-lg bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-colors text-center">
              <div className="text-[32px] mb-2">{contact.icon}</div>
              <div className="font-bold text-[14px]">{contact.label}</div>
              <div className="text-[12px] text-white/60">{contact.desc}</div>
            </button>
          ))}
        </div>

        <div className="mb-8">
          <h3 className="font-['Barlow_Condensed'] text-[28px] font-black mb-6">Questions fréquemment posées</h3>
          {faqs.map((section, i) => (
            <div key={i} className="mb-8">
              <h4 className="text-[16px] font-bold mb-4 text-cyan-300">{section.category}</h4>
              <div className="space-y-4">
                {section.questions.map((item, j) => (
                  <details key={j} className="rounded-lg border border-white/10 bg-white/5 p-4 cursor-pointer group">
                    <summary className="flex items-start justify-between font-bold text-[14px]">
                      {item.q}
                      <Icon name="chevronDown" size={18} className="group-open:rotate-180 transition-transform" />
                    </summary>
                    <p className="mt-3 text-[13px] text-white/70 leading-relaxed">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-lg bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-400/30 p-8">
            <h4 className="font-bold text-[18px] mb-3">Besoin d'aide supplémentaire?</h4>
            <p className="text-white/70 mb-4">Contactez notre équipe de support client. Nous répondons généralement en moins de 2 heures.</p>
            <button className="bg-cyan-600 hover:bg-cyan-700 px-6 py-2 rounded font-bold text-[14px]">Ouvrir un ticket</button>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-400/30 p-8">
            <h4 className="font-bold text-[18px] mb-3">Espace vendeur?</h4>
            <p className="text-white/70 mb-4">Si vous êtes vendeur, consultez notre documentation complète pour les vendeurs.</p>
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-bold text-[14px]">Docs vendeurs</button>
          </div>
        </div>
      </div>
    </div>
  );
}
