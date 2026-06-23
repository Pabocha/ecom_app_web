import { Outlet, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useCart } from '@/features/cart/hooks/useCart';
import { useAuth } from '@/features/auth/hooks/useAuth';
import AnnouncementBar from '@/layouts/AnnouncementBar';
import TopNav from '@/layouts/TopNav';
import SubNav from '@/layouts/SubNav';
import Footer from '@/layouts/Footer';
import CartSidebar from '@/features/cart/components/CartSidebar';
import VariantModal from '@/components/VariantModal';
import { useVariantStore } from '@/stores/variantStore';

export function BasicLayout() {
  const navigate = useNavigate();
  const { cartCount, cartOpen, setCartOpen, cartItems, changeQty, removeItem } = useCart();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="font-['Nunito_Sans'] bg-gray-100 min-h-screen">
      <AnnouncementBar />
      <TopNav
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        user={user}
        onLogout={handleLogout}
      />
      <SubNav onOpenCategories={() => navigate('/categories')} />

      <main>
        <Outlet />
      </main>

      <Footer />

      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onQty={changeQty}
        onRemove={removeItem}
        onOpenCartPage={() => {
          setCartOpen(false);
          navigate('/cart');
        }}
      />

      {/* Global variant modal (opened when product.has_variant) */}
      {
        (() => {
          const variantProduct = useVariantStore(state => state.product);
          const variantsMap = useVariantStore(state => state.variantsMap);
          const selection = useVariantStore(state => state.selection);

          const productForModal = useMemo(() => {
            if (!variantProduct) return null;
            return {
              ...variantProduct,
              variants: variantsMap || {},
              img: variantProduct.img || variantProduct.image || variantProduct.image_url,
              price: variantProduct.price ?? variantProduct.base_price,
            };
          }, [variantProduct, variantsMap]);

          return (
            <VariantModal
              product={productForModal}
              selection={selection}
              onSelectionChange={(name, value) => useVariantStore.getState().setSelection(name, value)}
              onConfirm={() => useVariantStore.getState().confirm()}
              onClose={() => useVariantStore.getState().close()}
            />
          );
        })()
      }
    </div>
  );
}

export function SimpleLayout() {
  const variantProduct = useVariantStore(state => state.product);
  const variantsMap = useVariantStore(state => state.variantsMap);
  const selection = useVariantStore(state => state.selection);

  const productForModal = useMemo(() => {
    if (!variantProduct) return null;
    return {
      ...variantProduct,
      variants: variantsMap || {},
      img: variantProduct.img || variantProduct.image || variantProduct.image_url,
      price: variantProduct.price ?? variantProduct.base_price,
    };
  }, [variantProduct, variantsMap]);

  return (
    <div className="font-['Nunito_Sans'] bg-gray-100 min-h-screen">
      <AnnouncementBar />
      <main>
        <Outlet />
      </main>
      <VariantModal
        product={productForModal}
        selection={selection}
        onSelectionChange={(name, value) => useVariantStore.getState().setSelection(name, value)}
        onConfirm={() => useVariantStore.getState().confirm()}
        onClose={() => useVariantStore.getState().close()}
      />
    </div>
  );
}
