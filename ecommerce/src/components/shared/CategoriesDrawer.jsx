import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, LayoutGrid, X } from 'lucide-react';
import { useCategoryHierarchy } from '@/features/categories/hooks/useCategories';
import { getCategoryIcon } from '@/features/categories/utils/categoryIcons';

const FLYOUT_MAX_HEIGHT = 420;

export default function CategoriesDrawer({ open, onClose }) {
  const navigate = useNavigate();
  const { data: hierarchy = [], isLoading } = useCategoryHierarchy();
  const [rendered, setRendered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [flyoutTop, setFlyoutTop] = useState(0);
  const closeTimer = useRef(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setHovered(null), 150);
  };

  useEffect(() => {
    if (open) {
      setRendered(true);
      const raf = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(raf);
    }
    setMounted(false);
    setHovered(null);
    cancelClose();
    const t = setTimeout(() => setRendered(false), 300);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      cancelClose();
    };
  }, [open, onClose]);

  if (!rendered) return null;

  const go = (slug) => {
    onClose();
    if (slug) navigate(`/category/${slug}`);
  };

  const handleRowEnter = (cat, e) => {
    if (!(cat.children || []).length) return;
    cancelClose();
    setHovered(cat);
    setFlyoutTop(e.currentTarget.getBoundingClientRect().top);
  };

  const flyoutTopClamped = Math.min(flyoutTop, Math.max(window.innerHeight - FLYOUT_MAX_HEIGHT - 12, 0));

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      <div
        className={`absolute left-0 top-0 flex h-full w-[320px] flex-col bg-white shadow-2xl transition-transform duration-300 ${mounted ? 'translate-x-0' : '-translate-x-full'}`}
        onMouseLeave={scheduleClose}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
          <div className="flex items-center gap-2 rounded-md bg-orange-500/10 px-3 py-1.5 text-[15px] font-black text-[#0d1b2a]">
            <LayoutGrid size={18} className="text-orange-500" />
            Toutes les catégories
          </div>
          <button onClick={onClose} className="rounded bg-gray-100 p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-500">
            <X size={16} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-2">
          {isLoading ? (
            <div className="space-y-1 px-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-11 animate-pulse rounded bg-gray-100" />
              ))}
            </div>
          ) : hierarchy.length === 0 ? (
            <div className="px-4 py-8 text-center text-[13px] text-gray-400">Aucune catégorie disponible</div>
          ) : (
            hierarchy.map(cat => {
              const hasChildren = (cat.children || []).length > 0;
              const { Icon, color, bg } = getCategoryIcon(cat);
              return (
                <div key={cat.id} className="relative" onMouseLeave={scheduleClose}>
                  <button
                    onMouseEnter={(e) => handleRowEnter(cat, e)}
                    onClick={() => go(cat.slug)}
                    className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[14px] font-bold transition-colors ${hovered?.id === cat.id ? 'bg-orange-50 text-orange-500' : 'text-[#0d1b2a] hover:bg-gray-50'}`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: bg }}>
                      <Icon size={16} style={{ color }} />
                    </span>
                    <span className="flex-1 truncate">{cat.name}</span>
                    {hasChildren && <ChevronRight size={16} className={`shrink-0 text-gray-300 transition-transform ${hovered?.id === cat.id ? 'translate-x-0.5 text-orange-500' : ''}`} />}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Flyout enfants (hors conteneur scrollable pour éviter le clipping) */}
        {hovered && (
          <div
            className="absolute left-[320px] w-[280px] rounded-r-lg border-l-2 border-orange-500 bg-white py-3 shadow-2xl"
            style={{ top: flyoutTopClamped, maxHeight: FLYOUT_MAX_HEIGHT }}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <div className="px-4 pb-2">
              <button onClick={() => go(hovered.slug)} className="text-[12px] font-black uppercase tracking-wide text-orange-500 hover:underline">
                Voir tout · {hovered.name}
              </button>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: FLYOUT_MAX_HEIGHT - 60 }}>
              {(hovered.children || []).map(child => (
                <button
                  key={child.id}
                  onClick={() => go(child.slug)}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] font-semibold text-gray-600 transition-colors hover:bg-orange-50 hover:text-orange-500"
                >
                  {child.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
