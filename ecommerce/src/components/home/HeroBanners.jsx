import { sideBanners } from '../../data/data.js';

export default function HeroBanners() {
  return (
    <div className="flex flex-col gap-2">
      {sideBanners.map(b => (
        <div key={b.title} className="flex-1 relative overflow-hidden rounded cursor-pointer group shadow">
          <img src={b.img} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-3">
            <div className="text-[9px] font-black uppercase tracking-widest text-yellow-400">{b.tag}</div>
            <div className="text-[14px] font-bold text-white">{b.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
