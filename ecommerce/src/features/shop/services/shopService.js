import api from '@/services/api';

export const shopService = {
  getShops: (params) => api.get('/v1/shop/list/', { params }),
  trackVisit: (shopId) => api.post(`/v1/shop/public/${shopId}/visit/`),
};
