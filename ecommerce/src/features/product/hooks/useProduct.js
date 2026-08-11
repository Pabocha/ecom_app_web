import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import { productService } from "@/features/product/services/productService";

export function useProducts(params = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productService.getProducts(params),
    placeholderData: keepPreviousData,
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  });
}

// MODIFICATION ICI — options: enabled, staleTime, etc. (backwards-compatible)
export function useRecommendations(params = {}, options = {}) {
  return useQuery({
    queryKey: ["product-recommendations", params],
    queryFn: () => productService.getRecommendations(params),
    ...options,
  });
}

export function useProductPromotions() {
  return useQuery({
    queryKey: ["product-promotions"],
    queryFn: () => productService.getProductPromotions(),
  });
}

export function useSearchProduct() {
  return useMutation({
    mutationFn: (query) => productService.searchProduct(query),
  });
}

export function useSearchAutocomplete() {
  return useMutation({
    mutationFn: (query) => productService.searchAutocomplete(query),
  });
}

export function useProductVariant(id) {
  return useQuery({
    queryKey: ["product-variant", id],
    queryFn: () => productService.getProductVariant(id),
    enabled: !!id,
  })
}

export function useProductDetailShop(shopId) {
  return useQuery({
    queryKey: ["detail-shop", shopId],
    queryFn: () => productService.getProductDetailShop(shopId),
    enabled: !!shopId,
  })
}

export function useRecentlyViewed() {
  return useQuery({
    queryKey: ["recently-viewed"],
    queryFn: () => productService.getRecentlyViewed(),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}

export function useAddRecentlyViewed() {
  return useMutation({
    mutationFn: (productId) => productService.addRecentlyViewed(productId),
  });
}

export function useProductsByCategorySlug(slug) {
  return useQuery({
    queryKey: ["products-by-category-slug", slug],
    queryFn: () => productService.getProductsByCategorySlug(slug),
    enabled: !!slug,
  });
}
