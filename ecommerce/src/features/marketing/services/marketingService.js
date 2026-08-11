import api from '@/services/api';

export const marketingService = {
  getBanners: (type) => api.get('/v1/marketing/banners/', { params: { type } }),

  getAnnouncements: () => api.get('/v1/marketing/announcements/'),

  getFlashSales: (limit = 20) => api.get('/v1/marketing/flash-sales/products/', { params: { limit } }),

  getFlashSaleByProduct: (productId) => api.get(`/v1/marketing/flash-sales/by-product/${productId}/`),
};
