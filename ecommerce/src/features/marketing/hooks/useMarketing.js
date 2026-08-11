import { useQuery } from '@tanstack/react-query';
import { marketingService } from '../services/marketingService';

export const BANNERS_QUERY_KEY = ['banners'];
export const ANNOUNCEMENTS_QUERY_KEY = ['announcements'];

export function useBannersByType(type) {
  return useQuery({
    queryKey: [...BANNERS_QUERY_KEY, type],
    queryFn: () => marketingService.getBanners(type),
    select: (res) => res.data?.results || res.data || [],
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnnouncements() {
  return useQuery({
    queryKey: ANNOUNCEMENTS_QUERY_KEY,
    queryFn: () => marketingService.getAnnouncements(),
    select: (res) => res.data?.results || res.data || [],
    staleTime: 5 * 60 * 1000,
  });
}
