import api from '@/services/api';

export const shopFollowService = {
  getFollowedShops: () => api.get('/v1/accounts/shops/followed/'),
  isFollowed: (shopId) => api.get(`/v1/shop/follow/${shopId}/is-followed/`),
  toggleFollow: (shopId) => api.post(`/v1/accounts/shops/${shopId}/toggle-follow/`),
};
