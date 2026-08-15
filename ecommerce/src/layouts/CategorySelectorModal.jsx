import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { useCategoryHierarchy } from '@/features/categories/hooks/useCategories';
import { getCategoryIcon } from '@/features/categories/utils/categoryIcons';

export default function CategorySelectorModal({ open, onClose }) {
  const navigate = useNavigate();
  const { data: hierarchy = [], isLoading } = useCategoryHierarchy();
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (open && hierarchy.length > 0 && !hierarchy.some(c => c.id === selectedId)) {
      setSelectedId(hierarchy[0].id);
    }
  }, [open, hierarchy, selectedId]);

  if (!open) return null;

  const selectedCategory = hierarchy.find(c => c.id === selectedId) || hierarchy[0];

  const go = (slug) => {
    onClose();
    if (slug) navigate(`/category/${slug}`);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-[600] transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[601] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="relative bg-white rounded-lg shadow-2xl w-full max-w-5xl h-[500px] flex overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button (inside container) */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
          >
            <X size={18} />
          </button>

          {/* Left Sidebar - Parent Categories */}
          <div className="w-48 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-1 p-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-11 animate-pulse rounded bg-gray-200" />
                ))}
              </div>
            ) : hierarchy.length === 0 ? (
              <div className="p-4 text-[13px] text-gray-400">Aucune catégorie</div>
            ) : (
              hierarchy.map(cat => {
                const { Icon, color, bg } = getCategoryIcon(cat);
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedId(cat.id)}
                    className={`w-full px-4 py-3.5 text-left border-l-4 transition-all flex items-center gap-3 ${
                      selectedCategory?.id === cat.id
                        ? 'bg-white border-l-orange-500 font-bold text-gray-900'
                        : 'border-l-transparent hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: bg }}
                    >
                      <Icon size={16} style={{ color }} />
                    </div>
                    <span className="text-sm font-semibold truncate">{cat.name}</span>
                  </button>
                );
              })
            )}
          </div>

          {/* Right Side - Subcategories Grid */}
          <div className="flex-1 overflow-y-auto p-6 bg-white">
            {!selectedCategory ? (
              <div className="text-center py-20 text-gray-400 text-[13px]">Choisissez une catégorie</div>
            ) : (
              <>
                {/* Header */}
                <div className="mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0"
                      style={{ backgroundColor: getCategoryIcon(selectedCategory).bg }}
                    >
                      {selectedCategory.image ? (
                        <img
                          src={selectedCategory.image}
                          alt={selectedCategory.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          {(() => {
                            const { Icon, color } = getCategoryIcon(selectedCategory);
                            return <Icon size={28} style={{ color }} />;
                          })()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-2xl font-black text-gray-900">{selectedCategory.name}</h2>
                      <button
                        onClick={() => go(selectedCategory.slug)}
                        className="mt-2 inline-flex items-center gap-1 rounded bg-orange-500 px-3 py-1.5 text-[12px] font-black text-white hover:bg-orange-600 transition-colors"
                      >
                        Voir tout · {selectedCategory.name} <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subcategories Grid */}
                {(selectedCategory.children || []).length === 0 ? (
                  <p className="text-center py-16 text-gray-400 text-[13px]">Aucune sous-catégorie</p>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {selectedCategory.children.map((child) => {
                      const { Icon, color, bg } = getCategoryIcon(child);
                      return (
                        <button
                          key={child.id}
                          onClick={() => go(child.slug)}
                          className="group flex flex-col items-center text-center transition-all hover:scale-105"
                        >
                          <div
                            className="w-24 h-24 rounded-lg flex items-center justify-center mb-3 group-hover:shadow-lg transition-shadow"
                            style={{ backgroundColor: bg }}
                          >
                            <Icon size={40} className="opacity-60" style={{ color }} />
                          </div>
                          <span className="text-sm font-semibold text-gray-800 group-hover:text-orange-500 transition-colors">
                            {child.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
