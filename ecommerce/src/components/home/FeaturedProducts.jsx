import { featuredProducts } from '../../data/data.js';
import ProductCard from '../product/ProductCard.jsx';
import SectionHeader from './SectionHeader.jsx';

export default function FeaturedProducts({ onAddToCart, onOpenProduct }) {
  return (
    <div>
      <SectionHeader title="Produits Populaires" />
      <div className="grid grid-cols-5 gap-2.5">
        {featuredProducts.map(p => (
          <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onOpenProduct={onOpenProduct} />
        ))}
      </div>
    </div>
  );
}
