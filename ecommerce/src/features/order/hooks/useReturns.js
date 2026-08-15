import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/orderService';

export function useReturnableItems() {
  return useQuery({
    queryKey: ['returnable-items'],
    queryFn: async () => {
      const res = await orderService.getReturnableItems();
      return res?.data || [];
    },
  });
}

export function useReturns() {
  return useQuery({
    queryKey: ['returns'],
    queryFn: async () => {
      const res = await orderService.getReturnRequests();
      return res?.data?.results || res?.data || [];
    },
  });
}

export function useCreateReturn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderService.createReturnRequest,
    onSuccess: (response) => {
      const returnOrderId = response?.data?.order;
      queryClient.invalidateQueries({ queryKey: ['returns'] });
      queryClient.invalidateQueries({ queryKey: ['returnable-items'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      if (returnOrderId) {
        queryClient.invalidateQueries({ queryKey: ['order', returnOrderId] });
      }
    },
  });
}
