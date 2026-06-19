import { useEffect, useState } from 'react';
import { slides } from '@/data/data.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroSlider() {
  const [cur, setCur] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCur(c => (c + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, []);

  const prev = () => setCur(c => (c - 1 + slides.length) % slides.length);
  const next = () => setCur(c => (c + 1) % slides.length);

  return (
    <div className="relative overflow-hidden rounded h-[360px] bg-[#0d1b2a] shadow">
      {slides.map((s, i) => (
        <div key={s.title} className={`absolute inset-0 transition-opacity duration-700 ${i === cur ? 'opacity-100' : 'opacity-0'}`}>
          <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-center px-9 max-w-[55%]">
            <div>
              <span className="inline-block bg-orange-500 text-white text-[11px] font-black px-2.5 py-1 rounded-sm uppercase tracking-widest mb-3">{s.tag}</span>
              <div className="font-['Barlow_Condensed'] text-[38px] font-black text-white leading-tight mb-2.5">{s.title}</div>
              <div className="text-[13px] text-white/80 mb-5 leading-relaxed">{s.desc}</div>
              <span className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded text-[14px] font-bold cursor-pointer transition-colors">
                {s.cta} →
              </span>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {slides.map((s, i) => (
          <div key={s.title} onClick={() => setCur(i)} className={`h-2 rounded-full cursor-pointer transition-all ${i === cur ? 'w-5 bg-orange-500' : 'w-2 bg-white/40'}`} />
        ))}
      </div>
      <button onClick={prev} className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-orange-500 text-white rounded-full flex items-center justify-center text-[13px] transition-colors z-10">
        <ChevronLeft size={14} />
      </button>
      <button onClick={next} className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-orange-500 text-white rounded-full flex items-center justify-center text-[13px] transition-colors z-10">
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
