import api from '@/services/api'

export const orderService = {
  placeOrder: (data) => api.post('/v1/orders/create/', data),
  getOrder: () => api.get(`/v1/orders/my-orders/`),
  getOrderDetails: (id) => api.get(`/v1/orders/${id}/`),
  payOrder: (id, data) => api.post(`/v1/orders/${id}/pay/`, data),
  updateOrderStatus: (id, data) => api.patch(`/v1/orders/${id}/update-status/`, data),
}