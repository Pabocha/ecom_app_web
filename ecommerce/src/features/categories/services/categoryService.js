import api from '@/services/api';

export const categoryService = {
  getHierarchy: () => api.get('/v1/categories/hierarchy/', { params: { type: 'product' } }),
};
