import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '@/features/cart/hooks/useCart';
import { useProductsByCategorySlug } from '@/features/product/hooks/useProduct';
import { useCategoryHierarchy, findCategoryBySlug } from '@/features/categories/hooks/useCategories';
import { normalizeApiProduct } from '@/features/product/utils/normalize';
import { useFavoriteCards } from '@/features/favorites/hooks/useFavorites';
import { Loader2 } from 'lucide-react';
import TopBar from '@/components/shared/TopBar';
import CategoryProductCard from '@/features/product/components/CategoryProductCard';

export default function CategoryProductsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isFavorited, toggleFavorite } = useFavoriteCards();
  const [sort, setSort] = useState('popular');

  const { data: hierarchy = [] } = useCategoryHierarchy();
  const { data: apiProducts, isLoading } = useProductsByCategorySlug(slug);

  const currentCategory = findCategoryBySlug(hierarchy, slug);

  const categoryChildren = useMemo(() => {
    if (!hierarchy || !currentCategory) return [];
    if ((currentCategory.children || []).length > 0) return currentCategory.children;
    const parent = hierarchy.find(p => (p.children || []).some(c => c.slug === currentCategory.slug));
    return parent ? parent.children : [];
  }, [hierarchy, currentCategory]);

  const products = useMemo(() => (apiProducts?.data || []).map(normalizeApiProduct), [apiProducts?.data]);

  const sortedProducts = useMemo(() => {
    if (!products.length) return [];
    const sorted = [...products];
    if (sort === 'priceAsc') sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sort === 'priceDesc') sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (sort === 'new') sorted.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
    else sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return sorted;
  }, [products, sort]);

  const handleClose = () => navigate('/');
  const handleOpenProduct = (product) => navigate(`/product/${product.id}`);

  const title = currentCategory?.name || slug;

  return (
    <div className="min-h-screen bg-gray-100 pb-14">
      <TopBar backLabel="Accueil" />

      <div className={`max-w-[1300px] mx-auto px-4 pt-5 grid gap-4 ${categoryChildren.length > 0 ? 'grid-cols-[240px_1fr]' : 'grid-cols-1'}`}>
        {categoryChildren.length > 0 && (
          <aside className="space-y-3">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-[12px] font-black text-[#0d1b2a] mb-2 uppercase">Rayons</div>
              {categoryChildren.map(child => (
                <button
                  key={child.id}
                  onClick={() => navigate(`/category/${child.slug}`)}
                  className={`w-full text-left px-3 py-2 rounded text-[13px] font-semibold transition-colors ${child.slug === slug ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-500'}`}
                >
                  {child.name}
                </button>
              ))}
            </div>
          </aside>
        )}

        <main>
          <div className="mb-4 overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="relative h-48">
              {currentCategory?.image ? (
                <img src={currentCategory.image} alt={title} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gradient-to-r from-[#0d1b2a] to-[#1b3a5c]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b2a]/90 via-[#0d1b2a]/50 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center px-7">
                <span className="mb-2 w-fit rounded bg-white/15 px-3 py-1 text-[11px] font-black uppercase text-white">{sortedProducts.length} produits affichés</span>
                <h2 className="font-['Barlow_Condensed'] text-[42px] font-black text-white">{title}</h2>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="text-[13px] text-gray-500">Résultats pour <strong className="text-[#0d1b2a]">{title}</strong></div>
              <select value={sort} onChange={e => setSort(e.target.value)} className="rounded border border-gray-200 bg-white px-3 py-2 text-[13px] font-bold text-[#0d1b2a] outline-none">
                <option value="popular">Popularité</option>
                <option value="new">Nouveautés</option>
                <option value="priceAsc">Prix croissant</option>
                <option value="priceDesc">Prix décroissant</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-orange-500" size={32} />
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-500 font-semibold">Aucun produit trouvé</div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {sortedProducts.map(product => (
                <CategoryProductCard key={product.id} product={product} onProductClick={handleOpenProduct} onAddToCart={addToCart} favorited={isFavorited(product.id)} onToggleFavorite={toggleFavorite} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
