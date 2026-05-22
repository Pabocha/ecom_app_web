import Icon from '../components/shared/Icon.jsx';

export default function ProPage({ onClose }) {
  return (
    <div className="min-h-screen bg-[#111827] pb-12 text-white">
      <div className="sticky top-0 z-20 border-b border-white/10 bg-[#111827]/95 backdrop-blur">
        <div className="max-w-[1300px] mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[2px] text-indigo-300 font-black">Partenariats</div>
            <h1 className="font-['Barlow_Condensed'] text-[34px] font-black leading-none">Programme Pro</h1>
          </div>
          <button onClick={onClose} className="bg-white/10 hover:bg-white/15 text-white px-3.5 py-2 rounded text-[13px] font-bold flex items-center gap-2">
            <Icon name="arrowLeft" /> Retour
          </button>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-4 py-8">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-400 px-7 py-8 mb-8">
          <div className="absolute right-6 top-4 text-[96px] font-black text-white/10 leading-none">PRO</div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded bg-black/25 px-3 py-1 text-[12px] font-black uppercase">
              <Icon name="rocket" size={14} /> Accélération business
            </div>
            <h2 className="font-['Barlow_Condensed'] text-[46px] font-black leading-tight mt-3">Devenez partenaire Pro</h2>
            <p className="text-white/80 text-[14px] max-w-[560px]">Accédez à des outils exclusifs, des analyses avancées et un support dédié pour amplifier votre vente sur TradeHub.</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {[
            {
              title: 'Pro Starter',
              price: 'Gratuit',
              desc: 'Pour les nouveaux vendeurs',
              features: ['Dashboard basique', 'Support email', 'Analytiques simples', '500 listes produits']
            },
            {
              title: 'Pro Plus',
              price: '49 999 FCFA/mois',
              desc: 'Pour les vendeurs établis',
              features: ['Dashboard avancé', 'Support prioritaire', 'Analytiques complètes', 'Listes illimitées', 'API intégration'],
              best: true
            },
            {
              title: 'Pro Enterprise',
              price: 'Sur devis',
              desc: 'Solutions personnalisées',
              features: ['Tout Pro Plus', 'Manager dédié', 'Formation personnalisée', 'Intégrations custom', 'Support 24/7']
            },
          ].map((plan, i) => (
            <div key={i} className={`rounded-lg border p-6 ${plan.best ? 'border-purple-500 bg-purple-600/20' : 'border-white/10 bg-white/5'}`}>
              {plan.best && <div className="inline-block rounded-full bg-purple-600 px-3 py-1 text-[11px] font-black mb-3">POPULAIRE</div>}
              <h3 className="font-bold text-[20px] mb-1">{plan.title}</h3>
              <div className="font-['Barlow_Condensed'] text-[28px] font-black mb-1">{plan.price}</div>
              <p className="text-[13px] text-white/60 mb-6">{plan.desc}</p>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, j) => (
                  <li key={j} className="text-[13px] flex items-start gap-2">
                    <Icon name="check" size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full rounded py-2 font-bold text-[13px] ${plan.best ? 'bg-purple-600 hover:bg-purple-700' : 'bg-white/10 hover:bg-white/15'}`}>
                Choisir ce plan
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          {[
            { icon: '📊', title: 'Analytiques avancées', desc: 'Suivez vos ventes en temps réel avec des rapports détaillés.' },
            { icon: '🚀', title: 'Promotion prioritaire', desc: 'Visibilité accrue dans les recherches et recommandations.' },
            { icon: '💳', title: 'Paiements plus rapides', desc: 'Retirez vos fonds 2x plus rapidement.' },
            { icon: '👥', title: 'Support dédié', desc: 'Équipe d\'experts disponible pour vous aider.' },
          ].map((benefit, i) => (
            <div key={i} className="rounded-lg bg-white/5 border border-white/10 p-6">
              <div className="text-[40px] mb-3">{benefit.icon}</div>
              <h4 className="font-bold text-[16px] mb-2">{benefit.title}</h4>
              <p className="text-[13px] text-white/60">{benefit.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-8 rounded-lg bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-400/30">
          <h3 className="font-bold text-[20px] mb-2">Questions sur le programme Pro?</h3>
          <p className="text-white/70 mb-4">Contactez notre équipe pour en savoir plus sur les avantages et les modalités de chaque plan.</p>
          <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded font-bold text-[14px]">Nous contacter</button>
        </div>
      </div>
    </div>
  );
}
