import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { marketingService } from '../services/marketingService';

export const BANNERS_QUERY_KEY = ['banners'];
export const ANNOUNCEMENTS_QUERY_KEY = ['announcements'];
export const FLASH_SALES_QUERY_KEY = ['flash-sales'];

const FLASH_STALE_TIME = 2 * 24 * 60 * 60 * 1000; // 2 jours

const DAY_MS = 24 * 60 * 60 * 1000;

function getDelayToNextRefresh() {
  const now = Date.now();
  const currentUtcDay = Math.floor(now / DAY_MS);
  // L'API renouvelle la vente flash les jours pairs (toordinal UTC).
  // toordinal(1970-01-01) = 719163 (impair) => jour pair toordinal <=> jour UTC impair.
  let targetUtcDay = currentUtcDay + 1;
  while (targetUtcDay % 2 === 0) targetUtcDay += 1;
  return targetUtcDay * DAY_MS - now;
}

let refreshTimerStarted = false;

function startFlashRefreshScheduler(queryClient) {
  if (refreshTimerStarted) return;
  refreshTimerStarted = true;
  const schedule = () => {
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: FLASH_SALES_QUERY_KEY });
      schedule();
    }, getDelayToNextRefresh());
  };
  schedule();
}

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

export function useFlashSales(limit = 20) {
  const queryClient = useQueryClient();

  useEffect(() => {
    startFlashRefreshScheduler(queryClient);
  }, [queryClient]);

  return useQuery({
    queryKey: [...FLASH_SALES_QUERY_KEY, limit],
    queryFn: () => marketingService.getFlashSales(limit),
    select: (res) => res.data || [],
    staleTime: FLASH_STALE_TIME,
  });
}

export function useFlashSaleByProduct(productId) {
  return useQuery({
    queryKey: ['flash-sale-by-product', productId],
    queryFn: () => marketingService.getFlashSaleByProduct(productId),
    select: (res) => res.data || [],
    enabled: !!productId,
    staleTime: 60 * 1000,
  });
}
