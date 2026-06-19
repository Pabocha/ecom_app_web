import api from '@/services/api';

export const profileService = {
  updateMe: (data) => api.patch('/v1/accounts/users/me/', data),
  changePassword: (data) => api.post('/v1/auth/change-password/', data),
};
