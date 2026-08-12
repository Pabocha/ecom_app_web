import { Outlet, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useCart } from '@/features/cart/hooks/useCart';
import { useAuth, useCheckAuth, useLogout } from '@/features/auth/hooks/useAuth';
import { useVariantActions } from '@/features/product/hooks/useVariant';
import AnnouncementBar from '@/layouts/AnnouncementBar';
import TopNav from '@/layouts/TopNav';
import SubNav from '@/layouts/SubNav';
import Footer from '@/layouts/Footer';
import VariantModal from '@/components/VariantModal';
import CategoriesDrawer from '@/components/shared/CategoriesDrawer';
import LoginModal from '@/features/auth/components/LoginModal';
import { useVariantStore } from '@/stores/variantStore';

export function BasicLayout() {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user } = useAuth();
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  useCheckAuth();

  const { logout } = useLogout();
  const { confirmVariant } = useVariantActions();

  return (
    <div className="font-['Nunito_Sans'] bg-gray-100 min-h-screen">
      <AnnouncementBar />
      <TopNav
        cartCount={cartCount}
        user={user}
        onLogout={logout}
      />
      <SubNav onOpenCategories={() => setCategoriesOpen(true)} />

      <main>
        <Outlet />
      </main>

      <CategoriesDrawer open={categoriesOpen} onClose={() => setCategoriesOpen(false)} />

      <Footer />

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
