import { useInfiniteQuery } from '@tanstack/react-query';
import { reviewService } from '../services/reviewService';

function getNextPageParam(lastPage) {
  const next = lastPage?.data?.next;
  if (!next) return undefined;
  try {
    return Number(new URL(next).searchParams.get('page')) || undefined;
  } catch {
    return undefined;
  }
}

export function useProductReviews(productId, options = {}) {
  return useInfiniteQuery({
    queryKey: ['product-reviews', productId],
    queryFn: ({ pageParam = 1 }) => reviewService.getProductReviews(productId, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam,
    enabled: !!productId,
    select: (data) => {
      const pages = data?.pages ?? [];
      const last = pages[pages.length - 1]?.data ?? {};
      return {
        reviews: pages.flatMap((p) => p?.data?.results ?? []),
        hasNextPage: !!last?.next,
      };
    },
    ...options,
  });
}

export function useProductReviewsByShop(shopId, options = {}) {
  return useInfiniteQuery({
    queryKey: ['product-reviews-by-shop', shopId],
    queryFn: ({ pageParam = 1 }) => reviewService.getProductReviewsByShop(shopId, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam,
    enabled: !!shopId,
    select: (data) => {
      const pages = data?.pages ?? [];
      const last = pages[pages.length - 1]?.data ?? {};
      return {
        reviews: pages.flatMap((p) => p?.data?.results ?? []),
        hasNextPage: !!last?.next,
      };
    },
    ...options,
  });
}
