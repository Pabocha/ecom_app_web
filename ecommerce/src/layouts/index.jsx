import { Outlet, useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import TopNav from '@/components/layout/TopNav';
import SubNav from '@/components/layout/SubNav';
import Footer from '@/components/layout/Footer';
import CartSidebar from '@/components/cart/CartSidebar';

/**
 * Layout avec barre de navigation complète
 */
export function HomeLayout() {
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

/**
 * Layout minimal (sans TopNav)
 */
export function BasicLayout() {
  const navigate = useNavigate();
  const { cartOpen, setCartOpen, cartItems, changeQty, removeItem } = useCart();

  return (
    <div className="font-['Nunito_Sans'] bg-gray-100 min-h-screen">
      <AnnouncementBar />

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
