import { Building2, MessageCircle, Star, X } from 'lucide-react';

const socialIconMap = {
  facebook: MessageCircle,
  xTwitter: X,
  message: MessageCircle,
  building: Building2,
  star: Star,
  whatsapp: MessageCircle,
};

const footerCols = [
  { title: "Marketplace", links: ["Toutes catégories", "Offres du jour", "Nouveautés", "Meilleures ventes", "Ventes Flash"] },
  { title: "Vendeurs", links: ["Devenir vendeur", "Espace fournisseur", "Programme B2B", "Tarifs & commissions", "Centre d'aide"] },
  { title: "Services", links: ["Logistique & transport", "Inspection produits", "Financement achat", "Assurance colis", "Dédouanement"] },
  { title: "TradeHub", links: ["À propos", "Presse", "Carrières", "Blog", "Contact"] },
];

const socials = ["facebook", "xTwitter", "message", "building", "star", "whatsapp"];
const payments = ["WAVE", "ORANGE", "VISA", "MC", "VIREMENT"];

export default function Footer() {
  return (
    <footer className="bg-[#0d1b2a] text-gray-400 pt-10">
      <div className="max-w-[1300px] mx-auto px-4">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-8 pb-8 border-b border-white/[0.08]">
          {/* Brand */}
          <div>
            <span className="font-['Barlow_Condensed'] text-3xl font-black text-white block mb-3">
              Trade<span className="text-orange-500">Hub</span>
            </span>
            <p className="text-[12px] text-gray-500 leading-relaxed mb-4">
              La marketplace B2B & B2C de référence en Afrique de l'Ouest. Achetez, vendez, importez.
              Des millions de produits, des milliers de fournisseurs vérifiés.
            </p>
            <div className="flex gap-2">
              {socials.map(s => {
                const SocialIcon = socialIconMap[s];
                return (
                <div key={s} className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-orange-500 flex items-center justify-center text-[13px] cursor-pointer transition-colors">
                  <SocialIcon size={14} />
                </div>
              );
              })}
            </div>
          </div>
          {/* Columns */}
          {footerCols.map(col => (
            <div key={col.title}>
              <h4 className="text-[13px] font-black text-white mb-3.5 uppercase tracking-[0.5px]">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l}><a href="#" className="text-[12px] text-gray-500 hover:text-orange-400 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="py-4 flex items-center justify-between text-[11px]">
          <span>© 2025 TradeHub Africa. Tous droits réservés.</span>
          <div className="flex gap-4">
            {["Conditions", "Confidentialité", "Cookies", "Plan du site"].map(l => (
              <a key={l} href="#" className="text-gray-600 hover:text-orange-400 transition-colors">{l}</a>
            ))}
          </div>
          <div className="flex gap-2">
            {payments.map(p => (
              <span key={p} className="bg-white/[0.08] rounded px-2 py-0.5 text-[11px] text-gray-300 font-semibold">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
