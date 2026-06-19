import api from "@/services/api";

export const vendorService = {
    register: (data, config) => api.post('/compte/seller-account/', data, config),
    getMyVendor: () => api.get('/compte/seller-account/me/'),
    updateMyVendor: (data) => api.patch('/compte/seller-account/me/'),
    desactivateVendor: () => api.post('/compte/seller-account/desactivate'), 
}
