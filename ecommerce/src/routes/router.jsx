import { Navigate, useNavigate, useParams, Outlet } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

// Layouts
import AnnouncementBar from "../components/layout/AnnouncementBar";
import TopNav from "../components/layout/TopNav";
import SubNav from "../components/layout/SubNav";
import Footer from "../components/layout/Footer";
import CartSidebar from "../components/cart/CartSidebar";

// Pages
import HomePage from "../pages/HomePage";
import AllCategoriesPage from "../pages/AllCategoriesPage";
import FlashDealsPage from "../pages/FlashDealsPage";
import DealsPage from "../pages/DealsPage";
import CategoryProductsPage from "../pages/CategoryProductsPage";
import CartPage from "../pages/CartPage";
import ProductDetailPage from "../components/product/ProductDetailPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import SellerCenterPage from "../pages/SellerCenterPage";
import SellerRegistrationPage from "../pages/SellerRegistration";
import SearchResultsPage from "../pages/SearchResultsPage";
import B2BPage from "../pages/B2BPage";
import NewProductsPage from "../pages/NewProductsPage";
import ImportPage from "../pages/ImportPage";
import TopSellersPage from "../pages/TopSellersPage";
import ProPage from "../pages/ProPage";
import HelpPage from "../pages/HelpPage";

// Data
import { featuredProducts, flashDeals, categoryProducts } from "../data/data";

/**
 * Layouts avec hooks (doivent être dans le router pour avoir accès aux Providers)
 */

function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.type_user !== role) return <Navigate to="/" replace />;
  return children;
}

function HomeLayout() {
  const navigate = useNavigate();
  const { cartCount, cartOpen, setCartOpen, cartItems, changeQty, removeItem } = useCart();
  const { user, logout } = useAuth();

  return (
    <div className="font-['Nunito_Sans'] bg-gray-100 min-h-screen">
      <AnnouncementBar />
      <TopNav cartCount={cartCount} onCartOpen={() => setCartOpen(true)} user={user} onLogout={() => { logout(); navigate("/"); }} />
      <SubNav onOpenCategories={() => navigate("/categories")} />
      <main><Outlet /></main>
      <Footer />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} onQty={changeQty} onRemove={removeItem} onOpenCartPage={() => { setCartOpen(false); navigate("/cart"); }} />
    </div>
  );
}

function BasicLayout() {
  const navigate = useNavigate();
  const { cartOpen, setCartOpen, cartItems, changeQty, removeItem } = useCart();

  return (
    <div className="font-['Nunito_Sans'] bg-gray-100 min-h-screen">
      <AnnouncementBar />
      <main><Outlet /></main>
      <Footer />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} onQty={changeQty} onRemove={removeItem} onOpenCartPage={() => { setCartOpen(false); navigate("/cart"); }} />
    </div>
  );
}

// 2. LE SEUL WRAPPER VRAIMENT UTILE (Logique dynamique)
function ProductDetailRoute() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useCart();

  const allProducts = [...featuredProducts, ...flashDeals, ...Object.values(categoryProducts).flat()];
  const product = allProducts.find((item) => String(item.id) === String(id));

  if (!product) return <Navigate to="/" replace />;

  return (
    <ProductDetailPage
      product={product}
      onClose={() => navigate(-1)}
      onAddToCart={(p) => addToCart(p, false)}
      onOpenProduct={(p) => navigate(`/product/${p.id}`)}
    />
  );
}

// 3. CONFIGURATION DES ROUTES NETTOYÉE
export const routes = [
  // ROUTES D'AUTHENTIFICATION (Sans layout)
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  
  // ROUTES VENDEURS (Protégées par le PrivateRoute !)
  { path: "/seller-center", element: <PrivateRoute role="acheteur"><SellerCenterPage /></PrivateRoute> },
  { path: "/seller-registration", element: <PrivateRoute><SellerRegistrationPage /></PrivateRoute> },

  // ACCUEIL (Avec HomeLayout)
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      { index: true, element: <HomePage /> }, // Plus besoin de HomePageWrapper !
    ],
  },

  // TOUTES LES AUTRES PAGES (Regroupées sous UN SEUL BasicLayout)
  {
    element: <BasicLayout />,
    children: [
      { path: "/cart", element: <CartPage /> },
      { path: "/search", element: <SearchResultsPage /> },
      { path: "/b2b", element: <B2BPage /> },
      { path: "/flash-deals", element: <FlashDealsPage /> },
      { path: "/deals", element: <DealsPage /> },
      { path: "/new-products", element: <NewProductsPage /> },
      { path: "/import", element: <ImportPage /> },
      { path: "/top-sellers", element: <TopSellersPage /> },
      { path: "/pro", element: <ProPage /> },
      { path: "/help", element: <HelpPage /> },
      { path: "/categories", element: <AllCategoriesPage /> },
      { path: "/category/:id", element: <CategoryProductsPage /> },
      { path: "/product/:id", element: <ProductDetailRoute /> }, // Route dynamique
    ],
  },

  // Fallback 404
  { path: "*", element: <Navigate to="/" replace /> },
];