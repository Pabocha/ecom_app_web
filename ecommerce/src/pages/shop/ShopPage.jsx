import { useParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useProductDetailShop } from '@/features/product/hooks/useProduct';
import { useProducts } from '@/features/product/hooks/useProduct';
import { useCart } from '@/features/cart/hooks/useCart';
import ProductCard from '@/features/product/components/ProductCard.jsx';
import TopBar from '@/components/shared/TopBar';
import RatingStars from '@/components/shared/RatingStars';
import { useProductReviewsByShop } from '@/features/reviews/hooks/useProductReviews';
import { formatDate } from '@/utils/helpers';
import { BadgeCheck, Package, ShoppingBag, Users, Star, Mail, Phone, MapPin, Clock, Truck, RotateCcw, Bell, BellRing } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useFavoriteCards } from '@/features/favorites/hooks/useFavorites';
import { useFollowState, useToggleFollow } from '@/features/shop/hooks/useShopFollow';
import { useUIStore } from '@/stores/uiStore';

export default function ShopPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, addingId } = useCart();
  const { isAuthenticated } = useAuth();
  const { isFavorited, toggleFavorite } = useFavoriteCards();
  const { data: followState } = useFollowState(id);
  const { mutate: toggleFollow, isPending: following } = useToggleFollow();

  const { data: shopRes } = useProductDetailShop(id);
  const shop = shopRes?.data?.results || shopRes?.data || {};

  const { data: productsRes } = useProducts({ shop: id });
  const products = productsRes?.data?.results || productsRes?.data || [];

  const {
    data: reviewsByShop = { reviews: [], hasNextPage: false },
    fetchNextPage: fetchMoreProductReviews,
    hasNextPage: moreProductReviews,
    isFetchingNextPage: loadingMoreReviews,
    isLoading: loadingProductReviews,
  } = useProductReviewsByShop(id);

  const productReviews = useMemo(() => reviewsByShop.reviews || [], [reviewsByShop.reviews]);

  const reviewSummary = shop.review_summary || {};
  const shopReviews = shop.reviews || [];
  const ratingsBreakdown = reviewSummary.ratings_breakdown || {};

  const groupedProductReviews = useMemo(() => {
    const map = {};
    productReviews.forEach((review) => {
      const productDetail = review.product_detail || {};
      const key = productDetail.id ?? 'unknown';
      if (!map[key]) map[key] = { product: productDetail, items: [] };
      map[key].items.push(review);
    });
    return Object.values(map);
  }, [productReviews]);

  const followed = followState?.followed ?? false;
  const totalFollowers = followState?.total ?? shop.total_followers ?? 0;

  const handleToggleFollow = () => {
    if (!isAuthenticated) {
      useUIStore.getState().openLoginModal();
      return;
    }
    toggleFollow(id);
  };

  const stats = [
    { icon: Package, label: 'Produits', value: shop.total_products || 0 },
    { icon: ShoppingBag, label: 'Ventes', value: (shop.number_sale || 0).toLocaleString() },
    { icon: Users, label: 'Abonnés', value: totalFollowers.toLocaleString() },
    { icon: Clock, label: 'Membre depuis', value: shop.date_created ? new Date(shop.date_created).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }) : '-' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar onBack={() => navigate(-1)} />

      <div className="max-w-[1300px] mx-auto px-4 py-6 space-y-6">
        {/* Shop Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start gap-5">
            <img
              src={shop.logo || 'https://via.placeholder.com/100'}
              alt={shop.name}
              className="w-24 h-24 rounded-xl object-cover border border-gray-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-[22px] font-black text-[#0d1b2a] truncate">{shop.name}</h1>
                  {shop.is_verifted && (
                    <span className="text-green-600 flex items-center gap-0.5 text-[13px] font-bold"><BadgeCheck size={16} /> Vérifié</span>
                  )}
                  {shop.is_top_seller && (
                    <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-1.5 py-0.5 rounded uppercase">Top Vendeur</span>
                  )}
                </div>
                <button
                  onClick={handleToggleFollow}
                  disabled={following}
                  className={`flex shrink-0 items-center gap-1.5 rounded px-4 py-2 text-[12px] font-black transition-colors ${followed ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
                >
                  {followed ? <BellRing size={14} /> : <Bell size={14} />}
                  {followed ? 'Abonné' : 'Suivre'}
                </button>
              </div>
              {shop.description && (
                <p className="text-[13px] text-gray-600 leading-relaxed mb-3 line-clamp-2">{shop.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-[12px] text-gray-500">
                {shop.address && <span className="flex items-center gap-1"><MapPin size={13} /> {shop.address}</span>}
                {shop.email_contact && <span className="flex items-center gap-1"><Mail size={13} /> {shop.email_contact}</span>}
                {shop.phone_number && <span className="flex items-center gap-1"><Phone size={13} /> {shop.phone_number}</span>}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-5 pt-5 border-t border-gray-100">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <Icon size={18} className="mx-auto mb-1 text-orange-500" />
                <div className="font-black text-[#0d1b2a] text-[16px]">{value}</div>
                <div className="text-[11px] text-gray-400">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Shop Policies */}
        {(shop.delivery_conditions || shop.return_policy || shop.free_shipping || shop.delivery_time_estimate) && (
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h2 className="text-[15px] font-black text-[#0d1b2a] mb-3">Informations boutique</h2>
            <div className="grid grid-cols-2 gap-4 text-[13px]">
              {shop.delivery_conditions && (
                <div className="flex items-start gap-2"><Truck size={16} className="mt-0.5 shrink-0 text-orange-500" /><div><div className="font-bold text-[#0d1b2a]">Livraison</div><div className="text-gray-600">{shop.delivery_conditions}</div></div></div>
              )}
              {shop.return_policy && (
                <div className="flex items-start gap-2"><RotateCcw size={16} className="mt-0.5 shrink-0 text-orange-500" /><div><div className="font-bold text-[#0d1b2a]">Retours</div><div className="text-gray-600">{shop.return_policy}</div></div></div>
              )}
              {shop.free_shipping && (
                <div className="flex items-start gap-2"><Truck size={16} className="mt-0.5 shrink-0 text-green-500" /><div><div className="font-bold text-green-600">Livraison gratuite</div></div></div>
              )}
              {shop.delivery_time_estimate && (
                <div className="flex items-start gap-2"><Clock size={16} className="mt-0.5 shrink-0 text-orange-500" /><div><div className="font-bold text-[#0d1b2a]">Délai estimé</div><div className="text-gray-600">{shop.delivery_time_estimate}</div></div></div>
              )}
            </div>
          </div>
        )}

        {/* Categories */}
        {shop.categories_details?.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h2 className="text-[15px] font-black text-[#0d1b2a] mb-3">Catégories</h2>
            <div className="flex flex-wrap gap-2">
              {shop.categories_details.map(cat => (
                <span key={cat.id} className="bg-gray-100 text-[#0d1b2a] text-[12px] font-bold px-3 py-1.5 rounded-full">{cat.name}</span>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-[15px] font-black text-[#0d1b2a] mb-4">Produits de la boutique ({shop.total_products || 0})</h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-5 gap-2.5">
              {products.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={(prod) => addToCart(prod)}
                  onOpenProduct={(prod) => navigate(`/product/${prod.id}`)}
                  addingId={addingId}
                  favorited={isFavorited(p.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-gray-400 text-center py-8">Aucun produit pour le moment</p>
          )}
        </div>

        {/* Shop Reviews */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-[15px] font-black text-[#0d1b2a] mb-4">Avis sur la boutique</h2>
          <div className="grid grid-cols-1 lg:grid-cols-[230px_1fr] gap-6">
            <div>
              <div className="flex items-end gap-1 mb-1">
                <span className="font-['Barlow_Condensed'] text-[44px] font-black text-[#0d1b2a] leading-none">{(reviewSummary.average_rating || 0).toFixed(1)}</span>
                <span className="text-[13px] text-gray-400 mb-1">/ 5</span>
              </div>
              <RatingStars rating={reviewSummary.average_rating || 0} size={18} />
              <div className="text-[12px] text-gray-400 mt-2">{(reviewSummary.total_reviews || 0).toLocaleString()} avis</div>
              <div className="text-[12px] text-gray-400 mt-1">{totalFollowers.toLocaleString()} abonnés</div>

              <div className="mt-4 space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingsBreakdown[star] || 0;
                  const total = reviewSummary.total_reviews || 0;
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-[11px] text-gray-500">
                      <span className="w-2 shrink-0 text-right">{star}</span>
                      <Star size={11} className="text-yellow-400 fill-yellow-400 shrink-0" />
                      <div className="flex-1 h-1.5 bg-gray-100 rounded overflow-hidden">
                        <div className="h-full bg-orange-500 rounded" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-5 text-right shrink-0">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {shopReviews.length > 0 ? (
                shopReviews.map((r) => (
                  <div key={r.id} className="pb-4 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <RatingStars rating={r.rating} size={13} />
                      <span className="text-[13px] font-bold text-[#0d1b2a]">{r.user?.first_name} {r.user?.last_name}</span>
                      {r.is_edited && (
                        <span className="text-[10px] bg-gray-100 text-gray-500 font-black px-1.5 py-0.5 rounded">Modifié</span>
                      )}
                      <span className="ml-auto text-[11px] text-gray-400">{r.date_added ? formatDate(r.date_added) : ''}</span>
                    </div>
                    {r.comment && <p className="text-[13px] text-gray-600 leading-relaxed">{r.comment}</p>}
                  </div>
                ))
              ) : (
                <p className="text-[13px] text-gray-400 text-center py-8">Aucun avis sur cette boutique pour le moment</p>
              )}
            </div>
          </div>
        </div>

        {/* Product Reviews of the shop */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-[15px] font-black text-[#0d1b2a] mb-4">Avis des produits de la boutique</h2>
          {loadingProductReviews && productReviews.length === 0 ? (
            <p className="text-[13px] text-gray-400 text-center py-8">Chargement des avis...</p>
          ) : groupedProductReviews.length > 0 ? (
            <div className="space-y-5">
              {groupedProductReviews.map((group) => (
                <div key={group.product.id ?? 'unknown'}>
                  <button
                    onClick={() => group.product.id && navigate(`/product/${group.product.id}`)}
                    className="flex items-center gap-2 mb-2"
                  >
                    {group.product.image ? (
                      <img src={group.product.image} alt={group.product.name} className="w-9 h-9 rounded object-cover border border-gray-100" />
                    ) : (
                      <span className="w-9 h-9 rounded bg-gray-100 flex items-center justify-center"><Package size={16} className="text-gray-400" /></span>
                    )}
                    <span className="text-[13px] font-bold text-[#0d1b2a] hover:text-blue-600">{group.product.name || 'Produit'}</span>
                  </button>
                  <div className="space-y-3">
                    {group.items.map((r) => (
                      <div key={r.id} className="pb-3 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-2 mb-1">
                          <RatingStars rating={r.rating} size={13} />
                          <span className="text-[13px] font-bold text-[#0d1b2a]">{r.user?.first_name} {r.user?.last_name}</span>
                          {r.is_edited && (
                            <span className="text-[10px] bg-gray-100 text-gray-500 font-black px-1.5 py-0.5 rounded">Modifié</span>
                          )}
                          <span className="ml-auto text-[11px] text-gray-400">{r.date_added ? formatDate(r.date_added) : ''}</span>
                        </div>
                        {r.comment && <p className="text-[13px] text-gray-600 leading-relaxed">{r.comment}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {moreProductReviews && (
                <button
                  onClick={() => fetchMoreProductReviews()}
                  disabled={loadingMoreReviews}
                  className="w-full mt-2 rounded-lg border border-gray-200 py-2.5 text-[12px] font-black text-[#0d1b2a] hover:bg-gray-50 transition-colors"
                >
                  {loadingMoreReviews ? 'Chargement...' : 'Voir plus d\'avis'}
                </button>
              )}
            </div>
          ) : (
            <p className="text-[13px] text-gray-400 text-center py-8">Aucun avis sur les produits de cette boutique pour le moment</p>
          )}
        </div>
      </div>
    </div>
  );
}
