import { useMemo } from 'react';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/reviewService';
import { orderService } from '@/features/order/services/orderService';

export function useOrderReviewStatus(orderId, { enabled = true } = {}) {
  return useQuery({
    queryKey: ['order-review-status', orderId],
    queryFn: async () => {
      const res = await reviewService.getOrderReviewStatus(orderId);
      return res?.data || null;
    },
    enabled: !!orderId && enabled,
    select: (data) => ({
      products: data?.products || [],
      shops: data?.shops || [],
    }),
  });
}

export function useSubmitProductReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewService.submitProductReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-review-status'] });
      queryClient.invalidateQueries({ queryKey: ['product-reviews-by-shop'] });
      queryClient.invalidateQueries({ queryKey: ['product-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });
}

// AJOUT — Compose les commandes livrées + leur statut d'avis pour le profil
export function usePendingReviews() {
  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await orderService.getOrder();
      return res?.data?.results || res?.data || [];
    },
  });

  const deliveredOrders = useMemo(
    () => (ordersQuery.data || []).filter((o) => o.status === 'delivered'),
    [ordersQuery.data],
  );

  const statuses = useQueries({
    queries: deliveredOrders.map((order) => ({
      queryKey: ['order-review-status', order.id],
      queryFn: () => reviewService.getOrderReviewStatus(order.id),
      enabled: ordersQuery.isSuccess,
    })),
  });

  const isLoading = ordersQuery.isLoading || statuses.some((q) => q.isLoading);

  const pendingItems = useMemo(() => {
    const items = [];
    deliveredOrders.forEach((order, index) => {
      const data = statuses[index]?.data?.data || statuses[index]?.data || null;
      const products = data?.products || [];
      products.forEach((entry) => {
        if (entry?.has_review) return;
        const orderItemId = entry.order_item_ids?.[0] ?? null;
        items.push({
          key: `${order.id}-${entry.product?.id}`,
          orderId: order.id,
          orderNumber: order.order_number || order.id,
          productId: entry.product?.id,
          productName: entry.product?.name || 'Produit',
          productImage: entry.product?.image || null,
          orderItemId,
        });
      });
    });
    return items;
  }, [deliveredOrders, statuses]);

  return {
    pendingItems,
    deliveredOrders,
    isLoading,
    isError: ordersQuery.isError,
  };
}
