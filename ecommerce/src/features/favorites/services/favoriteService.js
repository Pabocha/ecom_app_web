import api from '@/services/api';

export const favoriteService = {
  getFavorites: () => api.get('/v1/favorites/'),
  isFavorite: (productId) => api.get('/v1/favorites/is_favorite/', { params: { product_id: productId } }),
  toggle: (productId) => api.post('/v1/favorites/toggle/', { product_id: productId }),
};
