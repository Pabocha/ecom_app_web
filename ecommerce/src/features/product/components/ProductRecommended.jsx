import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import ProductCard from '@/features/product/components/ProductCard.jsx';

const BATCH_SIZE = 10;

export default function ProductRecommended({ products, loading, onAddToCart, onOpenProduct }) {
  const [page, setPage] = useState(1);
  const sentinelRef = useRef(null);

  const allProducts = products || [];
  const totalBatches = Math.ceil(allProducts.length / BATCH_SIZE);
  const visibleProducts = allProducts.slice(0, page * BATCH_SIZE);
  const hasMore = page < totalBatches;

  const loadMore = useCallback(() => {
    if (hasMore) setPage(prev => prev + 1);
  }, [hasMore]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: '200px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore, visibleProducts.length]);

  useEffect(() => {
    setPage(1);
  }, [allProducts.length]);

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="font-['Barlow_Condensed'] text-[22px] font-black text-[#0d1b2a] flex items-center gap-2.5">
            <span className="w-1 h-5 bg-orange-500 rounded block" />
            Recommandé pour vous
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
              <div className="pt-[100%] bg-gray-200" />
              <div className="p-2.5 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (allProducts.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="font-['Barlow_Condensed'] text-[22px] font-black text-[#0d1b2a] flex items-center gap-2.5">
          <span className="w-1 h-5 bg-orange-500 rounded block" />
          Recommandé pour vous
        </div>
        <span className="text-[13px] text-orange-500 font-semibold flex items-center gap-1">
          Voir tout <ArrowRight size={14} />
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2.5">
        {visibleProducts.map((p, i) => (
          <ProductCard
            key={`${p.id}-${i}`}
            product={p}
            onAddToCart={onAddToCart}
            onOpenProduct={onOpenProduct}
          />
        ))}
      </div>

      <div ref={sentinelRef} className="h-4" />

      {!hasMore && visibleProducts.length > 0 && (
        <p className="text-center text-[12px] text-gray-400 mt-4">Tous les produits recommandés sont affichés</p>
      )}

      {hasMore && (
        <div className="flex justify-center py-4">
          <Loader2 size={24} className="text-orange-500 animate-spin" />
        </div>
      )}
    </div>
  );
}
