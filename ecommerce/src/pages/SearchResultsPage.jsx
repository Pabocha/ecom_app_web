import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { featuredProducts, categoryProducts } from '../data/data.js';
import Icon from '../components/shared/Icon.jsx';
import ProductCard from '../components/product/ProductCard.jsx';

export default function SearchResultsPage({ onAddToCart, onOpenProduct }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const searchType = searchParams.get('type') || 'Produits';

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const allProducts = [...featuredProducts, ...Object.values(categoryProducts).flat()];
    const lowerQuery = query.toLowerCase();

    if (searchType === 'Produits') {
      return allProducts.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery) ||
        p.category?.toLowerCase().includes(lowerQuery)
      );
    }

    return [];
  }, [query, searchType]);

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-orange-500 hover:text-orange-600 font-semibold"
          >
            <Icon name="arrowLeft" size={18} />
            Retour
          </button>
        </div>
        <h1 className="text-3xl font-black text-gray-800 mb-2">
          Résultats de recherche
        </h1>
        <p className="text-gray-600 mb-4">
          Recherche: <span className="font-bold text-gray-800">"{query}"</span>
          <span className="ml-2 text-sm">({results.length} résultat{results.length !== 1 ? 's' : ''})</span>
        </p>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {['Pertinence', 'Prix: ↑', 'Prix: ↓', 'Nouveau'].map(filter => (
            <button
              key={filter}
              className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:text-orange-500 transition-colors text-sm font-semibold text-gray-700"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {results.map(p => (
            <ProductCard
              key={`${p.id}-${p.cartKey || 'default'}`}
              product={p}
              onAddToCart={() => onAddToCart(p)}
              onOpenProduct={() => onOpenProduct(p)}
              showDiscount={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
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
      )}
    </div>
  );
}
