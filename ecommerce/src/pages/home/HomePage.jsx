import { useNavigate } from 'react-router-dom';
import { useCart } from '@/features/cart/hooks/useCart';
import B2BSection from '@/features/home/components/B2BSection.jsx';
import BottomGrid from '@/features/home/components/BottomGrid.jsx';
import CategorySidebar from '@/features/home/components/CategorySidebar.jsx';
import CategoryStrip from '@/features/home/components/CategoryStrip.jsx';
import FeaturedProducts from '@/features/home/components/FeaturedProducts.jsx';
import FlashDeals from '@/features/home/components/FlashDeals.jsx';
import HeroBanners from '@/features/home/components/HeroBanners.jsx';
import HeroSlider from '@/features/home/components/HeroSlider.jsx';
import MidBanner from '@/features/home/components/MidBanner.jsx';
import PromoStrip from '@/features/home/components/PromoStrip.jsx';
import TrustStrip from '@/features/home/components/TrustStrip.jsx';

export default function HomePage() {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product) => addToCart(product);
  const handleOpenProduct = (product) => navigate(`/product/${product.id}`);
  const handleOpenFlashDeals = () => navigate('/flash-deals');
  const handleOpenCategory = (category) => navigate(`/category/${category?.name || category}`);

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-3 space-y-3">
      <div className="grid grid-cols-[200px_1fr_210px] gap-2.5">
        <CategorySidebar onOpenCategory={handleOpenCategory} />
        <HeroSlider />
        <HeroBanners />
      </div>
      <PromoStrip />
      <MidBanner />
      <CategoryStrip onOpenCategory={handleOpenCategory} />
      <FlashDeals onOpenAllDeals={handleOpenFlashDeals} onOpenProduct={handleOpenProduct} />
      <FeaturedProducts onAddToCart={handleAddToCart} onOpenProduct={handleOpenProduct} />
      <B2BSection />
      <TrustStrip />
      <BottomGrid />
    </div>
  );
}
