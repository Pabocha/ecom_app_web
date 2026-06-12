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
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function HomeLayout() {
  const navigate = useNavigate();
  const { cartCount, cartOpen, setCartOpen, cartItems, changeQty, removeItem } =
    useCart();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
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
      <SubNav onOpenCategories={() => navigate("/categories")} />

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
          navigate("/cart");
        }}
      />
    </div>
  );
}

function BasicLayout() {
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
          navigate("/cart");
        }}
      />
    </div>
  );
}

/**
 * Composant pour la route détail produit
 */
function ProductDetailRoute() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useCart();

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
      onAddToCart={(product) => addToCart(product, false)}
      onOpenProduct={(p) => navigate(`/product/${p.id}`)}
    />
  );
}

/**
 * Wrappers pour les pages
 */

function HomePageWrapper() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <HomePage
      onAddToCart={(p) => addToCart(p)}
      onOpenProduct={(p) => navigate(`/product/${p.id}`)}
      onOpenFlashDeals={() => navigate("/flash-deals")}
      onOpenCategory={(c) => navigate(`/category/${c}`)}
    />
  );
}

function LoginPageWrapper() {
  return <LoginPage />;
}

function SignupPageWrapper() {
  return <SignupPage />;
}

function CartPageWrapper() {
  const navigate = useNavigate();
  const { cartItems, changeQty, removeItem, addToCart } = useCart();

  return (
    <CartPage
      items={cartItems}
      onClose={() => navigate("/")}
      onQty={changeQty}
      onRemove={removeItem}
      onOpenProduct={(p) => navigate(`/product/${p.id}`)}
      onAddToCart={(p) => addToCart(p)}
    />
  );
}

function SearchPageWrapper() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <SearchResultsPage
      onAddToCart={(p) => addToCart(p)}
      onOpenProduct={(p) => navigate(`/product/${p.id}`)}
    />
  );
}

function B2BPageWrapper() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <B2BPage
      onAddToCart={(p) => addToCart(p)}
      onOpenProduct={(p) => navigate(`/product/${p.id}`)}
    />
  );
}

function FlashDealsPageWrapper() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <FlashDealsPage
      onClose={() => navigate("/")}
      onAddToCart={(p) => addToCart(p)}
      onOpenProduct={(p) => navigate(`/product/${p.id}`)}
    />
  );
}

function DealsPageWrapper() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <DealsPage
      onClose={() => navigate("/")}
      onAddToCart={(p) => addToCart(p)}
      onOpenProduct={(p) => navigate(`/product/${p.id}`)}
    />
  );
}

function NewProductsPageWrapper() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <NewProductsPage
      onClose={() => navigate("/")}
      onAddToCart={(p) => addToCart(p)}
      onOpenProduct={(p) => navigate(`/product/${p.id}`)}
    />
  );
}

function ImportPageWrapper() {
  const navigate = useNavigate();

  return <ImportPage onClose={() => navigate("/")} />;
}

function TopSellersPageWrapper() {
  const navigate = useNavigate();

  return <TopSellersPage onClose={() => navigate("/")} />;
}

function ProPageWrapper() {
  const navigate = useNavigate();

  return <ProPage onClose={() => navigate("/")} />;
}

function HelpPageWrapper() {
  const navigate = useNavigate();

  return <HelpPage onClose={() => navigate("/")} />;
}

function CategoriesPageWrapper() {
  const navigate = useNavigate();

  return (
    <AllCategoriesPage
      onClose={() => navigate("/")}
      onOpenCategory={(c) => navigate(`/category/${c}`)}
    />
  );
}

function CategoryProductsPageWrapper() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <CategoryProductsPage
      onClose={() => navigate("/")}
      onAddToCart={(p) => addToCart(p)}
      onOpenProduct={(p) => navigate(`/product/${p.id}`)}
      onOpenCategory={(c) => navigate(`/category/${c}`)}
    />
  );
}

/**
 * Configuration des routes
 */
export const routes = [
  // AUTH ROUTES (sans layout)
  {
    path: "/login",
    element: <LoginPageWrapper />,
  },
  {
    path: "/signup",
    element: <SignupPageWrapper />,
  },

  // HOMEPAGE avec NAVBAR
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <HomePageWrapper />,
      },
    ],
  },

  // AUTRES ROUTES avec LAYOUT BASIQUE
  {
    path: "/cart",
    element: <BasicLayout />,
    children: [
      {
        index: true,
        element: <CartPageWrapper />,
      },
    ],
  },
  {
    path: "/search",
    element: <BasicLayout />,
    children: [
      {
        index: true,
        element: <SearchPageWrapper />,
      },
    ],
  },
  {
    path: "/b2b",
    element: <BasicLayout />,
    children: [
      {
        index: true,
        element: <B2BPageWrapper />,
      },
    ],
  },
  {
    path: "/flash-deals",
    element: <BasicLayout />,
    children: [
      {
        index: true,
        element: <FlashDealsPageWrapper />,
      },
    ],
  },
  {
    path: "/deals",
    element: <BasicLayout />,
    children: [
      {
        index: true,
        element: <DealsPageWrapper />,
      },
    ],
  },
  {
    path: "/new-products",
    element: <BasicLayout />,
    children: [
      {
        index: true,
        element: <NewProductsPageWrapper />,
      },
    ],
  },
  {
    path: "/import",
    element: <BasicLayout />,
    children: [
      {
        index: true,
        element: <ImportPageWrapper />,
      },
    ],
  },
  {
    path: "/top-sellers",
    element: <BasicLayout />,
    children: [
      {
        index: true,
        element: <TopSellersPageWrapper />,
      },
    ],
  },
  {
    path: "/pro",
    element: <BasicLayout />,
    children: [
      {
        index: true,
        element: <ProPageWrapper />,
      },
    ],
  },
  {
    path: "/help",
    element: <BasicLayout />,
    children: [
      {
        index: true,
        element: <HelpPageWrapper />,
      },
    ],
  },
  {
    path: "/categories",
    element: <BasicLayout />,
    children: [
      {
        index: true,
        element: <CategoriesPageWrapper />,
      },
    ],
  },
  {
    path: "/category/:id",
    element: <BasicLayout />,
    children: [
      {
        index: true,
        element: <CategoryProductsPageWrapper />,
      },
    ],
  },
  {
    path: "/product/:id",
    element: <BasicLayout />,
    children: [
      {
        index: true,
        element: <ProductDetailRoute />,
      },
    ],
  },

  // Fallback 404
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];
