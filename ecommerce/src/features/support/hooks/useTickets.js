import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '../services/ticketService';

export const TICKETS_QUERY_KEY = ['support-tickets'];

export function useMyTickets() {
  return useQuery({
    queryKey: TICKETS_QUERY_KEY,
    queryFn: async () => {
      const res = await ticketService.getMyTickets();
      return res?.data || [];
    },
  });
}

export function useTicket(ticketId) {
  return useQuery({
    queryKey: [...TICKETS_QUERY_KEY, ticketId],
    queryFn: async () => {
      const res = await ticketService.getTicket(ticketId);
      return res?.data || null;
    },
    enabled: !!ticketId,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => ticketService.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TICKETS_QUERY_KEY });
    },
  });
}

export function useReplyTicket(ticketId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (message) => ticketService.replyTicket(ticketId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...TICKETS_QUERY_KEY, ticketId] });
      queryClient.invalidateQueries({ queryKey: TICKETS_QUERY_KEY });
    },
  });
}
