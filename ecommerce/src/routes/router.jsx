import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCart } from "@/features/cart/hooks/useCart";
import { useProduct } from "@/features/product/hooks/useProduct";
import { USER_ROLES } from "@/types";

// Layouts
import { BasicLayout, SimpleLayout } from "@/layouts";

// Pages
import HomePage from "@/pages/home/HomePage";
import AllCategoriesPage from "@/pages/catalog/AllCategoriesPage";
import FlashDealsPage from "@/pages/deals/FlashDealsPage";
import DealsPage from "@/pages/deals/DealsPage";
import CategoryProductsPage from "@/pages/catalog/CategoryProductsPage";
import CartPage from "@/pages/cart/CartPage";
import ProductDetailPage from "@/pages/product/ProductDetailPage";
import ShopPage from "@/pages/shop/ShopPage";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import SellerCenterPage from "@/pages/seller/SellerCenterPage";
import SellerRegistrationPage from "@/pages/seller/SellerRegistration";
import SearchResultsPage from "@/pages/catalog/SearchResultsPage";
import AllProductsPage from "@/pages/product/AllProductsPage";
import B2BPage from "@/pages/b2b/B2BPage";
import NewProductsPage from "@/pages/deals/NewProductsPage";
import ImportPage from "@/pages/b2b/ImportPage";
import TopSellersPage from "@/pages/deals/TopSellersPage";
import ProPage from "@/pages/b2b/ProPage";
import HelpPage from "@/pages/help/HelpPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import OrdersPage from "@/pages/order/OrdersPage";
import OrderDetailPage from "@/pages/order/OrderDetailPage";

// Data
import { getOrderById } from "@/features/order/data/orderData";

function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.type_user !== role) return <Navigate to="/" replace />;
  return children;
}

function ProductDetailRoute() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useCart();

  const { data: productRes, isLoading } = useProduct(id);
  const product = productRes?.data?.results || productRes?.data || null;

  if (isLoading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><div className="text-gray-400 text-[14px]">Chargement...</div></div>;
  if (!product) return <Navigate to="/" replace />;

  return (
    <ProductDetailPage
      product={product}
      onClose={() => navigate(-1)}
      onAddToCart={(p) => addToCart(p, false)}
      onOpenProduct={(p) => navigate(`/product/${p.id}`)}
      onOpenShop={(shopId) => navigate(`/shop/${shopId}`)}
    />
  );
}

function OrderDetailRoute() {
  const { id } = useParams();
  const order = getOrderById(id);

  if (!order) return <Navigate to="/profile/orders" replace />;

  return <OrderDetailPage order={order} />;
}

export const routes = [
  {
    element: <BasicLayout />,
    children: [
      { index: true, element: <HomePage /> },

      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },

      { path: "/seller-center", element: <PrivateRoute role={USER_ROLES.CUSTOMER}><SellerCenterPage /></PrivateRoute> },
      { path: "/seller-registration", element: <PrivateRoute><SellerRegistrationPage /></PrivateRoute> },

      { path: "/search", element: <SearchResultsPage /> },
      { path: "/all-products", element: <AllProductsPage /> },
      { path: "/b2b", element: <B2BPage /> },

      { path: "/flash-deals", element: <FlashDealsPage /> },
      { path: "/deals", element: <DealsPage /> },
      { path: "/new-products", element: <NewProductsPage /> },
      { path: "/top-sellers", element: <TopSellersPage /> },
      { path: "/import", element: <ImportPage /> },
      { path: "/help", element: <HelpPage /> },
    ],
  },

  {
    element: <SimpleLayout />,
    children: [
      { path: "/profile", element: <PrivateRoute><ProfilePage /></PrivateRoute> },
      { path: "/profile/orders", element: <PrivateRoute><OrdersPage /></PrivateRoute> },
      { path: "/profile/orders/:id", element: <PrivateRoute><OrderDetailRoute /></PrivateRoute> },

      { path: "/cart", element: <CartPage /> },
      { path: "/categories", element: <AllCategoriesPage /> },
      { path: "/category/:id", element: <CategoryProductsPage /> },
      { path: "/product/:id", element: <ProductDetailRoute /> },
      { path: "/shop/:id", element: <ShopPage /> },

      { path: "/pro", element: <ProPage /> },
    ],
  },

  { path: "*", element: <Navigate to="/" replace /> },
];
