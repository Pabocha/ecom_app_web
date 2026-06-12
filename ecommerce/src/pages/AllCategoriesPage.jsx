import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories, trendingSubcats, b2bCategories } from '@/data/data.js';
import Icon from '@/components/shared/Icon.jsx';

export default function AllCategoriesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Tous');

  const filters = ['Tous', 'B2C', 'B2B', 'Tendance', 'Nouveau'];

  const filtered = categories.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'Tous' || c.badge === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* Close bar */}
      <div className="bg-[#0d1b2a] px-4 py-2.5 flex items-center justify-between sticky top-0 z-10">
        <div className="font-['Barlow_Condensed'] text-2xl font-black text-white">
          Trade<span className="text-orange-500">Hub</span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-300 hover:text-white text-[13px] px-3.5 py-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Icon name="arrowLeft" /> Retour à l'accueil
        </button>
      </div>

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#0d1b2a] via-[#1a3a5c] to-[#0d2235] py-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-[20%] w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-[10%] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-[1300px] mx-auto px-4 relative z-1">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/20 border border-orange-500/30 text-orange-300 text-[11px] font-black uppercase tracking-[1.5px] px-3 py-1.5 rounded-full mb-4">
            <Icon name="thLarge" /> Toutes les catégories
          </div>
          <h1 className="font-['Barlow_Condensed'] text-[52px] font-black text-white leading-tight mb-2">
            Explorez nos <span className="text-orange-500">Catégories</span>
          </h1>
          <p className="text-[14px] text-white/60 mb-6">+100 000 produits répartis en {categories.length} grandes catégories B2C & B2B</p>

          {/* Search */}
          <div className="flex max-w-[520px] bg-white rounded overflow-hidden shadow-xl shadow-black/25">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher une catégorie..."
              className="flex-1 px-4 py-3 text-[14px] outline-none text-gray-700"
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 text-[15px] transition-colors">
              <Icon name="search" />
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-7 mt-5">
            {[
              { val: '100 000+', label: 'Produits' },
              { val: '8 500+', label: 'Vendeurs' },
              { val: '48', label: 'Pays livrés' },
              { val: '2 400+', label: 'Fournisseurs B2B' },
            ].map(s => (
              <div key={s.label} className="text-white/70 text-[12px]">
                <strong className="font-['Barlow_Condensed'] text-[20px] font-black text-white block leading-none">{s.val}</strong>
                {s.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-4 pt-7">
        {/* Filter bar */}
        <div className="flex items-center gap-2.5 mb-6 flex-wrap">
          <span className="text-[13px] font-bold text-[#0d1b2a]">Filtrer :</span>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full border-[1.5px] text-[12px] font-semibold transition-all ${filter === f ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-400 hover:text-orange-500'}`}
            >
              {f}
            </button>
          ))}
          <span className="ml-auto text-[13px] text-gray-400">{filtered.length} catégorie{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}</span>
        </div>

        {/* === MAIN CATEGORIES GRID === */}
        <div className="mb-3 font-['Barlow_Condensed'] text-[20px] font-black text-[#0d1b2a] flex items-center gap-2.5">
          <span className="w-1 h-5 bg-orange-500 rounded block" />
          Catégories Principales
        </div>
        <div className="grid grid-cols-4 gap-4 mb-12">
          {filtered.map((cat, i) => (
            <div
              key={cat.name}
              onClick={() => navigate(`/category/${cat.name}`)}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Image */}
              <div className="relative overflow-hidden" style={{ paddingTop: '60%' }}>
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2a]/80 via-[#0d1b2a]/10 to-transparent" />
                {cat.badge && (
                  <span className={`absolute top-3 left-3 ${cat.badgeColor} text-white text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-wide`}>
                    {cat.badge}
                  </span>
                )}
                <span className="absolute top-3 right-3 bg-black/40 text-white/90 text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                  {cat.count}
                </span>
              </div>

              {/* Footer */}
              <div className="p-4">
                <h3 className="text-[16px] font-black text-[#0d1b2a] mb-1">{cat.name}</h3>
                <p className="text-[12px] text-gray-400 mb-3 leading-tight">{cat.desc}</p>

                {/* Subcategories */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {cat.subcats.slice(0, 4).map(s => (
                    <span key={s} className="text-[11px] px-2 py-0.5 rounded-full border border-gray-200 text-gray-500 bg-gray-50 hover:bg-orange-500 hover:text-white hover:border-orange-500 cursor-pointer transition-colors">
                      {s}
                    </span>
                  ))}
                  {cat.subcats.length > 4 && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full border border-gray-200 text-gray-400 bg-gray-50">
                      +{cat.subcats.length - 4}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-[12px] font-bold text-orange-500 flex items-center gap-1 group-hover:gap-2.5 transition-all">
                    Parcourir <Icon name="arrowRight" size={12} />
                  </span>
                  <span className="text-[11px] text-gray-400">{cat.subcats.length} sous-catégories</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* === TENDANCES === */}
        <div className="mb-3 font-['Barlow_Condensed'] text-[20px] font-black text-[#0d1b2a] flex items-center gap-2.5">
          <span className="w-1 h-5 bg-orange-500 rounded block" />
          Sous-catégories Tendances
        </div>
        <div className="grid grid-cols-6 gap-3 mb-12">
          {trendingSubcats.map((t, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300" style={{ aspectRatio: '3/4' }}>
              <img src={t.img} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent flex flex-col justify-end p-3">
                <div className="text-[13px] font-black text-white leading-tight">{t.name}</div>
                <div className="text-[10px] text-white/70 mt-0.5">{t.count} produits</div>
              </div>
              {t.hot && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                  🔥 Hot
                </div>
              )}
            </div>
          ))}
        </div>

        {/* === PROMO BANNER === */}
        <div className="relative bg-gradient-to-br from-[#0d1b2a] to-[#1a3a5c] rounded-xl px-9 py-7 flex items-center justify-between gap-6 mb-12 overflow-hidden shadow-lg shadow-orange-500/15">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-0 top-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="relative z-1">
            <div className="font-['Barlow_Condensed'] text-[34px] font-black text-white mb-1">
              Vous êtes <span className="text-orange-500">fournisseur</span> ?
            </div>
            <p className="text-[13px] text-white/60">Rejoignez +8 500 vendeurs et accédez à des millions d'acheteurs en Afrique de l'Ouest.</p>
          </div>
          <div className="flex gap-3 shrink-0 relative z-1">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded font-black text-[14px] uppercase tracking-wide transition-colors">
              Devenir Vendeur
            </button>
            <button className="border-2 border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded font-bold text-[14px] transition-colors">
              En savoir plus
            </button>
          </div>
        </div>

        {/* === B2B CATEGORIES === */}
        <div className="mb-3 font-['Barlow_Condensed'] text-[20px] font-black text-[#0d1b2a] flex items-center gap-2.5">
          <span className="w-1 h-5 bg-blue-600 rounded block" />
          Catégories B2B & Gros
        </div>
        <div className="grid grid-cols-5 gap-3 mb-8">
          {b2bCategories.map((b, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-250 cursor-pointer group border-[1.5px] border-transparent hover:border-blue-500">
              <div className="relative overflow-hidden" style={{ paddingTop: '56%' }}>
                <img src={b.img} alt={b.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-3">
                <div className="text-[13px] font-black text-[#0d1b2a] mb-1">{b.name}</div>
                <div className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
                  <Icon name="building" size={12} /> {b.suppliers}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* All subcats alphabetical A-Z */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="font-['Barlow_Condensed'] text-[20px] font-black text-[#0d1b2a] mb-4 flex items-center gap-2.5">
            <span className="w-1 h-5 bg-orange-500 rounded block" />
            Toutes les sous-catégories
          </div>
          <div className="grid grid-cols-4 gap-x-8 gap-y-1">
            {categories.flatMap(c => c.subcats).sort().map((sub, i) => (
              <div key={i} className="py-1.5 border-b border-gray-50 text-[13px] text-gray-600 hover:text-orange-500 cursor-pointer transition-colors flex items-center gap-2">
                <Icon name="chevronRight" size={11} className="text-gray-300" /> {sub}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
