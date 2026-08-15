import api from '@/services/api';

export const reviewService = {
  getProductReviews: (productId, params = {}) =>
    api.get('/v1/comments/products/', { params: { product: productId, ...params } }),

  getProductReviewsByShop: (shopId, params = {}) =>
    api.get('/v1/comments/products/by-shop/', { params: { shop: shopId, ...params } }),

  // AJOUT — Statut d'avis des produits d'une commande livrée
  getOrderReviewStatus: (orderId) =>
    api.get('/v1/comments/products/order-review-status/', { params: { order: orderId } }),

  // AJOUT — Soumettre un avis (note + commentaire) sur un produit d'une commande livrée
  submitProductReview: (data) => api.post('/v1/comments/products/', data),
};
