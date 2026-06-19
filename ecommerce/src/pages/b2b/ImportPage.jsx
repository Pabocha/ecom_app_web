import { useNavigate } from 'react-router-dom';
import { suppliers, formatPrice } from '@/data/data.js';
import { Globe } from 'lucide-react';

export default function ImportPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      <div className="max-w-[1300px] mx-auto px-4 py-8">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 via-pink-500 to-rose-400 px-7 py-8 mb-8">
          <div className="absolute right-6 top-4 text-[96px] font-black text-white/10 leading-none">🌍</div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded bg-black/25 px-3 py-1 text-[12px] font-black uppercase">
              <Globe size={14} /> Sourcing mondial
            </div>
            <h2 className="font-['Barlow_Condensed'] text-[46px] font-black leading-tight mt-3">Produits importés</h2>
            <p className="text-white/80 text-[14px] max-w-[560px]">Connectez-vous directement avec nos fournisseurs internationaux pour importer en gros. Chine, Europe, Asie du Sud-Est et bien d'autres.</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {[
            { title: 'Chine', icon: '🇨🇳', suppliers: 450, desc: 'Électronique, textile, jouets' },
            { title: 'Europe', icon: '🇪🇺', suppliers: 320, desc: 'Qualité premium & luxe' },
            { title: 'Asie du Sud-Est', icon: '🌏', suppliers: 280, desc: 'Machines, équipements, BTP' },
          ].map((region) => (
            <div key={region.title} className="rounded-lg bg-white border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer shadow-sm">
              <div className="text-[56px] mb-3">{region.icon}</div>
              <h3 className="text-[20px] font-bold text-gray-800 mb-1">{region.title}</h3>
              <p className="text-[13px] text-gray-500 mb-4">{region.desc}</p>
              <div className="text-[12px] font-bold text-purple-600">{region.suppliers} fournisseurs</div>
            </div>
          ))}
        </div>

        <h3 className="font-['Barlow_Condensed'] text-[28px] font-black text-gray-800 mb-4">Fournisseurs vérifiés</h3>
        <div className="grid grid-cols-2 gap-4">
          {suppliers.map((supplier) => (
            <div key={supplier.name} className="rounded-lg bg-white border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer shadow-sm">
              <div className="flex items-start gap-4">
                <img src={supplier.img} alt={supplier.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <h4 className="font-bold text-[15px] text-gray-800 mb-1">{supplier.name}</h4>
                  <p className="text-[13px] text-gray-500 mb-2">{supplier.country}</p>
                  <div className="flex items-center gap-3 text-[13px] text-gray-700">
                    <div className="font-bold">★ {supplier.rating}</div>
                    <div className="text-gray-500">Score: {supplier.score}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-300">
          <h3 className="font-bold text-[20px] text-gray-800 mb-2">Besoin d'assistance?</h3>
          <p className="text-gray-600 mb-4">Notre équipe d'experts en sourcing est prête à vous aider à trouver les fournisseurs parfaits pour votre business.</p>
          <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded font-bold text-[14px] text-white">Contacter un expert</button>
        </div>
      </div>
    </div>
  );
}
