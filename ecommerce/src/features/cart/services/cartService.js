import api from '@/services/api.js'

export const cartService = {
    getCartItems: () => api.get('/v1/cart/'),
    addCartItems: (data) => api.post('/v1/cart/add/', data),
    changeQuantityItem: (data) => api.patch('/v1/cart/change-quantity/', data),
    removeCartItem: (data) => api.delete('/v1/cart/remove-product/', data),
    clearCart: () => api.delete('/v1/cart/clear/'),
    previewCouponCart: (data) => api.post('/v1/cart/preview-coupon/'),
}