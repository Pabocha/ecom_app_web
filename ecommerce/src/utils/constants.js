/**
 * Constantes globales de l'application
 */
import { User, MessageSquare, Gift, History, MapPin, RotateCcw, Heart, Building2 } from 'lucide-react';

export const APP_NAME = 'eCommerce';
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  CATEGORIES: '/categories',
  CATEGORY_PRODUCTS: '/category/:name',
  PRODUCT: '/product/:id',
  CART: '/cart',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DEALS: '/deals',
  FLASH_DEALS: '/flash-deals',
  NEW_PRODUCTS: '/new-products',
  TOP_SELLERS: '/top-sellers',
  PRO: '/pro',
  IMPORT: '/import',
  HELP: '/help',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: '/order-success',
};

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
};

export const CART_LIMITS = {
  MAX_QTY: 999,
  MIN_QTY: 1,
};

// Side tabs for the profile page
export const SIDE_TABS = [
  { key: 'infos', label: 'Informations', icon: User },
  { key: 'addresses', label: 'Mes adresses', icon: MapPin },
  { key: 'favorites', label: 'Mes favoris', icon: Heart },
  { key: 'followedShops', label: 'Vendeurs suivis', icon: Building2 },
  { key: 'reviews', label: 'Avis en attente', icon: MessageSquare },
  { key: 'coupons', label: "Bons d'achat", icon: Gift },
  { key: 'returns', label: 'Mes retours', icon: RotateCcw },
  { key: 'recent', label: 'Vus récemment', icon: History },
];
