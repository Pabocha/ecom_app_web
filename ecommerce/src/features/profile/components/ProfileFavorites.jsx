import { useNavigate } from 'react-router-dom';
import { useCart } from '@/features/cart/hooks/useCart';
import { useFavorites, useToggleFavorite } from '@/features/favorites/hooks/useFavorites';
import ProductCard from '@/features/product/components/ProductCard.jsx';
import { Heart, Loader2 } from 'lucide-react';

export default function ProfileFavorites() {
  const navigate = useNavigate();
  const { addToCart, addingId } = useCart();
  const { data: favorites = [], isLoading } = useFavorites();
  const { mutate: toggleFavorite } = useToggleFavorite();

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex items-center gap-3 mb-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-500">
          <Heart size={18} />
        </span>
        <div>
          <h2 className="text-[16px] font-black text-[#0d1b2a]">Mes favoris</h2>
          <p className="text-[12px] text-gray-400">
            {favorites.length} produit{favorites.length > 1 ? 's' : ''} sauvegardé{favorites.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-orange-500" size={28} />
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-5xl mb-4">💙</div>
          <h3 className="text-[16px] font-black text-[#0d1b2a] mb-2">Aucun favori pour le moment</h3>
          <p className="text-[12px] text-gray-500 mb-5">
            Cliquez sur le cœur d'un produit pour le garder sous la main.
          </p>
          <button
            onClick={() => navigate('/')}
            className="rounded bg-orange-500 px-6 py-2.5 text-[13px] font-black text-white hover:bg-orange-600 transition-colors"
          >
            Découvrir les produits
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5">
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
  );
}
