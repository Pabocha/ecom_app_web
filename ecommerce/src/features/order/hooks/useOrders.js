import { useMemo, useState } from 'react';
import { mockOrders } from '@/features/order/data/orderData';

export function useOrders() {
  const [activeTab, setActiveTab] = useState('Toutes');

  const filteredOrders = useMemo(() => {
    if (activeTab === 'Toutes') return mockOrders;
    const statusMap = { 'En cours': 'pending', 'Livrées': 'delivered', 'Annulées': 'cancelled' };
    return mockOrders.filter(o => o.status === statusMap[activeTab]);
  }, [activeTab]);

  const countByStatus = useMemo(() => {
    const counts = { pending: 0, delivered: 0, cancelled: 0 };
    mockOrders.forEach(o => { counts[o.status]++ });
    return counts;
  }, []);

  return { activeTab, setActiveTab, filteredOrders, countByStatus };
}
