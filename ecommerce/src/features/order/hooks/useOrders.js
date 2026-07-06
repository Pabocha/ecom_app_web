import { useMemo, useState } from 'react';
import { mockOrders } from '@/features/order/data/orderData';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from '@/features/order/services/orderService';
import { useNavigate } from 'react-router-dom';

export function useOrders({ clearMutation } = {}) {
  const [activeTab, setActiveTab] = useState('Toutes');

  const filteredOrders = useMemo(() => {
    if (activeTab === 'Toutes') return mockOrders;
    const statusMap = { 'En cours': 'pending', 'Livrées': 'delivered', 'Annulées': 'cancelled' };
    return mockOrders.filter(o => o.status === statusMap[activeTab]);
  }, [activeTab]);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const countByStatus = useMemo(() => {
    const counts = { pending: 0, delivered: 0, cancelled: 0 };
    mockOrders.forEach(o => { counts[o.status]++ });
    return counts;
  }, []);

  const orderMutation = useMutation({
    mutationFn: (payload) => orderService.placeOrder(payload),
    onSuccess: async () => {
      if (clearMutation) {
        try {
          await clearMutation.mutateAsync();
        } catch {
          // Ignore clear cart failure and continue navigation.
        }
      }

      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
      navigate('/order-success', { replace: true });
    },
  });

  return { activeTab, setActiveTab, filteredOrders, countByStatus, orderMutation };
}
