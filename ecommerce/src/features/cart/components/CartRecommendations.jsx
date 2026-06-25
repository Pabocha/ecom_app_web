import CartRecommendationsCard from '@/features/product/components/CartRecommendationsCard';

export default function CartRecommendations({ products, onProductClick, onAddToCart }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {products.map(product => (
        <CartRecommendationsCard key={product.id} product={product} onProductClick={onProductClick} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
