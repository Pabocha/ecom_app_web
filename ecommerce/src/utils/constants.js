/**
 * Constantes globales de l'application
 */

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
  B2B: '/b2b',
  DEALS: '/deals',
  FLASH_DEALS: '/flash-deals',
  NEW_PRODUCTS: '/new-products',
  TOP_SELLERS: '/top-sellers',
  PRO: '/pro',
  IMPORT: '/import',
  HELP: '/help',
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