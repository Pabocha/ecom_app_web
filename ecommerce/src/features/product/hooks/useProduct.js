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

export function useRecommendations(params = {}) {
  return useQuery({
    queryKey: ["product-recommendations", params],
    queryFn: () => productService.getRecommendations(params),
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