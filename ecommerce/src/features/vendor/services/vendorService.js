import api from "@/services/api";

export const vendorService = {
    register: (data, config) => api.post('/v1/accounts/sellers/create_seller_account/', data, config),
    getMyVendor: () => api.get('/v1/accounts/sellers/me/'),
    updateMyVendor: (data) => api.patch('/v1/accounts/sellers/me/'),
    desactivateVendor: () => api.post('/v1/accounts/sellers/desactivate/'), 
}
