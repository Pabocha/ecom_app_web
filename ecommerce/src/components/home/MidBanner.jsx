const sideBanners = [
  { img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&q=80', label: 'Mode & Style', sub: 'Nouvelles collections', color: 'from-red-900/80' },
  { img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80', label: 'High-Tech', sub: '-50% cette semaine', color: 'from-[#0d1b2a]/90' },
];

export default function MidBanner() {
  return (
    <div className="grid grid-cols-[1fr_250px] gap-2.5">
      <div className="relative bg-gradient-to-br from-[#0d1b2a] via-[#1a3a5c] to-[#0d1b2a] rounded-lg flex items-center px-10 gap-8 min-h-[160px] overflow-hidden cursor-pointer shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 transition-shadow">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(255,106,0,0.15),transparent_60%)]" />
        <div className="relative z-1 flex-1">
          <div className="text-[11px] font-black uppercase tracking-[2px] text-orange-400 mb-1.5">Offre Limitée - 72h Seulement</div>
          <div className="font-['Barlow_Condensed'] text-[44px] font-black text-white leading-none mb-2">
            SOLDES D'ÉTÉ<br /><span className="text-orange-500">JUSQU'À -60%</span>
          </div>
          <div className="text-[13px] text-white/60 mb-4">Sur +50 000 articles - Électronique, Mode, Maison & plus</div>
          <a href="#" className="inline-block bg-orange-500 hover:bg-white hover:text-orange-500 text-white px-6 py-2.5 rounded text-[14px] font-black uppercase tracking-wide transition-all">
            Profiter maintenant →
          </a>
        </div>
        <div className="relative z-1 shrink-0">
          <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80" alt="Promo" className="w-48 h-36 object-cover rounded shadow-xl shadow-black/40" />
          <div className="absolute -top-2.5 -right-2.5 bg-red-500 text-white text-[11px] font-black px-2.5 py-1 rounded rotate-3">HOT DEAL</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {sideBanners.map(b => (
          <div key={b.label} className="flex-1 relative overflow-hidden rounded cursor-pointer group min-h-[74px]">
            <img src={b.img} alt={b.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className={`absolute inset-0 bg-gradient-to-r ${b.color} via-transparent to-transparent flex items-center gap-3 px-4`}>
              <div>
                <strong className="text-white text-[15px] font-black block leading-none">{b.label}</strong>
                <span className="text-white/75 text-[11px]">{b.sub}</span>
              </div>
              <span className="ml-auto bg-white text-[11px] font-bold px-3 py-1.5 rounded text-orange-500 shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">Voir →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
