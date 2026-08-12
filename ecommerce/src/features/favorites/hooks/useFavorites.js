import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoriteService } from '../services/favoriteService';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useUIStore } from '@/stores/uiStore';

export const FAVORITES_QUERY_KEY = ['favorites'];
const favoriteStateKey = (productId) => ['is-favorite', productId];

export function useFavorites() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: () => favoriteService.getFavorites(),
    select: (res) => res.data?.results ?? res.data ?? [],
    enabled: isAuthenticated,
  });
}

export function useFavoriteState(productId) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: favoriteStateKey(productId),
    queryFn: () => favoriteService.isFavorite(productId),
    select: (res) => res.data?.favorited ?? false,
    enabled: isAuthenticated && !!productId,
    staleTime: 30 * 1000,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId) => favoriteService.toggle(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: favoriteStateKey(productId) });
      const previous = queryClient.getQueryData(favoriteStateKey(productId));
      queryClient.setQueryData(favoriteStateKey(productId), !(previous ?? false));
      return { productId, previous };
    },
    onError: (_err, productId, context) => {
      if (context) queryClient.setQueryData(favoriteStateKey(context.productId), context.previous);
    },
    onSettled: (_data, _error, productId) => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: favoriteStateKey(productId) });
    },
  });
}

export function useFavoriteCards() {
  const { isAuthenticated } = useAuth();
  const { data: favorites = [] } = useFavorites();
  const { mutate: toggle } = useToggleFavorite();

  const favoritedIds = useMemo(
    () => new Set((favorites || []).map(f => f.product?.id).filter(Boolean)),
    [favorites],
  );

  const isFavorited = (id) => favoritedIds.has(id);

  const toggleFavorite = (product) => {
    if (!isAuthenticated) {
      useUIStore.getState().openLoginModal();
      return;
    }
    toggle(product?.id);
  };

  return { favoritedIds, isFavorited, toggleFavorite };
}
