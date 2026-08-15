import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../services/chatService';
import { useAuthStore } from '@/stores/authStore';

export function useConversations() {
  const userId = useAuthStore((s) => s.user?.id);
  const query = useQuery({
    queryKey: ['chat-conversations'],
    queryFn: async () => {
      const res = await chatService.getConversations();
      return res?.data || [];
    },
    enabled: !!userId,
    refetchInterval: userId ? 30000 : false,
  });

  const unreadTotal = useMemo(
    () => (query.data || []).reduce((sum, c) => sum + (c.unread_count || 0), 0),
    [query.data],
  );

  return { ...query, conversations: query.data || [], unreadTotal };
}

export function useOpenVendorChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ members, productId }) => chatService.openChat(members, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-conversations'] });
    },
  });
}
