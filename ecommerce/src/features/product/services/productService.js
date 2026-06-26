import api from '@/services/api';

export const productService = {
    getProducts: (params = {}) => api.get('/v1/products/', {params}),
    getProductById: (id) => api.get(`/v1/products/${id}`),
    getRecommendations: (params = {}) => api.get('/v1/products/recommendations/', {params}),
    getProductPromotions: () => api.get('/v1/products/promotions/'),
    searchProduct: (query) => api.get('/v1/products/search/', { params: { q: query } }),
    searchAutocomplete: (query) => api.get('/v1/products/search/autocomplete/', { params: { q: query } }),
    getProductVariant: (id) => api.get(`/v1/products/${id}/variants-list/`),
    getProductDetailShop: (shopId) => api.get(`/v1/shop/${shopId}/public-detail/`),

    // # ---------------- praties images product
    getProductGallery: (id) => api.get(`/v1/products/${id}/gallery/`)

}