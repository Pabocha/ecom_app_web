import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shopFollowService } from '../services/shopFollowService';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const FOLLOWED_SHOPS_QUERY_KEY = ['followed-shops'];
const followStateKey = (shopId) => ['is-followed', shopId];

export function useFollowedShops() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: FOLLOWED_SHOPS_QUERY_KEY,
    queryFn: () => shopFollowService.getFollowedShops(),
    select: (res) => res.data?.results ?? res.data ?? [],
    enabled: isAuthenticated,
  });
}

export function useFollowState(shopId) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: followStateKey(shopId),
    queryFn: () => shopFollowService.isFollowed(shopId),
    select: (res) => ({ followed: res.data?.followed ?? false, total: res.data?.total_follow ?? 0 }),
    enabled: isAuthenticated && !!shopId,
    staleTime: 30 * 1000,
  });
}

export function useToggleFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shopId) => shopFollowService.toggleFollow(shopId),
    onMutate: async (shopId) => {
      await queryClient.cancelQueries({ queryKey: followStateKey(shopId) });
      const previous = queryClient.getQueryData(followStateKey(shopId));
      if (previous) {
        queryClient.setQueryData(followStateKey(shopId), {
          followed: !previous.followed,
          total: Math.max(previous.total + (previous.followed ? -1 : 1), 0),
        });
      }
      return { shopId, previous };
    },
    onError: (_err, shopId, context) => {
      if (context) queryClient.setQueryData(followStateKey(context.shopId), context.previous);
    },
    onSettled: (_data, _error, shopId) => {
      queryClient.invalidateQueries({ queryKey: FOLLOWED_SHOPS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: followStateKey(shopId) });
    },
  });
}
