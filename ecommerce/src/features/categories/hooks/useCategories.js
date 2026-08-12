import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../services/categoryService';

export const CATEGORY_HIERARCHY_QUERY_KEY = ['category-hierarchy'];

export function useCategoryHierarchy() {
  return useQuery({
    queryKey: CATEGORY_HIERARCHY_QUERY_KEY,
    queryFn: () => categoryService.getHierarchy(),
    select: (res) => res.data || [],
    staleTime: 5 * 60 * 1000,
  });
}

export function findCategoryBySlug(hierarchy, slug) {
  if (!slug) return null;
  for (const parent of hierarchy || []) {
    if (parent.slug === slug) return parent;
    const child = (parent.children || []).find(c => c.slug === slug);
    if (child) return child;
  }
  return null;
}
