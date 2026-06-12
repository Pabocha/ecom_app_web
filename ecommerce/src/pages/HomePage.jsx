import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import B2BSection from '@/components/home/B2BSection.jsx';
import BottomGrid from '@/components/home/BottomGrid.jsx';
import CategorySidebar from '@/components/home/CategorySidebar.jsx';
import CategoryStrip from '@/components/home/CategoryStrip.jsx';
import FeaturedProducts from '@/components/home/FeaturedProducts.jsx';
import FlashDeals from '@/components/home/FlashDeals.jsx';
import HeroBanners from '@/components/home/HeroBanners.jsx';
import HeroSlider from '@/components/home/HeroSlider.jsx';
import MidBanner from '@/components/home/MidBanner.jsx';
import PromoStrip from '@/components/home/PromoStrip.jsx';
import TrustStrip from '@/components/home/TrustStrip.jsx';

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
