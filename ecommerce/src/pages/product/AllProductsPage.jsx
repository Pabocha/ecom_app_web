import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartActions } from '@/features/cart/hooks/useCart';
import { featuredProducts, categoryProducts, allFlashDeals } from '@/data/data.js';
import ProductCard from '@/features/product/components/ProductCard.jsx';
import { Grid3X3, LayoutList, SlidersHorizontal } from 'lucide-react';

const normalizeCatProduct = p => ({
  ...p,
  badges: p.badges || (p.badge ? [p.badge.toLowerCase()] : p.isNew ? ['new'] : []),
  discount: p.discount || (p.oldPrice ? `-${Math.round((1 - p.price / p.oldPrice) * 100)}%` : null),
  cartKey: 'cat',
});

const allProducts = [
  ...featuredProducts.map(p => ({ ...p, cartKey: 'featured' })),
  ...allFlashDeals.map(d => ({
    ...d,
    supplier: d.supplier || 'TradeHub Flash',
    rating: d.rating || 4.5,
    reviews: d.reviews || 100,
    verified: true,
    badges: ['sale'],
    oldPrice: d.oldPrice || Math.round(d.price * 1.4),
    cartKey: 'flash',
  })),
  ...Object.values(categoryProducts).flat().map(normalizeCatProduct),
];

const categories = ['Tous', ...new Set(Object.keys(categoryProducts))];

export default function AllProductsPage() {
  const navigate = useNavigate();
  const { addToCart } = useCartActions();
  const [activeCat, setActiveCat] = useState('Tous');
  const [sort, setSort] = useState('popular');
  const [view, setView] = useState('grid');

  const filtered = useMemo(() => {
    let items = activeCat === 'Tous'
      ? allProducts
      : allProducts.filter(p => p.category === activeCat || p.subcat || true);

    if (activeCat !== 'Tous') {
      const catProducts = categoryProducts[activeCat] || [];
      const catNames = catProducts.map(cp => cp.name);
      items = items.filter(p => catNames.includes(p.name));
    }

    items = [...new Map(items.map(p => [p.id, p])).values()];

    if (sort === 'priceAsc') items.sort((a, b) => a.price - b.price);
    else if (sort === 'priceDesc') items.sort((a, b) => b.price - a.price);
    else if (sort === 'new') items.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    else items.sort((a, b) => b.reviews - a.reviews);

    return items;
  }, [activeCat, sort]);

  return (
    <div className="min-h-screen bg-gray-100 pb-14">
      <div className="max-w-[1300px] mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="font-['Barlow_Condensed'] text-[32px] font-black text-[#0d1b2a]">
            Tous les produits
          </h1>
          <p className="text-[14px] text-gray-500 mt-1">
            {filtered.length} produit{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors ${activeCat === cat
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-gray-400" />
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="rounded border border-gray-200 bg-white px-3 py-2 text-[13px] font-bold text-[#0d1b2a] outline-none"
              >
                <option value="popular">Popularité</option>
                <option value="new">Nouveautés</option>
                <option value="priceAsc">Prix croissant</option>
                <option value="priceDesc">Prix décroissant</option>
              </select>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setView('grid')}
                className={`p-1.5 rounded ${view === 'grid' ? 'bg-white shadow-sm text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-1.5 rounded ${view === 'list' ? 'bg-white shadow-sm text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <LayoutList size={16} />
              </button>
            </div>
          </div>
        </div>

        {view === 'grid' ? (
          <div className="grid grid-cols-5 gap-2.5">
            {filtered.map(p => (
              <ProductCard
                key={`${p.id}-${p.cartKey || 'default'}`}
                product={p}
                onAddToCart={() => addToCart(p)}
                onOpenProduct={() => navigate(`/product/${p.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map(p => (
              <div
                key={`${p.id}-${p.cartKey || 'default'}`}
                onClick={() => navigate(`/product/${p.id}`)}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex"
              >
                <div className="w-32 h-32 shrink-0 bg-gray-50">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-center">
                  <h3 className="font-bold text-[15px] text-[#0d1b2a] mb-1">{p.name}</h3>
                  <div className="text-[13px] text-gray-500 mb-2">{p.supplier}</div>
                  <div className="flex items-center gap-1.5 text-[12px] text-gray-400 mb-2">
                    <span className="text-yellow-400">{'★'.repeat(Math.floor(p.rating))}</span>
                    <span>({p.reviews?.toLocaleString()})</span>
                    {p.verified && <span className="text-green-600 font-bold ml-1">✓ Vérifié</span>}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-['Barlow_Condensed'] text-[22px] font-black text-orange-500">
                      {new Intl.NumberFormat('fr-FR').format(p.price)} FCFA
                    </span>
                    {p.oldPrice && (
                      <span className="text-[13px] text-gray-400 line-through">
                        {new Intl.NumberFormat('fr-FR').format(p.oldPrice)} FCFA
                      </span>
                    )}
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); addToCart(p); }}
                    className="mt-2 w-fit rounded bg-orange-500 hover:bg-orange-600 px-4 py-1.5 text-[12px] font-bold text-white transition-colors"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Aucun produit trouvé</h2>
            <p className="text-gray-500 mb-4">Essayez de sélectionner une autre catégorie.</p>
            <button onClick={() => setActiveCat('Tous')} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors">
              Voir tous les produits
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
