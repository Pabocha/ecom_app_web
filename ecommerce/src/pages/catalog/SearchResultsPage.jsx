import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '@/features/cart/hooks/useCart';
import { useSearchProduct } from '@/features/product/hooks/useProduct';
import CategoryProductCard from '@/features/product/components/CategoryProductCard';
import { categories } from '@/data/data.js';
import { formatPrice } from '@/utils/helpers';
import TopBar from '@/components/shared/TopBar';
import { Microchip, Shirt, House, Car, HeartPulse, Factory, ShoppingBasket, Dumbbell } from 'lucide-react';

const catIcons = {
  microchip: Microchip,
  shirt: Shirt,
  house: House,
  car: Car,
  heartPulse: HeartPulse,
  industry: Factory,
  shoppingBasket: ShoppingBasket,
  dumbbell: Dumbbell,
};

function normalizeApiProduct(p) {
  const pricing = p.pricing_display || {};
  let price = p.base_price;
  let oldPrice = null;

  if (pricing.type === 'promo') {
    price = pricing.promo_price;
    oldPrice = pricing.should_strike_base ? pricing.base_price : null;
  } else if (pricing.type === 'base') {
    price = pricing.price ?? p.base_price;
  }

  return {
    id: p.id,
    name: p.name,
    img: p.image,
    description: p.description || '',
    price,
    oldPrice,
    discount: oldPrice ? `-${Math.round((1 - price / oldPrice) * 100)}%` : null,
    rating: p.average_rating || 0,
    reviews: p.numbers_reviews || 0,
    verified: p.shop_is_verified || false,
    isNew: false,
    subcat: '',
  };
}

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const query = searchParams.get('q') || '';
  const [sort, setSort] = useState('popular');

  const { data: searchRes, isPending: searchLoading, mutate: doSearch } = useSearchProduct();
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      doSearch(query);
      setHasSearched(true);
    } else {
      setHasSearched(false);
    }
  }, [query, doSearch]);

  const rawProducts = searchRes?.data || [];

  const products = useMemo(() => rawProducts.map(normalizeApiProduct), [rawProducts]);

  const sortedProducts = useMemo(() => {
    if (!products.length) return [];
    const sorted = [...products];
    if (sort === 'priceAsc') sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sort === 'priceDesc') sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    else sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return sorted;
  }, [products, sort]);

  return (
    <div className="min-h-screen bg-gray-100 pb-14">
      <TopBar backLabel="Accueil" />

      <div className="max-w-[1300px] mx-auto px-4 pt-5 grid grid-cols-[240px_1fr] gap-4">
        <aside className="space-y-3">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-[12px] font-black text-[#0d1b2a] mb-2 uppercase">Catégories</div>
            {categories.map(cat => {
              const CatIcon = catIcons[cat.icon] || Microchip;
              return (
                <button
                  key={cat.name}
                  onClick={() => navigate(`/category/${cat.slug}`)}
                  className="flex items-center gap-2 w-full text-left px-2 py-2 rounded text-[12px] font-bold text-gray-500 hover:bg-gray-50 hover:text-orange-500 transition-colors"
                >
                  <CatIcon size={14} style={{ color: cat.color }} /> {cat.name}
                </button>
              );
            })}
          </div>
        </aside>

        <main>
          <div className="mb-4 overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="relative h-48">
              <img
                src="https://images.unsplash.com/photo-1555421689-d68471e189f2?w=900&q=80"
                alt="Recherche"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b2a]/90 via-[#0d1b2a]/50 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center px-7">
                <span className="mb-2 w-fit rounded bg-white/15 px-3 py-1 text-[11px] font-black uppercase text-white">
                  {searchLoading ? 'Recherche en cours...' : `${sortedProducts.length} résultat${sortedProducts.length !== 1 ? 's' : ''}`}
                </span>
                <h2 className="font-['Barlow_Condensed'] text-[42px] font-black text-white">
                  Résultats pour "{query}"
                </h2>
              </div>
            </div>
            {hasSearched && !searchLoading && (
              <div className="flex items-center justify-between px-4 py-3">
                <div className="text-[13px] text-gray-500">
                  {sortedProducts.length > 0
                    ? <><strong className="text-[#0d1b2a]">{sortedProducts.length}</strong> produits trouvés</>
                    : 'Aucun résultat trouvé'}
                </div>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="rounded border border-gray-200 bg-white px-3 py-2 text-[13px] font-bold text-[#0d1b2a] outline-none"
                >
                  <option value="popular">Popularité</option>
                  <option value="priceAsc">Prix croissant</option>
                  <option value="priceDesc">Prix décroissant</option>
                </select>
              </div>
            )}
          </div>

          {searchLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {sortedProducts.map(p => (
                <CategoryProductCard
                  key={p.id}
                  product={p}
                  onProductClick={() => navigate(`/product/${p.id}`)}
                  onAddToCart={() => addToCart(p)}
                />
              ))}
            </div>
          ) : hasSearched ? (
            <div className="bg-white rounded-lg p-10 text-center shadow-sm">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Aucun résultat trouvé</h2>
              <p className="text-gray-600 mb-6">
                Essayez une autre recherche ou explorez nos catégories.
              </p>
              <button
                onClick={() => navigate('/categories')}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors"
              >
                Voir les catégories
              </button>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
