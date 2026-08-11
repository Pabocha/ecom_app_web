import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '@/features/cart/hooks/useCart';
import { categories } from '@/data/data.js';
import { useProductsByCategorySlug } from '@/features/product/hooks/useProduct';
import { Car, Dumbbell, Factory, HeartPulse, House, Microchip, Shirt, ShoppingBasket, Loader2 } from 'lucide-react';
import TopBar from '@/components/shared/TopBar';
import CategoryProductCard from '@/features/product/components/CategoryProductCard';
import { filterAndSortProducts } from '@/utils/helpers';

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

export default function CategoryProductsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [activeSubcat, setActiveSubcat] = useState('Tous');
  const [sort, setSort] = useState('popular');

  const currentCategory = categories.find(c => c.slug === slug) || categories[0];
  const { data: apiProducts, isLoading } = useProductsByCategorySlug(slug);

  const handleClose = () => navigate('/');
  const handleOpenCategory = (category) => navigate(`/category/${category.slug}`);
  const handleOpenProduct = (product) => navigate(`/product/${product.id}`);

  const CurrentCategoryIcon = catIcons[currentCategory.icon] || Microchip;

  const products = apiProducts?.data
    ? filterAndSortProducts(apiProducts.data, { activeSubcat, sort })
    : [];

  const handleSubcatClick = (subcat) => {
    setActiveSubcat(subcat);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-14">
      <TopBar backLabel="Accueil" />

      <div className="max-w-[1300px] mx-auto px-4 pt-5 grid grid-cols-[240px_1fr] gap-4">
        <aside className="space-y-3">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-[12px] font-black text-[#0d1b2a] mb-2 uppercase">Rayons</div>
            {['Tous', ...currentCategory.subcats].map(subcat => (
              <button key={subcat} onClick={() => handleSubcatClick(subcat)} className={`w-full text-left px-3 py-2 rounded text-[13px] font-semibold transition-colors ${activeSubcat === subcat ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-500'}`}>
                {subcat}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-[12px] font-black text-[#0d1b2a] mb-2 uppercase">Autres catégories</div>
            <div className="grid gap-1">
              {categories.filter(c => c.slug !== slug).slice(0, 5).map(c => {
                const SideIcon = catIcons[c.icon] || Microchip;
                return (
                  <button key={c.slug} onClick={() => handleOpenCategory(c)} className="flex items-center gap-2 px-2 py-2 rounded text-[12px] font-bold text-gray-500 hover:bg-gray-50 hover:text-orange-500">
                    <SideIcon size={14} style={{ color: c.color }} /> {c.name}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <main>
          <div className="mb-4 overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="relative h-48">
              <img src={currentCategory.img} alt={currentCategory.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b2a]/90 via-[#0d1b2a]/50 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center px-7">
                <span className="mb-2 w-fit rounded bg-white/15 px-3 py-1 text-[11px] font-black uppercase text-white">{products.length} produits affichés</span>
                <h2 className="font-['Barlow_Condensed'] text-[42px] font-black text-white">{currentCategory.desc}</h2>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="text-[13px] text-gray-500">Résultats pour <strong className="text-[#0d1b2a]">{activeSubcat}</strong></div>
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
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-500 font-semibold">Aucun produit trouvé</div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {products.map(product => (
                <CategoryProductCard key={product.id} product={product} onProductClick={handleOpenProduct} onAddToCart={addToCart} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
