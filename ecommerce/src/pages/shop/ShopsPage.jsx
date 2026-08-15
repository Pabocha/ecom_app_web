import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Bell, BellRing, MapPin, Package, Search, ShoppingCart, Star, Store } from 'lucide-react';
import { useCart } from '@/features/cart/hooks/useCart';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useFollowState, useToggleFollow } from '@/features/shop/hooks/useShopFollow';
import { useShops } from '@/features/shop/hooks/useShops';
import { useUIStore } from '@/stores/uiStore';
import { getProductPricing } from '@/utils/helpers';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const PRODUCTS_PER_SHOP = 4;

function ShopFollowButton({ shop }) {
  const { isAuthenticated } = useAuth();
  const { data: followState } = useFollowState(shop.id);
  const { mutate: toggleFollow, isPending: following } = useToggleFollow();
  const followed = followState?.followed ?? false;

  const handleClick = () => {
    if (!isAuthenticated) {
      useUIStore.getState().openLoginModal();
      return;
    }
    toggleFollow(shop.id);
  };

  return (
    <button
      onClick={handleClick}
      disabled={following}
      className={`shrink-0 flex items-center gap-1 rounded px-2.5 py-1.5 text-[11px] font-black transition-colors ${followed ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-orange-500 text-white hover:bg-orange-600'} disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {following ? <LoadingSpinner size={12} className="text-white" /> : followed ? <BellRing size={13} /> : <Bell size={13} />}
      {followed ? 'Suivi' : 'Suivre'}
    </button>
  );
}

function ShopCard({ shop, onOpenShop, onOpenProduct, onAddToCart, addingId }) {
  const products = shop.product || [];
  const rating = Number(shop.average_rating || 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0d1b2a] to-[#1a2e45] px-4 py-3.5 flex items-center gap-3">
        {shop.logo ? (
          <img src={shop.logo} alt={shop.name} className="w-14 h-14 rounded-lg object-cover bg-white/10 shrink-0" loading="lazy" />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-['Barlow_Condensed'] font-black text-[22px] shrink-0">
            {shop.name?.charAt(0)?.toUpperCase() || 'B'}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="text-[15px] font-black text-white truncate">{shop.name}</h2>
            {shop.is_verifted && <BadgeCheck size={15} className="text-green-400 shrink-0" />}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-white/60 mt-0.5 flex-wrap">
            {shop.country_origin && (
              <span className="flex items-center gap-1"><MapPin size={11} /> {shop.country_origin}</span>
            )}
            {shop.is_top_seller && (
              <span className="bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">Top Vendeur</span>
            )}
          </div>
        </div>
        <ShopFollowButton shop={shop} />
      </div>

      {shop.description && (
        <p className="px-4 pt-3 text-[12px] text-gray-500 line-clamp-2 leading-relaxed">{shop.description}</p>
      )}

      {/* Stats */}
      <div className="px-4 py-2.5 flex items-center gap-4 text-[11px] text-gray-500">
        <span><strong className="text-[#0d1b2a]">{shop.total_products || 0}</strong> produits</span>
        <span><strong className="text-[#0d1b2a]">{shop.total_follow || 0}</strong> abonnés</span>
        <span><strong className="text-[#0d1b2a]">{(shop.number_sale || 0).toLocaleString()}</strong> ventes</span>
        <span className="flex items-center gap-1">
          <Star size={11} className="text-yellow-400 fill-yellow-400" /> {rating ? rating.toFixed(1) : '-'}
        </span>
      </div>

      {/* Products */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-4 pb-2">
          {products.map((p) => {
            const pricing = getProductPricing(p);
            const isAdding = addingId === p.id;
            return (
              <div
                key={p.id}
                onClick={() => onOpenProduct(p)}
                className="flex items-center gap-2 border border-gray-100 rounded-lg p-1.5 cursor-pointer hover:border-orange-300 hover:bg-orange-50/40 transition-colors group"
              >
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover shrink-0" loading="lazy" />
                ) : (
                  <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-300 shrink-0">
                    <Package size={14} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold text-[#0d1b2a] truncate">{p.name}</div>
                  <div className="font-['Barlow_Condensed'] text-[13px] font-black text-orange-500">{pricing.mainPrice}</div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onAddToCart(p); }}
                  disabled={isAdding}
                  className="shrink-0 w-7 h-7 rounded bg-gray-100 hover:bg-orange-500 hover:text-white text-gray-500 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAdding ? <LoadingSpinner size={12} className="text-orange-500" /> : <ShoppingCart size={13} />}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="px-4 py-4 text-[12px] text-gray-400">Aucun produit disponible pour le moment.</div>
      )}

      {/* Footer */}
      <div className="mt-auto px-4 py-3 border-t border-gray-100">
        <button
          onClick={() => onOpenShop(shop)}
          className="text-[12px] font-black text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors"
        >
          Voir la boutique <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

function ShopsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-lg bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ShopsPage() {
  const navigate = useNavigate();
  const { addToCart, addingId } = useCart();
  const [search, setSearch] = useState('');

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useShops({ productsPerShop: PRODUCTS_PER_SHOP });
  const allShops = useMemo(() => data?.shops ?? [], [data]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allShops;
    return allShops.filter((s) => (s.name || '').toLowerCase().includes(q));
  }, [allShops, search]);

  const handleOpenShop = (shop) => navigate(`/shop/${shop.id}`);
  const handleOpenProduct = (product) => navigate(`/product/${product.id}`);

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-[#0d1b2a] to-[#1a2e45] text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-[15%] w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-[10%] w-60 h-60 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-[1300px] mx-auto px-4 py-8 relative">
          <div className="flex items-center gap-1.5 text-orange-400 text-[11px] font-black uppercase tracking-[1.5px] mb-1.5">
            <Store size={15} /> Boutiques
          </div>
          <h1 className="font-['Barlow_Condensed'] text-[34px] md:text-[40px] font-black leading-tight mb-1">
            Découvrez nos <span className="text-orange-500">Boutiques</span>
          </h1>
          <p className="text-[13px] text-gray-300 mb-4">Boutiques vérifiées et leurs meilleurs produits, en un seul endroit.</p>

          <div className="flex max-w-[480px] bg-white rounded-lg overflow-hidden shadow-lg shadow-black/20">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une boutique..."
              className="flex-1 px-4 py-2.5 text-[13px] outline-none text-gray-700"
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 transition-colors">
              <Search size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-4 py-6">
        {isLoading && allShops.length === 0 ? (
          <ShopsSkeleton />
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 text-center">
            <Store size={40} className="mx-auto text-gray-300 mb-3" />
            <div className="font-black text-[#0d1b2a] mb-1">Aucune boutique trouvée</div>
            <p className="text-[13px] text-gray-500">Aucune boutique ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((shop) => (
              <ShopCard
                key={shop.id}
                shop={shop}
                onOpenShop={handleOpenShop}
                onOpenProduct={handleOpenProduct}
                onAddToCart={addToCart}
                addingId={addingId}
              />
            ))}
          </div>
        )}

        {hasNextPage && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-lg text-[13px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isFetchingNextPage && <LoadingSpinner size={14} className="text-white" />}
              Voir plus de boutiques
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
