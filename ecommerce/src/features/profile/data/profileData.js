import { User, MessageSquare, Gift, History } from 'lucide-react';

export const SIDE_TABS = [
  { key: 'infos', label: 'Informations', icon: User },
  { key: 'reviews', label: 'Avis en attente', icon: MessageSquare },
  { key: 'coupons', label: "Bons d'achat", icon: Gift },
  { key: 'recent', label: 'Vus récemment', icon: History },
];

export const mockPendingReviews = [
  { id: 1, name: 'iPhone 15 Pro Max 256GB Titanium', img: 'https://images.unsplash.com/photo-1696446702183-cbd29d049619?w=100&q=80', date: '12 Juin 2025' },
  { id: 2, name: 'Samsung Galaxy S24 Ultra 512GB', img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&q=80', date: '28 Mai 2025' },
  { id: 3, name: 'Casque Sony WH-1000XM5 ANC', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80', date: '15 Mai 2025' },
];

export const mockCoupons = [
  { code: 'WELCOME25', discount: '-25%', min: 'Aucun minimum', expires: '31 Déc 2025', used: false },
  { code: 'FREESHIP', discount: 'Livraison offerte', min: 'Dès 50 000 FCFA', expires: '30 Sep 2025', used: false },
  { code: 'FLASH10', discount: '-10%', min: 'Dès 25 000 FCFA', expires: '31 Juil 2025', used: true },
];

export const mockRecentViews = [
  { id: 1, name: 'MacBook Air M3 13" 256GB', price: 1099000, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&q=80' },
  { id: 2, name: 'Drone DJI Mini 4 Pro + Accessoires', price: 429000, img: 'https://images.unsplash.com/photo-1591491653056-4e73d3ede7c0?w=100&q=80' },
  { id: 3, name: 'Montre Samsung Galaxy Watch 6', price: 149000, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80' },
  { id: 4, name: 'Canapé Scandinave 3 Places Velours', price: 299000, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&q=80' },
  { id: 5, name: 'AirPods Pro 2ème Génération', price: 129000, img: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=100&q=80' },
];
