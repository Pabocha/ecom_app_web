import { useNavigate } from 'react-router-dom';
import { suppliers, formatPrice } from '@/data/data.js';
import { Crown } from 'lucide-react';

export default function TopSellersPage() {
  const navigate = useNavigate();
  const topSellers = [
    { id: 1, name: 'TechStore Dakar', rating: 4.8, sales: '12,400+', category: 'Électronique', img: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&q=80', description: 'Leader en électronique grand public', badge: 'Certifié' },
    { id: 2, name: 'Mode Dakar', rating: 4.7, sales: '8,900+', category: 'Mode & Vêtements', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&q=80', description: 'Spécialiste de la mode africaine', badge: 'Top Vendeur' },
    { id: 3, name: 'SportsHub Africa', rating: 4.6, sales: '7,200+', category: 'Sports & Loisirs', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&q=80', description: 'Équipements sportifs authentiques', badge: 'Certifié' },
    { id: 4, name: 'Meubles Premium', rating: 4.9, sales: '6,100+', category: 'Maison & Jardin', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&q=80', description: 'Mobilier haut de gamme importé', badge: 'Top Vendeur' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      <div className="max-w-[1300px] mx-auto px-4 py-8">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-400 px-7 py-8 mb-8">
          <div className="absolute right-6 top-4 text-[96px] font-black text-white/10 leading-none">⭐</div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded bg-black/25 px-3 py-1 text-[12px] font-black uppercase">
              <Crown size={14} /> Les meilleurs
            </div>
            <h2 className="font-['Barlow_Condensed'] text-[46px] font-black leading-tight mt-3">Les vendeurs les plus fiables</h2>
            <p className="text-white/80 text-[14px] max-w-[560px]">Découvrez nos partenaires certifiés avec les meilleures notes et le plus grand nombre de transactions réussies.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {topSellers.map((seller) => (
            <div key={seller.id} className="rounded-lg border border-gray-200 overflow-hidden hover:border-amber-300 transition-colors cursor-pointer bg-white shadow-sm">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img src={seller.img} alt={seller.name} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-[18px] text-gray-800">{seller.name}</h3>
                      <span className="rounded bg-amber-100 border border-amber-300 px-2.5 py-1 text-[11px] font-bold text-amber-700">{seller.badge}</span>
                    </div>
                    <p className="text-[13px] text-gray-500 mb-2">{seller.description}</p>
                    <div className="text-[12px] text-gray-600">{seller.category}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-200">
                  <div>
                    <div className="text-[12px] text-gray-500 mb-1">Note</div>
                    <div className="font-bold text-[18px] text-gray-800">⭐ {seller.rating}</div>
                  </div>
                  <div>
                    <div className="text-[12px] text-gray-500 mb-1">Ventes</div>
                    <div className="font-bold text-[18px] text-gray-800">{seller.sales}</div>
                  </div>
                  <div>
                    <div className="text-[12px] text-gray-500 mb-1">Réponse</div>
                    <div className="font-bold text-[18px] text-gray-800">98%</div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex-1 rounded bg-amber-600 hover:bg-amber-700 px-4 py-2 text-[13px] font-bold text-white">
                    Visiter
                  </button>
                  <button className="flex-1 rounded bg-gray-100 hover:bg-gray-200 px-4 py-2 text-[13px] font-bold text-gray-700">
                    Suivre
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-300">
          <h3 className="font-bold text-[20px] text-gray-800 mb-2">Devenez vendeur avec nous</h3>
          <p className="text-gray-600 mb-4">Rejoignez notre communauté de top vendeurs et développez votre business avec TradeHub.</p>
          <button className="bg-amber-600 hover:bg-amber-700 px-6 py-2 rounded font-bold text-[14px] text-white">Postuler maintenant</button>
        </div>
      </div>
    </div>
  );
}
