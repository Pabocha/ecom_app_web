import api from "@/services/api";

export const authService = {
    login:    (data) => api.post('/v1/auth/token/', data),
    register: (data) => api.post('/v1/accounts/users/', data),
    logout:   () => api.post('/v1/auth/logout/'),
    me:       () => api.get('/v1/accounts/users/me/'),
    updateMe: (data) => api.patch('/v1/accounts/users/me/'),
    desactivateAccount: () => api.post('/v1/accounts/users/desactivate'), 
}
