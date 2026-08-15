import { useNavigate } from 'react-router-dom';
import { useFollowedShops, useToggleFollow } from '@/features/shop/hooks/useShopFollow';
import { BadgeCheck, Building2, Loader2, UserRound, Users } from 'lucide-react';

export default function ProfileFollowedShops() {
  const navigate = useNavigate();
  const { data: follows = [], isLoading } = useFollowedShops();
  const { mutate: toggleFollow, isPending } = useToggleFollow();

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex items-center gap-3 mb-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-500">
          <Building2 size={18} />
        </span>
        <div>
          <h2 className="text-[16px] font-black text-[#0d1b2a]">Vendeurs suivis</h2>
          <p className="text-[12px] text-gray-400">
            {follows.length} vendeur{follows.length > 1 ? 's' : ''} suivi{follows.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-orange-500" size={28} />
        </div>
      ) : follows.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-5xl mb-4">🏬</div>
          <h3 className="text-[16px] font-black text-[#0d1b2a] mb-2">Vous ne suivez aucun vendeur</h3>
          <p className="text-[12px] text-gray-500 mb-5">
            Suivez vos boutiques préférées pour retrouver leurs nouveautés.
          </p>
          <button
            onClick={() => navigate('/')}
            className="rounded bg-orange-500 px-6 py-2.5 text-[13px] font-black text-white hover:bg-orange-600 transition-colors"
          >
            Explorer les boutiques
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {follows.map(({ id, shop_detail: shop }) => (
            <div key={id} className="rounded-lg border border-gray-100 p-4">
              <div className="flex items-start gap-4">
                <img
                  src={shop.logo || 'https://via.placeholder.com/100'}
                  alt={shop.name}
                  className="h-14 w-14 shrink-0 rounded-xl border border-gray-200 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-[15px] font-black text-[#0d1b2a]">{shop.name}</h3>
                    {shop.status === 'verified' && (
                      <span className="flex items-center gap-0.5 text-green-600 text-[11px] font-bold">
                        <BadgeCheck size={13} /> Vérifié
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users size={12} /> {shop.total_follow?.toLocaleString()} abonnés
                    </span>
                    <span className="flex items-center gap-1">
                      <UserRound size={12} /> {shop.products?.length || 0} produits
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => navigate(`/shop/${shop.id}`)}
                    className="rounded bg-orange-500 px-3.5 py-2 text-[12px] font-black text-white hover:bg-orange-600 transition-colors"
                  >
                    Visiter
                  </button>
                  <button
                    onClick={() => toggleFollow(shop.id)}
                    disabled={isPending}
                    className="rounded border border-gray-200 px-3.5 py-2 text-[12px] font-bold text-gray-600 hover:border-red-300 hover:text-red-500 transition-colors"
                  >
                    Désabonner
                  </button>
                </div>
              </div>

              {shop.products?.length > 0 && (
                <div className="mt-4 flex gap-2 overflow-hidden">
                  {shop.products.slice(0, 5).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => navigate(`/product/${p.id}`)}
                      className="group h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-50"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
