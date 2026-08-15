import { useInfiniteQuery } from '@tanstack/react-query';
import { shopService } from '../services/shopService';

function getNextPageParam(lastPage) {
  const next = lastPage?.data?.next;
  if (!next) return undefined;
  try {
    return Number(new URL(next).searchParams.get('page')) || undefined;
  } catch {
    return undefined;
  }
}

export function useShops({ productsPerShop = 4 } = {}) {
  return useInfiniteQuery({
    queryKey: ['shops', productsPerShop],
    queryFn: ({ pageParam = 1 }) =>
      shopService.getShops({ products_per_shop: productsPerShop, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam,
    select: (data) => {
      const pages = data?.pages ?? [];
      const last = pages[pages.length - 1]?.data ?? {};
      return {
        shops: pages.flatMap((p) => p?.data?.results ?? []),
        count: last?.count ?? 0,
        hasNextPage: !!last?.next,
      };
    },
  });
}
