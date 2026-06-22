import ProductCard from '@/features/product/components/ProductCard.jsx';
import SectionHeader from '@/features/home/components/SectionHeader.jsx';

export default function ProductSection({ title, products, loading, link, to, sectionBadge, onAddToCart, onOpenProduct }) {
  const displayProducts = (products || []).slice(0, 10);

  if (loading) {
    return (
      <div>
        <SectionHeader title={title} link={link} to={to} />
        <div className="grid grid-cols-5 gap-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
              <div className="pt-[100%] bg-gray-200" />
              <div className="p-2.5 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (displayProducts.length === 0) return null;

  return (
    <div>
      <SectionHeader title={title} link={link} to={to} />
      <div className="grid grid-cols-5 gap-2.5">
        {displayProducts.map(p => (
          <ProductCard key={p.id} product={p} sectionBadge={sectionBadge} onAddToCart={onAddToCart} onOpenProduct={onOpenProduct} />
        ))}
      </div>
    </div>
  );
}
