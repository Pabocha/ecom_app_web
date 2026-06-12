import { useNavigate } from 'react-router-dom';
import { suppliers, formatPrice } from '@/data/data.js';
import Icon from '@/components/shared/Icon.jsx';

export default function TopSellersPage() {
  const navigate = useNavigate();
  const topSellers = [
    { id: 1, name: 'TechStore Dakar', rating: 4.8, sales: '12,400+', category: 'Électronique', img: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&q=80', description: 'Leader en électronique grand public', badge: 'Certifié' },
    { id: 2, name: 'Mode Dakar', rating: 4.7, sales: '8,900+', category: 'Mode & Vêtements', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&q=80', description: 'Spécialiste de la mode africaine', badge: 'Top Vendeur' },
    { id: 3, name: 'SportsHub Africa', rating: 4.6, sales: '7,200+', category: 'Sports & Loisirs', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&q=80', description: 'Équipements sportifs authentiques', badge: 'Certifié' },
    { id: 4, name: 'Meubles Premium', rating: 4.9, sales: '6,100+', category: 'Maison & Jardin', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&q=80', description: 'Mobilier haut de gamme importé', badge: 'Top Vendeur' },
  ];

  return (
    <div className="min-h-screen bg-[#111827] pb-12 text-white">
      <div className="sticky top-0 z-20 border-b border-white/10 bg-[#111827]/95 backdrop-blur">
        <div className="max-w-[1300px] mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[2px] text-amber-300 font-black">Partenaires</div>
            <h1 className="font-['Barlow_Condensed'] text-[34px] font-black leading-none">Top Vendeurs</h1>
          </div>
          <button onClick={() => navigate('/')} className="bg-white/10 hover:bg-white/15 text-white px-3.5 py-2 rounded text-[13px] font-bold flex items-center gap-2">
            <Icon name="arrowLeft" /> Retour
          </button>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-4 py-8">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-400 px-7 py-8 mb-8">
          <div className="absolute right-6 top-4 text-[96px] font-black text-white/10 leading-none">⭐</div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded bg-black/25 px-3 py-1 text-[12px] font-black uppercase">
              <Icon name="crown" size={14} /> Les meilleurs
            </div>
            <h2 className="font-['Barlow_Condensed'] text-[46px] font-black leading-tight mt-3">Les vendeurs les plus fiables</h2>
            <p className="text-white/80 text-[14px] max-w-[560px]">Découvrez nos partenaires certifiés avec les meilleures notes et le plus grand nombre de transactions réussies.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {topSellers.map((seller) => (
            <div key={seller.id} className="rounded-lg border border-white/10 overflow-hidden hover:border-white/30 transition-colors cursor-pointer bg-white/5">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img src={seller.img} alt={seller.name} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-[18px]">{seller.name}</h3>
                      <span className="rounded bg-amber-600/30 border border-amber-500 px-2.5 py-1 text-[11px] font-bold text-amber-200">{seller.badge}</span>
                    </div>
                    <p className="text-[13px] text-white/60 mb-2">{seller.description}</p>
                    <div className="text-[12px] text-white/70">{seller.category}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-t border-white/10 border-b">
                  <div>
                    <div className="text-[12px] text-white/60 mb-1">Note</div>
                    <div className="font-bold text-[18px]">⭐ {seller.rating}</div>
                  </div>
                  <div>
                    <div className="text-[12px] text-white/60 mb-1">Ventes</div>
                    <div className="font-bold text-[18px]">{seller.sales}</div>
                  </div>
                  <div>
                    <div className="text-[12px] text-white/60 mb-1">Réponse</div>
                    <div className="font-bold text-[18px]">98%</div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex-1 rounded bg-amber-600 hover:bg-amber-700 px-4 py-2 text-[13px] font-bold">
                    Visiter
                  </button>
                  <button className="flex-1 rounded bg-white/10 hover:bg-white/15 px-4 py-2 text-[13px] font-bold">
                    Suivre
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-lg bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border border-amber-400/30">
          <h3 className="font-bold text-[20px] mb-2">Devenez vendeur avec nous</h3>
          <p className="text-white/70 mb-4">Rejoignez notre communauté de top vendeurs et développez votre business avec TradeHub.</p>
          <button className="bg-amber-600 hover:bg-amber-700 px-6 py-2 rounded font-bold text-[14px]">Postuler maintenant</button>
        </div>
      </div>
    </div>
  );
}
