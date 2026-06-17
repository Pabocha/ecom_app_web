import { useNavigate } from 'react-router-dom';
import Icon from '@/components/shared/Icon.jsx';
import Button from '@/components/ui/Button.jsx';

const benefits = [
  {
    icon: 'chartLine',
    title: 'Visibilité renforcée',
    text: 'Touchez une audience active à la recherche de nouveaux produits et partenaires.',
  },
  {
    icon: 'shield',
    title: 'Crédibilité instantanée',
    text: 'Bénéficiez d’un cadre sécurisé et d’un statut vendeur reconnu sur la plateforme.',
  },
  {
    icon: 'truckFast',
    title: 'Logistique optimisée',
    text: 'Accédez à des options d’expédition préférentielles et un suivi simplifié.',
  },
  {
    icon: 'star',
    title: 'Support dédié',
    text: 'Profitez d’une assistance prioritaire pour accélérer votre lancement.',
  },
];

const steps = [
  {
    icon: 'user',
    title: 'Étape 1',
    subtitle: 'Informations boutique',
    text: 'Créez votre profil vendeur et décrivez votre boutique.',
  },
  {
    icon: 'lock',
    title: 'Étape 2',
    subtitle: 'Protection et accès',
    text: 'Configurez votre mot de passe et finalisez votre espace sécurisé.',
  },
];

export default function SellerCenterPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0d1b2a] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-2xl shadow-black/30">
          <div className="bg-[#0d1b2a] px-8 py-10 text-center sm:px-12 sm:py-14">
            <div className="inline-flex items-center gap-3 rounded-full bg-orange-500/10 px-4 py-2 text-sm uppercase tracking-[1px] text-orange-300 font-black">
              <Icon name="building" size={18} /> Espace vendeur TradeHub
            </div>
            <h1 className="mt-6 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              Vendez mieux. Gagnez plus. Grandissez plus vite.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
              Rejoignez notre communauté de vendeurs et profitez d’un parcours simple, d’une audience ciblée et d’outils puissants pour développer votre commerce en ligne.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={() => navigate('/seller-registration')}
              >
                Créer mon compte vendeur
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => navigate('/signup')}
              >
                Créer un compte utilisateur
              </Button>
            </div>
          </div>

          <div className="grid gap-8 px-8 py-10 lg:grid-cols-[1.35fr_0.85fr] lg:px-12 lg:py-12">
            <div className="space-y-8">
              <div className="rounded-[28px] border border-gray-200 bg-slate-950/90 p-8">
                <div className="inline-flex items-center gap-3 rounded-3xl bg-orange-500/10 px-4 py-2 text-sm uppercase tracking-[1px] text-orange-300 font-black">
                  <Icon name="shoppingCart" size={18} /> Ce que vous gagnez
                </div>
                <h2 className="mt-6 text-3xl font-black text-white">Une présence vendeur pensée pour performer</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
                  TradeHub vous aide à structurer votre activité en ligne, à générer plus de ventes et à gagner la confiance des clients dès les premiers jours.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {benefits.map((item) => (
                  <div key={item.title} className="rounded-[28px] border border-gray-200 bg-slate-50 p-6">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-3xl bg-orange-500/10 text-orange-500">
                      <Icon name={item.icon} size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[28px] border border-gray-200 bg-white p-8 text-slate-900">
                <div className="flex items-center gap-3 text-sm uppercase tracking-[1px] text-orange-500 font-black">
                  <Icon name="star" size={18} /> Processus simplifié
                </div>
                <h2 className="mt-5 text-2xl font-black">Inscription en deux étapes</h2>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Votre compte vendeur se crée facilement en deux étapes : informations de boutique puis finalisation sécurisée.
                </p>
                <div className="mt-6 space-y-4">
                  {steps.map((item) => (
                    <div key={item.title} className="rounded-3xl border border-gray-200 bg-slate-50 p-5">
                      <div className="mb-4 flex items-center gap-3 text-slate-900">
                        <span className="flex h-11 w-11 items-center justify-center rounded-3xl bg-orange-500/10 text-orange-500">
                          <Icon name={item.icon} size={20} />
                        </span>
                        <div>
                          <div className="text-xs uppercase tracking-[1px] text-orange-500 font-black">{item.title}</div>
                          <p className="text-lg font-bold">{item.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-sm leading-6 text-slate-600">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-orange-500/20 bg-orange-50 p-8 text-slate-900">
                <div className="inline-flex items-center gap-3 rounded-full bg-orange-500/10 px-4 py-2 text-sm uppercase tracking-[1px] text-orange-700 font-black">
                  <Icon name="badgeCheck" size={18} /> Accès prioritaire
                </div>
                <h3 className="mt-5 text-2xl font-black">Lancez-vous rapidement</h3>
                <p className="mt-4 text-sm leading-6 text-orange-900/80">
                  En quelques clics, configurez votre espace vendeur et commencez à publier vos produits auprès d’une communauté d’acheteurs engagés.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
