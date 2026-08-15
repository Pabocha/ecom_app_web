import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/features/order/services/orderService';
import { ORDER_TABS } from '@/features/order/data/orderData';

export function useOrders() {
  const [activeTab, setActiveTab] = useState(ORDER_TABS[0].label);

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await orderService.getOrder();
      return res?.data?.results || res?.data || [];
    },
  });

  const allOrders = useMemo(() => orders || [], [orders]);

  // MODIFICATION ICI — Filtrage exact par statut (un onglet = un statut)
  const filteredOrders = useMemo(() => {
    const tab = ORDER_TABS.find((t) => t.label === activeTab);
    if (!tab?.status) return allOrders;
    return allOrders.filter((o) => o.status === tab.status);
  }, [activeTab, allOrders]);

  const countByStatus = useMemo(() => {
    const counts = { pending: 0, processing: 0, shipped: 0, in_transit: 0, delivered: 0, cancelled: 0, returned: 0, partially_returned: 0 };
    allOrders.forEach((o) => { if (counts[o.status] !== undefined) counts[o.status]++; });
    return counts;
  }, [allOrders]);

  return { activeTab, setActiveTab, filteredOrders, countByStatus, isLoading, error };
}
