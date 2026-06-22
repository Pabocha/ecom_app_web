import api from '@/services/api';

// function toQueryString(params) {
//   const entries = Object.entries(params).filter(([_, v]) => v);
//   if (entries.length === 0) return '';
//   return '?' + entries.map(([k]) => encodeURIComponent(k)).join('&');
// }

export const productService = {
    getProducts: (params = {}) => api.get('/v1/products/', {params}),
    getProductById: (id) => api.get(`/v1/products/${id}`),
    getRecommendations: (params = {}) => api.get('/v1/products/recommendations/' + toQueryString(params)),
    getProductPromotions: () => api.get('/v1/products/promotions/'),
    searchProduct: (query) => api.get('/v1/products/search/', { params: { q: query } }),
    searchAutocomplete: (query) => api.get('/v1/products/search/autocomplete/', { params: { q: query } }),

}