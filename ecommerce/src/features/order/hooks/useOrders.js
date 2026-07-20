import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/features/order/services/orderService';

const STATUS_MAP = {
  'En cours': ['pending', 'processing', 'shipped', 'in_transit'],
  'Expédiées': ['shipped', 'in_transit'],
  'Livrées': ['delivered'],
  'Annulées': ['cancelled', 'returned', 'partially_returned'],
};

export function useOrders() {
  const [activeTab, setActiveTab] = useState('Toutes');

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await orderService.getOrder();
      return res?.data?.results || res?.data || [];
    },
  });

  const allOrders = useMemo(() => orders || [], [orders]);

  const filteredOrders = useMemo(() => {
    if (activeTab === 'Toutes') return allOrders;
    const allowedStatuses = STATUS_MAP[activeTab] || [];
    return allOrders.filter((o) => allowedStatuses.includes(o.status));
  }, [activeTab, allOrders]);

  const countByStatus = useMemo(() => {
    const counts = { pending: 0, processing: 0, shipped: 0, in_transit: 0, delivered: 0, cancelled: 0, returned: 0, partially_returned: 0 };
    allOrders.forEach((o) => { if (counts[o.status] !== undefined) counts[o.status]++; });
    return counts;
  }, [allOrders]);

  return { activeTab, setActiveTab, filteredOrders, countByStatus, isLoading, error };
}
