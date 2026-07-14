import api from '@/services/api';

export const profileService = {
  updateMe: (data) => api.patch('/v1/accounts/users/me/', data),
  changePassword: (data) => api.post('/v1/auth/change-password/', data),
  getAddressUser: () => api.get('/v1/accounts/addresses/'),
  addAddressUser: (data) => api.post('/v1/accounts/addresses/', data),
  updateAddressUser: (id, data) => api.patch(`/v1/accounts/addresses/${id}/`, data),
  deleteAddressUser: (id) => api.delete(`/v1/accounts/addresses/${id}/`),
};
