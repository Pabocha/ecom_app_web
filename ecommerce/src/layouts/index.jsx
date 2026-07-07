import { Outlet, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useCart } from '@/features/cart/hooks/useCart';
import { useAuth, useCheckAuth, useLogout } from '@/features/auth/hooks/useAuth';
import { useVariantActions } from '@/features/product/hooks/useVariant';
import AnnouncementBar from '@/layouts/AnnouncementBar';
import TopNav from '@/layouts/TopNav';
import SubNav from '@/layouts/SubNav';
import Footer from '@/layouts/Footer';
import CartSidebar from '@/features/cart/components/CartSidebar';
import VariantModal from '@/components/VariantModal';
import LoginModal from '@/features/auth/components/LoginModal';
import { useVariantStore } from '@/stores/variantStore';

export function BasicLayout() {
  const navigate = useNavigate();
  const { cartCount, cartOpen, setCartOpen, cartItems, changeQty, removeItem, isPending } = useCart();
  const { user } = useAuth();

  // AJOUT — Vérifier session au load via cookie HttpOnly
  useCheckAuth();

  // MODIFICATION ICI — Logout via API pour supprimer le cookie HttpOnly
  const { logout } = useLogout();

  // MODIFICATION ICI — Hook pour la confimation variante (logique métier)
  const { confirmVariant } = useVariantActions();

  return (
    <div className="font-['Nunito_Sans'] bg-gray-100 min-h-screen">
      <AnnouncementBar />
      <TopNav
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        user={user}
        onLogout={logout}
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
        isPending={isPending}
        onOpenCartPage={() => {
          setCartOpen(false);
          navigate('/cart');
        }}
      />

      {/* MODIFICATION ICI — Modal globale avec raw (arbre dynamique) + loading */}
      {
        (() => {
          const variantProduct = useVariantStore(state => state.product);
          const variantsMap = useVariantStore(state => state.variantsMap);
          const selection = useVariantStore(state => state.selection);
          const raw = useVariantStore(state => state.raw);
          const loading = useVariantStore(state => state.loading);

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
              raw={raw}
              loading={loading}
              onSelectionChange={(name, value) => useVariantStore.getState().setSelection(name, value)}
              onConfirm={confirmVariant}
              onClose={() => useVariantStore.getState().close()}
            />
          );
        })()
      }

      {/* AJOUT — Modal de connexion */}
      <LoginModal />
    </div>
  );
}

export function SimpleLayout() {
  // MODIFICATION ICI — Hook pour la confimation variante (logique métier)
  const { confirmVariant } = useVariantActions();
  const variantProduct = useVariantStore(state => state.product);
  const variantsMap = useVariantStore(state => state.variantsMap);
  const selection = useVariantStore(state => state.selection);
  const raw = useVariantStore(state => state.raw);
  const loading = useVariantStore(state => state.loading);

  // AJOUT — Vérifier session au load via cookie HttpOnly
  useCheckAuth();

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
        raw={raw}
        loading={loading}
        onSelectionChange={(name, value) => useVariantStore.getState().setSelection(name, value)}
        onConfirm={confirmVariant}
        onClose={() => useVariantStore.getState().close()}
      />

      {/* AJOUT — Modal de connexion */}
      <LoginModal />
    </div>
  );
}
