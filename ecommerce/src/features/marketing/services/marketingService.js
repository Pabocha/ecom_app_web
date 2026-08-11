import api from '@/services/api';

export const marketingService = {
  getBanners: (type) => api.get('/v1/marketing/banners/', { params: { type } }),

  getAnnouncements: () => api.get('/v1/marketing/announcements/'),
};
