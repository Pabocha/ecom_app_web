import { useBannersByType } from '@/features/marketing/hooks/useMarketing';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function HeroBanners() {
  const { data: banners, isLoading } = useBannersByType('slidebanner');

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex-1 rounded bg-[#0d1b2a]/5 animate-pulse min-h-[100px]" />
        ))}
      </div>
    );
  }

  if (!banners?.length) return null;

  return (
    <div className="flex flex-col gap-2">
      {banners.map(b => (
        <div key={b.id || b.title} className="flex-1 relative overflow-hidden rounded cursor-pointer group shadow">
          <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-3">
            {b.tag && (
              <div className="text-[9px] font-black uppercase tracking-widest text-yellow-400">{b.tag}</div>
            )}
            {b.title && (
              <div className="text-[14px] font-bold text-white">{b.title}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
