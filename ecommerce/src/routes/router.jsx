import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCart } from "@/features/cart/hooks/useCart";
import { useProduct, useAddRecentlyViewed } from "@/features/product/hooks/useProduct";
import { useUIStore } from "@/stores/uiStore";
import { USER_ROLES } from "@/types";
import { orderService } from "@/features/order/services/orderService";

// Layouts
import { BasicLayout, SimpleLayout } from "@/layouts";

// Pages
import HomePage from "@/pages/home/HomePage";
import AllCategoriesPage from "@/pages/catalog/AllCategoriesPage";
import FlashDealsPage from "@/pages/deals/FlashDealsPage";
import DealsPage from "@/pages/deals/DealsPage";
import CategoryProductsPage from "@/pages/catalog/CategoryProductsPage";
import CartPage from "@/pages/cart/CartPage";
import CheckoutPage from "@/pages/cart/CheckoutPage";
import SuccessPage from "@/pages/cart/SuccessPage";
import ProductDetailPage from "@/pages/product/ProductDetailPage";
import ShopPage from "@/pages/shop/ShopPage";
import ShopsPage from "@/pages/shop/ShopsPage";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import SellerCenterPage from "@/pages/seller/SellerCenterPage";
import SellerRegistrationPage from "@/pages/seller/SellerRegistration";
import SearchResultsPage from "@/pages/catalog/SearchResultsPage";
import AllProductsPage from "@/pages/product/AllProductsPage";
import NewProductsPage from "@/pages/deals/NewProductsPage";
import ImportPage from "@/pages/b2b/ImportPage";
import TopSellersPage from "@/pages/deals/TopSellersPage";
import ProPage from "@/pages/b2b/ProPage";
import HelpPage from "@/pages/help/HelpPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import OrdersPage from "@/pages/order/OrdersPage";
import OrderDetailPage from "@/pages/order/OrderDetailPage";
import MessagesPage from "@/pages/messages/MessagesPage";
import TicketCreatePage from "@/pages/support/TicketCreatePage";
import TicketsPage from "@/pages/support/TicketsPage";

function PrivateRoute({ children, role }) {
  const { user } = useAuth();

  // MODIFICATION ICI — Ouvre la modal de connexion au lieu de rediriger
  if (!user) {
    useUIStore.getState().openLoginModal();
    return null;
  }

  if (role && user.type_user !== role) return <Navigate to="/" replace />;
  return children;
}

function ProductDetailRoute() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart, addingId } = useCart();
  const { mutate: addRecentlyViewed } = useAddRecentlyViewed();

  const { data: productRes } = useProduct(id);
  const product = productRes?.data?.results || productRes?.data || null;

  useEffect(() => {
    if (product?.id) {
      addRecentlyViewed(product.id);
    }
  }, [product?.id, addRecentlyViewed]);

  return (
    <ProductDetailPage
      product={product}
      onClose={() => navigate(-1)}
      onAddToCart={(p) => addToCart(p)}
      addingId={addingId}
      onOpenProduct={(p) => navigate(`/product/${p.id}`)}
      onOpenShop={(shopId) => navigate(`/shop/${shopId}`)}
    />
  );
}

function OrderDetailRoute() {
  const { id } = useParams();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await orderService.getOrderDetails(id);
      return res?.data || null;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[13px] text-gray-400">Chargement de la commande...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return <Navigate to="/profile/orders" replace />;
  }

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

      { path: "/all-products", element: <AllProductsPage /> },
      { path: "/shops", element: <ShopsPage /> },

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
      { path: "/messages", element: <PrivateRoute><MessagesPage /></PrivateRoute> },

      { path: "/support/tickets", element: <PrivateRoute><TicketsPage /></PrivateRoute> },
      { path: "/support/tickets/new", element: <PrivateRoute><TicketCreatePage /></PrivateRoute> },

      { path: "/cart", element: <CartPage /> },
      { path: "/checkout", element: <PrivateRoute><CheckoutPage /></PrivateRoute> },
      { path: "/order-success", element: <SuccessPage /> },
      { path: "/categories", element: <AllCategoriesPage /> },
      { path: "/category/:slug", element: <CategoryProductsPage /> },
      { path: "/search", element: <SearchResultsPage /> },
      { path: "/product/:id", element: <ProductDetailRoute /> },
      { path: "/shop/:id", element: <ShopPage /> },

      { path: "/pro", element: <ProPage /> },
    ],
  },

  { path: "*", element: <Navigate to="/" replace /> },
];
