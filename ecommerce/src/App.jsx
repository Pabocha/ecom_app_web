import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useNavigate, useParams, Navigate } from 'react-router-dom';
import { featuredProducts, flashDeals, categoryProducts } from './data/data.js';

// Layout & UI Components
import AnnouncementBar from './components/layout/AnnouncementBar.jsx';
import TopNav from './components/layout/TopNav.jsx';
import SubNav from './components/layout/SubNav.jsx';
import Footer from './components/layout/Footer.jsx';
import CartSidebar from './components/cart/CartSidebar.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import AllCategoriesPage from './pages/AllCategoriesPage.jsx';
import FlashDealsPage from './pages/FlashDealsPage.jsx';
import DealsPage from './pages/DealsPage.jsx';
import CategoryProductsPage from './pages/CategoryProductsPage.jsx';
import CartPage from './pages/CartPage.jsx';
import ProductDetailPage from './components/product/ProductDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import SearchResultsPage from './pages/SearchResultsPage.jsx';
import B2BPage from './pages/B2BPage.jsx';
import NewProductsPage from './pages/NewProductsPage.jsx';
import ImportPage from './pages/ImportPage.jsx';
import TopSellersPage from './pages/TopSellersPage.jsx';
import ProPage from './pages/ProPage.jsx';
import HelpPage from './pages/HelpPage.jsx';

