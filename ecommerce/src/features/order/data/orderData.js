import { Clock, CheckCircle, XCircle, Package, Truck, MapPin, CreditCard } from 'lucide-react';

export const ORDER_STATUS = {
  pending: { label: 'En cours', color: 'bg-amber-100 text-amber-700', icon: Clock },
  delivered: { label: 'Livrée', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export const ORDER_TABS = ['Toutes', 'En cours', 'Livrées', 'Annulées'];

const now = '2025-06-19T10:00:00Z';

export const mockOrders = [
  {
    id: 'CMD-2025-0842',
    date: '12 Juin 2025',
    status: 'delivered',
    total: 738000,
    shipping: 3500,
    paymentMethod: 'Wave',
    address: '123 Rue de Dakar, Sicap Liberté, Dakar',
    items: [
      { name: 'iPhone 15 Pro Max 256GB Titanium', qty: 1, price: 699000, img: 'https://images.unsplash.com/photo-1696446702183-cbd29d049619?w=100&q=80' },
    ],
    tracking: [
      { label: 'Commande confirmée', date: '12 Juin 2025, 14:30', done: true },
      { label: 'Préparation en cours', date: '13 Juin 2025, 09:15', done: true },
      { label: 'Expédiée', date: '14 Juin 2025, 11:00', done: true },
      { label: 'Livrée', date: '17 Juin 2025, 16:45', done: true },
    ],
  },
  {
    id: 'CMD-2025-0815',
    date: '28 Mai 2025',
    status: 'pending',
    total: 298000,
    shipping: 2500,
    paymentMethod: 'Orange Money',
    address: '456 Avenue Pompidou, Médina, Dakar',
    items: [
      { name: 'Canapé Scandinave 3 Places Velours', qty: 1, price: 299000, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&q=80' },
    ],
    tracking: [
      { label: 'Commande confirmée', date: '28 Mai 2025, 10:00', done: true },
      { label: 'Préparation en cours', date: '29 Mai 2025, 08:30', done: true },
      { label: 'Expédiée', date: '30 Mai 2025, 14:00', done: false },
      { label: 'Livrée', date: null, done: false },
    ],
  },
  {
    id: 'CMD-2025-0798',
    date: '15 Mai 2025',
    status: 'delivered',
    total: 445000,
    shipping: 0,
    paymentMethod: 'Carte Bancaire',
    address: '789 Boulevard du Sud, Almadies, Dakar',
    items: [
      { name: 'Samsung Galaxy S24 Ultra 512GB', qty: 1, price: 629000, img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&q=80' },
      { name: 'AirPods Pro 2ème Gen USB-C', qty: 1, price: 129000, img: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=100&q=80' },
    ],
    tracking: [
      { label: 'Commande confirmée', date: '15 Mai 2025, 16:20', done: true },
      { label: 'Préparation en cours', date: '16 Mai 2025, 07:45', done: true },
      { label: 'Expédiée', date: '17 Mai 2025, 10:30', done: true },
      { label: 'Livrée', date: '20 Mai 2025, 12:00', done: true },
    ],
  },
  {
    id: 'CMD-2025-0762',
    date: '2 Mai 2025',
    status: 'cancelled',
    total: 89000,
    shipping: 0,
    paymentMethod: 'Wave',
    address: '321 Rue de Thiès, Parcelles Assainies, Dakar',
    items: [
      { name: 'Casque Sony WH-1000XM5 ANC', qty: 1, price: 199000, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80' },
    ],
    tracking: [
      { label: 'Commande confirmée', date: '2 Mai 2025, 11:15', done: true },
      { label: 'Annulée', date: '3 Mai 2025, 09:00', done: true },
    ],
  },
  {
    id: 'CMD-2025-0734',
    date: '18 Avril 2025',
    status: 'delivered',
    total: 125000,
    shipping: 3000,
    paymentMethod: 'Orange Money',
    address: '654 Rue de Ouakam, Ouakam, Dakar',
    items: [
      { name: 'Nike Air Max 270 React Homme', qty: 2, price: 89000, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80' },
    ],
    tracking: [
      { label: 'Commande confirmée', date: '18 Avril 2025, 15:30', done: true },
      { label: 'Préparation en cours', date: '19 Avril 2025, 08:00', done: true },
      { label: 'Expédiée', date: '20 Avril 2025, 13:15', done: true },
      { label: 'Livrée', date: '23 Avril 2025, 10:30', done: true },
    ],
  },
  {
    id: 'CMD-2025-0710',
    date: '5 Avril 2025',
    status: 'pending',
    total: 349000,
    shipping: 5000,
    paymentMethod: 'Wave',
    address: '987 Rue de Mermoz, Mermoz, Dakar',
    items: [
      { name: 'Robot Aspirateur ECOVACS Deebot T20', qty: 1, price: 189000, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&q=80' },
      { name: 'Cafetière De\'Longhi Magnifica Evo', qty: 1, price: 349000, img: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=100&q=80' },
    ],
    tracking: [
      { label: 'Commande confirmée', date: '5 Avril 2025, 09:45', done: true },
      { label: 'Préparation en cours', date: '6 Avril 2025, 10:00', done: true },
      { label: 'Expédiée', date: '7 Avril 2025, 16:30', done: false },
      { label: 'Livrée', date: null, done: false },
    ],
  },
];

export function getOrderById(id) {
  return mockOrders.find(o => o.id === id) || null;
}
