import { useAnnouncements } from '@/features/marketing/hooks/useMarketing';

export default function AnnouncementBar() {
  const { data: announcements } = useAnnouncements();

  if (!announcements?.length) return null;

  return (
    <div className="bg-[#0d1b2a] h-[34px] overflow-hidden relative flex items-center">
      <div className="announcement-marquee hover:[animation-play-state:paused]">
        {[0, 1].map(group => (
          <div key={group} className="announcement-marquee-group" aria-hidden={group === 1}>
            {announcements.map(a => (
              <span key={`${group}-${a.id}-${a.title}`} className="inline-flex items-center gap-1.5 px-10 text-[12px] text-gray-300">
                {a.badge && (
                  <span className={`${a.badge_color || 'bg-orange-500'} text-white text-[10px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wide`}>
                    {a.badge}
                  </span>
                )}
                {a.description}
                <span className="text-orange-500 opacity-40 px-2">|</span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="absolute right-0 top-0 h-full hidden md:flex items-center gap-4 px-4 bg-gradient-to-r from-transparent via-[#0d1b2a]/90 to-[#0d1b2a] text-[11px] text-gray-400">
        <a href="#" className="hover:text-orange-400 transition-colors">Aide</a>
        <span className="text-gray-700">|</span>
        <a href="#" className="hover:text-orange-400 transition-colors">Devenir Vendeur</a>
        <span className="text-gray-700">|</span>
        <a href="#" className="hover:text-orange-400 transition-colors">🇫🇷 FR — FCFA</a>
      </div>
    </div>
  );
}
