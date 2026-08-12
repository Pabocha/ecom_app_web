import { useNavigate } from 'react-router-dom';
import { useCart } from '@/features/cart/hooks/useCart';
import { useFavorites, useToggleFavorite } from '@/features/favorites/hooks/useFavorites';
import ProductCard from '@/features/product/components/ProductCard.jsx';
import TopBar from '@/components/shared/TopBar';
import { Heart, Loader2 } from 'lucide-react';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { addToCart, addingId } = useCart();
  const { data: favorites = [], isLoading } = useFavorites();
  const { mutate: toggleFavorite } = useToggleFavorite();

  return (
    <div className="min-h-screen bg-gray-100 pb-14">
      <TopBar backTo="/" />

      <div className="max-w-[1300px] mx-auto px-4 pt-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-100 text-orange-500">
            <Heart size={20} />
          </span>
          <div>
            <h1 className="font-['Barlow_Condensed'] text-[28px] font-black text-[#0d1b2a] leading-none">Mes favoris</h1>
            <p className="text-[12px] text-gray-400 mt-1">
              {favorites.length} produit{favorites.length > 1 ? 's' : ''} sauvegardé{favorites.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-orange-500" size={32} />
          </div>
        ) : favorites.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">💙</div>
            <h2 className="text-[18px] font-black text-[#0d1b2a] mb-2">Aucun favori pour le moment</h2>
            <p className="text-[13px] text-gray-500 mb-6">Cliquez sur le cœur d'un produit pour le garder sous la main.</p>
            <button
              onClick={() => navigate('/')}
              className="rounded bg-orange-500 px-6 py-3 text-[13px] font-black text-white hover:bg-orange-600 transition-colors"
            >
              Découvrir les produits
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-2.5">
            {favorites.map(({ id, product }) => (
              <ProductCard
                key={id}
                product={product}
                onAddToCart={addToCart}
                onOpenProduct={(p) => navigate(`/product/${p.id}`)}
                addingId={addingId}
                favorited
                onToggleFavorite={() => toggleFavorite(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
