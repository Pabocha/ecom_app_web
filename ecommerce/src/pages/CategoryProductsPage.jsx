import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { categories, categoryProducts, featuredProducts, formatPrice } from '@/data/data.js';
import Icon from '@/components/shared/Icon.jsx';

const normalizeProduct = product => ({
  ...product,
  badges: product.badges || (product.badge ? ['sale'] : []),
  discount: product.discount || (product.oldPrice ? `-${Math.round((1 - product.price / product.oldPrice) * 100)}%` : null),
});

function fallbackProducts(category) {
  return featuredProducts.map((product, index) => ({
    ...product,
    id: Number(`${category.name.length}${product.id}${index}`),
    subcat: category.subcats[index % category.subcats.length],
  }));
}

export default function CategoryProductsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [activeSubcat, setActiveSubcat] = useState('Tous');
  const [sort, setSort] = useState('popular');
  const currentCategory = categories.find(c => c.name === id) || categories[0];

  const handleClose = () => navigate('/');
  const handleOpenCategory = (category) => navigate(`/category/${category?.name || category}`);
  const handleOpenProduct = (product) => navigate(`/product/${product.id}`);

  const products = useMemo(() => {
    const base = categoryProducts[currentCategory.name] || fallbackProducts(currentCategory);
    return base
      .filter(product => activeSubcat === 'Tous' || product.subcat === activeSubcat)
      .map(normalizeProduct)
      .sort((a, b) => {
        if (sort === 'priceAsc') return a.price - b.price;
        if (sort === 'priceDesc') return b.price - a.price;
        if (sort === 'new') return Number(Boolean(b.isNew)) - Number(Boolean(a.isNew));
        return b.reviews - a.reviews;
      });
  }, [activeSubcat, currentCategory, sort]);

  return (
    <div className="min-h-screen bg-gray-100 pb-14">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1300px] mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded flex items-center justify-center" style={{ background: currentCategory.bg, color: currentCategory.color }}>
              <Icon name={currentCategory.icon} size={24} />
            </div>
            <div>
              <div className="text-[12px] text-gray-400 font-bold uppercase">Catégorie</div>
              <h1 className="font-['Barlow_Condensed'] text-[34px] font-black text-[#0d1b2a] leading-none">{currentCategory.name}</h1>
            </div>
          </div>
          <button onClick={handleClose} className="bg-[#0d1b2a] hover:bg-orange-500 text-white px-3.5 py-2 rounded text-[13px] font-bold flex items-center gap-2">
            <Icon name="arrowLeft" /> Accueil
          </button>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-4 pt-5 grid grid-cols-[240px_1fr] gap-4">
        <aside className="space-y-3">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-[12px] font-black text-[#0d1b2a] mb-2 uppercase">Rayons</div>
            {['Tous', ...currentCategory.subcats].map(subcat => (
              <button key={subcat} onClick={() => setActiveSubcat(subcat)} className={`w-full text-left px-3 py-2 rounded text-[13px] font-semibold transition-colors ${activeSubcat === subcat ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-500'}`}>
                {subcat}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-[12px] font-black text-[#0d1b2a] mb-2 uppercase">Autres catégories</div>
            <div className="grid gap-1">
              {categories.filter(c => c.name !== currentCategory.name).slice(0, 5).map(c => (
                <button key={c.name} onClick={() => handleOpenCategory(c)} className="flex items-center gap-2 px-2 py-2 rounded text-[12px] font-bold text-gray-500 hover:bg-gray-50 hover:text-orange-500">
                  <Icon name={c.icon} size={14} style={{ color: c.color }} /> {c.name}
                </button>
              ))}
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

          <div className="grid grid-cols-3 gap-4">
            {products.map(product => (
              <article key={product.id} onClick={() => handleOpenProduct(product)} className="group cursor-pointer rounded-lg bg-white p-3 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="relative overflow-hidden rounded bg-gray-50" style={{ aspectRatio: '4 / 3' }}>
                  <img src={product.img} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  {product.discount && <span className="absolute left-2 top-2 rounded bg-orange-500 px-2 py-0.5 text-[11px] font-black text-white">{product.discount}</span>}
                  {product.isNew && <span className="absolute right-2 top-2 rounded bg-green-600 px-2 py-0.5 text-[11px] font-black text-white">Nouveau</span>}
                </div>
                <div className="pt-3">
                  <div className="mb-1 text-[11px] font-bold text-orange-500">{product.subcat}</div>
                  <h3 className="min-h-[40px] text-[14px] font-black leading-tight text-[#0d1b2a]">{product.name}</h3>
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-gray-400">
                    <span className="text-yellow-400">{'★'.repeat(Math.floor(product.rating))}</span>
                    <span>({product.reviews.toLocaleString()})</span>
                    {product.verified && <span className="ml-auto flex items-center gap-1 font-bold text-green-600"><Icon name="circleCheck" size={12} /> Vérifié</span>}
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-2">
                    <div>
                      <div className="font-['Barlow_Condensed'] text-[24px] font-black text-orange-500">{formatPrice(product.price)}</div>
                      {product.oldPrice && <div className="text-[12px] text-gray-400 line-through">{formatPrice(product.oldPrice)}</div>}
                    </div>
                    <button onClick={e => { e.stopPropagation(); addToCart(product); }} className="rounded bg-orange-500 px-3 py-2 text-[12px] font-black text-white hover:bg-[#0d1b2a]">
                      Ajouter
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
