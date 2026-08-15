import api from '@/services/api';

export const shopService = {
  getShops: (params) => api.get('/v1/shop/shop-list/', { params }),
};