// 1. Le Composant Layout Accueil (avec Navbar)
function HomeLayout({
  cartCount,
  cartOpen,
  setCartOpen,
  cartItems,
  changeQty,
  removeItem,
  user,
  setUser
}) {
  const navigate = useNavigate();

  return (
    <div className="font-['Nunito_Sans'] bg-gray-100 min-h-screen">
      <AnnouncementBar />
      <TopNav
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        user={user}
        onLogout={() => {
          localStorage.removeItem('user');
          setUser(null);
          navigate('/');
        }}
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

// 2. Le Composant Layout Basique (sans Navbar)
function BasicLayout({
  cartCount,
  cartOpen,
  setCartOpen,
  cartItems,
  changeQty,
  removeItem,
  user,
  setUser
}) {
  const navigate = useNavigate();

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

function ProductDetailRoute({ onAddToCart }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const allProducts = [
    ...featuredProducts,
    ...flashDeals,
    ...Object.values(categoryProducts).flat(),
  ];
  const product = allProducts.find((item) => String(item.id) === String(id));

  if (!product) {
    return <Navigate to="/" replace />;
  }

  return (
    <ProductDetailPage
      product={product}
      onClose={() => navigate(-1)}
      onAddToCart={(product) => onAddToCart(product, false)}
      onOpenProduct={(p) => navigate(`/product/${p.id}`)}
    />
  );
}


// ### 2. Le Composant Principal App

export default function App() {
  // --- ÉTATS GLOBAUX (Panier & UI & Auth) ---
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  // --- CHARGER L'UTILISATEUR DEPUIS LOCALSTORAGE AU MONTAGE ---
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error loading user from localStorage:', e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // --- FONCTIONS DU PANIER (Logique d'origine conservée) ---
  const addToCart = (p, openSidebar = true) => {
    setCartItems(prev => {
      const cartKey = p.cartKey || String(p.id);
      const ex = prev.find(i => (i.cartKey || String(i.id)) === cartKey);
      if (ex) return prev.map(i => (i.cartKey || String(i.id)) === cartKey ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...p, cartKey, qty: 1 }];
    });
    if (openSidebar) setCartOpen(true);
  };

  const changeQty = (id, d) =>
    setCartItems(prev => prev.map(i => (i.cartKey || i.id) === id ? { ...i, qty: Math.max(1, i.qty + d) } : i));

  const removeItem = (id) =>
    setCartItems(prev => prev.filter(i => (i.cartKey || i.id) !== id));

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  // --- CONFIGURATION DES ROUTES ---
  const router = createBrowserRouter([
    // AUTH ROUTES (sans layout)
    {
      path: "/login",
      element: <LoginPage onLogin={setUser} />
    },
    {
      path: "/signup",
      element: <SignupPage onLogin={setUser} />
    },
    // SEARCH ROUTE (sans layout)
    {
      path: "/search",
      element: (
        <div className="font-['Nunito_Sans'] bg-gray-100 min-h-screen">
          <AnnouncementBar />
          <TopNav
            cartCount={cartCount}
            onCartOpen={() => setCartOpen(true)}
            user={user}
            onLogout={() => {
              localStorage.removeItem('user');
              setUser(null);
            }}
          />
          <SubNav onOpenCategories={() => router.navigate('/categories')} />
          <SearchResultsPage
            onAddToCart={addToCart}
            onOpenProduct={(p) => router.navigate(`/product/${p.id}`)}
          />
          <Footer />
          <CartSidebar
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            items={cartItems}
            onQty={changeQty}
            onRemove={removeItem}
            onOpenCartPage={() => {
              setCartOpen(false);
              router.navigate('/cart');
            }}
          />
        </div>
      )
    },
    // B2B ROUTE (sans layout)
    {
      path: "/b2b",
      element: (
        <div className="font-['Nunito_Sans'] bg-gray-100 min-h-screen">
          <AnnouncementBar />
          <TopNav
            cartCount={cartCount}
            onCartOpen={() => setCartOpen(true)}
            user={user}
            onLogout={() => {
              localStorage.removeItem('user');
              setUser(null);
            }}
          />
          <SubNav onOpenCategories={() => router.navigate('/categories')} />
          <B2BPage
            onAddToCart={addToCart}
            onOpenProduct={(p) => router.navigate(`/product/${p.id}`)}
          />
          <Footer />
          <CartSidebar
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            items={cartItems}
            onQty={changeQty}
            onRemove={removeItem}
            onOpenCartPage={() => {
              setCartOpen(false);
              router.navigate('/cart');
            }}
          />
        </div>
      )
    },
    // HOMEPAGE (avec Navbar)
    {
      path: "/",
      element: (
        <HomeLayout
          cartCount={cartCount}
          cartOpen={cartOpen}
          setCartOpen={setCartOpen}
          cartItems={cartItems}
          changeQty={changeQty}
          removeItem={removeItem}
          user={user}
          setUser={setUser}
        />
      ),
      children: [
        {
          path: "/",
          element: (
            <HomePage
              onAddToCart={addToCart}
              onOpenProduct={(p) => router.navigate(`/product/${p.id}`)}
              onOpenFlashDeals={() => router.navigate('/flash-deals')}
              onOpenCategory={(c) => router.navigate(`/category/${c}`)}
            />
          )
        },
      ]
    },
    // AUTRES PAGES (sans Navbar)
    {
      path: "/",
      element: (
        <BasicLayout
          cartCount={cartCount}
          cartOpen={cartOpen}
          setCartOpen={setCartOpen}
          cartItems={cartItems}
          changeQty={changeQty}
          removeItem={removeItem}
          user={user}
          setUser={setUser}
        />
      ),
      children: [
        {
          path: "cart",
          element: (
            <CartPage
              items={cartItems}
              onClose={() => router.navigate('/')}
              onQty={changeQty}
              onRemove={removeItem}
              onOpenProduct={(p) => router.navigate(`/product/${p.id}`)}
              onAddToCart={addToCart}
            />
          )
        },
        {
          path: "flash-deals",
          element: (
            <FlashDealsPage
              onClose={() => router.navigate('/')}
              onAddToCart={addToCart}
              onOpenProduct={(p) => router.navigate(`/product/${p.id}`)}
            />
          )
        },
        {
          path: "deals",
          element: (
            <DealsPage
              onClose={() => router.navigate('/')}
              onAddToCart={addToCart}
              onOpenProduct={(p) => router.navigate(`/product/${p.id}`)}
            />
          )
        },
        {
          path: "new",
          element: (
            <NewProductsPage
              onClose={() => router.navigate('/')}
              onAddToCart={addToCart}
              onOpenProduct={(p) => router.navigate(`/product/${p.id}`)}
            />
          )
        },
        {
          path: "import",
          element: (
            <ImportPage
              onClose={() => router.navigate('/')}
            />
          )
        },
        {
          path: "top-sellers",
          element: (
            <TopSellersPage
              onClose={() => router.navigate('/')}
            />
          )
        },
        {
          path: "pro",
          element: (
            <ProPage
              onClose={() => router.navigate('/')}
            />
          )
        },
        {
          path: "help",
          element: (
            <HelpPage
              onClose={() => router.navigate('/')}
            />
          )
        },
        {
          path: "categories",
          element: (
            <AllCategoriesPage
              onClose={() => router.navigate('/')}
              onOpenCategory={(c) => router.navigate(`/category/${c}`)}
            />
          )
        },
        {
          path: "category/:id",
          element: (
            <CategoryProductsPage
              onClose={() => router.navigate('/')}
              onAddToCart={addToCart}
              onOpenProduct={(p) => router.navigate(`/product/${p.id}`)}
              onOpenCategory={(c) => router.navigate(`/category/${c}`)}
            />
          )
        },
        {
          path: "product/:id",
          element: <ProductDetailRoute onAddToCart={addToCart} />
        },
      ]
    }
  ]);

  return <RouterProvider router={router} />;
}