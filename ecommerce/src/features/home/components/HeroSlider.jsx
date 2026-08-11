import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBannersByType } from '@/features/marketing/hooks/useMarketing';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function HeroSlider() {
  const [cur, setCur] = useState(0);
  const { data: banners, isLoading } = useBannersByType('slider');

  useEffect(() => {
    if (!banners?.length) return;
    const t = setInterval(() => setCur(c => (c + 1) % banners.length), 4500);
    return () => clearInterval(t);
  }, [banners]);

  const prev = () => setCur(c => (c - 1 + (banners?.length || 0)) % (banners?.length || 1));
  const next = () => setCur(c => (c + 1) % (banners?.length || 1));

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded h-[360px] bg-[#0d1b2a] shadow flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!banners?.length) return null;

  return (
    <div className="relative overflow-hidden rounded h-[360px] bg-[#0d1b2a] shadow">
      {banners.map((b, i) => (
        <div key={b.id || b.title} className={`absolute inset-0 transition-opacity duration-700 ${i === cur ? 'opacity-100' : 'opacity-0'}`}>
          <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-center px-9 max-w-[55%]">
            <div>
              {b.tag && (
                <span className="inline-block bg-orange-500 text-white text-[11px] font-black px-2.5 py-1 rounded-sm uppercase tracking-widest mb-3">{b.tag}</span>
              )}
              {b.title && (
                <div className="font-['Barlow_Condensed'] text-[38px] font-black text-white leading-tight mb-2.5">{b.title}</div>
              )}
              {b.description && (
                <div className="text-[13px] text-white/80 mb-5 leading-relaxed">{b.description}</div>
              )}
              {b.cta && (
                <span className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded text-[14px] font-bold cursor-pointer transition-colors">
                  {b.cta} →
                </span>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {banners.map((b, i) => (
          <div key={b.id || b.title} onClick={() => setCur(i)} className={`h-2 rounded-full cursor-pointer transition-all ${i === cur ? 'w-5 bg-orange-500' : 'w-2 bg-white/40'}`} />
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
