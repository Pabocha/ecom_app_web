import { useNavigate } from "react-router-dom";
import { useCartActions } from "@/features/cart/hooks/useCart";
import {
  useProducts,
  useRecommendations,
} from "@/features/product/hooks/useProduct";
import B2BSection from "@/features/home/components/B2BSection.jsx";
import BottomGrid from "@/features/home/components/BottomGrid.jsx";
import CategorySidebar from "@/features/catalog/components/CategorySidebar.jsx";
import CategoryStrip from "@/features/catalog/components/CategoryStrip.jsx";
import FlashDeals from "@/features/home/components/FlashDeals.jsx";
import HeroBanners from "@/features/home/components/HeroBanners.jsx";
import HeroSlider from "@/features/home/components/HeroSlider.jsx";
import MidBanner from "@/features/home/components/MidBanner.jsx";
import PromoStrip from "@/features/home/components/PromoStrip.jsx";
import ProductSection from "@/features/product/components/ProductSection.jsx";
import ProductRecommended from "@/features/product/components/ProductRecommended.jsx";
import TrustStrip from "@/features/home/components/TrustStrip.jsx";

export default function HomePage() {
  const { addToCart } = useCartActions();
  const navigate = useNavigate();

  const { data: popularRes, isLoading: popularLoading } = useProducts({
    tab: "popular"
  });
  const { data: recentRes, isLoading: recentLoading } = useProducts({
    tab: "recent"
  });
  const { data: recomRes, isLoading: recomLoading } = useRecommendations(

  );

  const popularProducts = popularRes?.data?.results || popularRes?.data || [];
  const recentProducts = recentRes?.data?.results || recentRes?.data || [];
  const recommendedProducts = recomRes?.data?.items || recomRes?.data || [];

  const handleAddToCart = (product) => addToCart(product);
  const handleOpenProduct = (product) => navigate(`/product/${product.id}`);
  const handleOpenFlashDeals = () => navigate("/flash-deals");
  const handleOpenCategory = (category) =>
    navigate(`/category/${category?.name || category}`);

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
      <FlashDeals
        onOpenAllDeals={handleOpenFlashDeals}
        onOpenProduct={handleOpenProduct}
      />
      <ProductSection
        title="Produits Populaires"
        products={popularProducts}
        loading={popularLoading}
        sectionBadge="hot"
        onAddToCart={handleAddToCart}
        onOpenProduct={handleOpenProduct}
      />
      <ProductSection
        title="Nouveaux Produits"
        products={recentProducts}
        loading={recentLoading}
        sectionBadge="new"
        onAddToCart={handleAddToCart}
        onOpenProduct={handleOpenProduct}
      />
      <ProductRecommended
        products={recommendedProducts}
        loading={recomLoading}
        onAddToCart={handleAddToCart}
        onOpenProduct={handleOpenProduct}
      />
      <B2BSection />
      <TrustStrip />
      <BottomGrid />
    </div>
  );
}
