import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecentlyViewed } from '@/features/product/hooks/useProduct';
import { productService } from '@/features/product/services/productService';
import { debounce, formatPrice } from '@/utils/helpers';
import { Search, Clock } from 'lucide-react';

export default function SearchDropdown({ query, onQueryChange, onSubmit, isOpen, onClose }) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const { data: recentRes, isLoading: recentLoading } = useRecentlyViewed();
  const recentItems = recentRes?.data?.results || [];

  const debouncedAutocomplete = useCallback(
    debounce(async (q) => {
      if (!q.trim()) {
        setSuggestions([]);
        return;
      }
      setSuggestionsLoading(true);
      try {
        const res = await productService.searchAutocomplete(q);
        setSuggestions(res.data || []);
      } catch {
        setSuggestions([]);
      }
      setSuggestionsLoading(false);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedAutocomplete(query);
  }, [query, debouncedAutocomplete]);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  const handleSuggestionClick = (suggestion) => {
    onQueryChange(suggestion);
    onSubmit(suggestion);
    onClose();
  };

  const handleRecentClick = (item) => {
    const p = item.product_detail;
    if (p?.id) {
      navigate(`/product/${p.id}`);
      onClose();
    }
  };

  const handleShowAllRecent = () => {
    navigate('/search?q=&type=Produits');
    onClose();
  };

  if (!isOpen) return null;

  const hasQuery = query.trim().length > 0;

  return (
    <div ref={ref} className="absolute left-0 right-0 top-full mt-1 z-[700]">
      <div className="relative overflow-hidden rounded-md bg-white shadow-2xl shadow-black/30 ring-1 ring-black/5">
        {!hasQuery && (
          <>
            {recentLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
              </div>
            ) : recentItems.length > 0 ? (
              <div className="p-3">
                <div className="mb-2 flex items-center gap-1 text-[11px] font-bold uppercase text-gray-400">
                  <Clock size={12} /> Consultés récemment
                </div>
                <div className="space-y-1">
                  {recentItems.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleRecentClick(item)}
                      className="flex cursor-pointer items-center gap-2.5 rounded p-1.5 transition-colors hover:bg-orange-50"
                    >
                      <img
                        src={item.product_detail?.image}
                        alt={item.product_detail?.name}
                        className="h-10 w-10 shrink-0 rounded object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-semibold text-[#0d1b2a]">
                          {item.product_detail?.name}
                        </div>
                        <div className="text-[12px] font-black text-orange-500">
                          {formatPrice(item.product_detail?.base_price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="px-3 py-6 text-center text-[13px] text-gray-400">
                <Clock size={20} className="mx-auto mb-1 text-gray-200" />
                Aucun produit consulté
              </div>
            )}
          </>
        )}

        {hasQuery && (
          <div className="p-3">
            <div className="mb-2 text-[11px] font-bold uppercase text-gray-400">
              Suggestions
            </div>
            {suggestionsLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
              </div>
            ) : suggestions.length > 0 ? (
              <div className="space-y-0.5">
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-[13px] text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-500"
                  >
                    <Search size={14} className="shrink-0 text-gray-300" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-3 text-center text-[13px] text-gray-400">
                Aucune suggestion
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
