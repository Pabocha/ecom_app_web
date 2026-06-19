import { Outlet, useNavigate } from 'react-router-dom';
import { useCart } from '@/features/cart/hooks/useCart';
import { useAuth } from '@/features/auth/hooks/useAuth';
import AnnouncementBar from '@/layouts/AnnouncementBar';
import TopNav from '@/layouts/TopNav';
import SubNav from '@/layouts/SubNav';
import Footer from '@/layouts/Footer';
import CartSidebar from '@/features/cart/components/CartSidebar';

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
    </div>
  );
}

export function SimpleLayout() {
  return (
    <div className="font-['Nunito_Sans'] bg-gray-100 min-h-screen">
      <AnnouncementBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
