import api from '@/services/api';

export const paymentService = {
  getPaymentMethods: (country) =>
    api.get('/v1/payments/methods/', {
      params: country ? { country } : {},
    }),
};
