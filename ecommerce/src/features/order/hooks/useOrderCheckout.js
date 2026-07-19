import { useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { orderService } from '@/features/order/services/orderService';

// MODIFICATION ICI — Helper pour construire les order_lines depuis les items panier
// Uniquement variant OU product, jamais les deux (le backend rejette null)
function buildOrderLines(items = []) {
  return items.map((item) => {
    if (item.is_variant_item) {
      return { variant: item.variant_id, quantity: item.qty };
    }
    return { product: item.id, quantity: item.qty };
  });
}

export function useOrderCheckout({
  cartItems = [],
  selectedAddress,
  paymentMethod,
  shippingMethod = 'standard',
  couponCode = '',
  couponDiscount = 0,
  clearMutation,
} = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const orderLines = useMemo(() => buildOrderLines(cartItems), [cartItems]);

  // MODIFICATION ICI — Preview mutation (étape 1 : valider et récupérer les totaux backend)
  const previewMutation = useMutation({
    mutationFn: () => {
      if (!selectedAddress?.id || !orderLines.length) return Promise.reject(new Error('Adresse ou articles manquants'));
      return orderService.previewOrder({
        origin_address: selectedAddress.id,
        shipping_method: shippingMethod,
        discount: couponDiscount || 0,
        coupon_code: couponCode || '',
        order_lines: orderLines,
      });
    },
  });

  const previewData = previewMutation?.data?.data || previewMutation?.data || null;

  // MODIFICATION ICI — Submit mutation (étape 2+3 : créer la commande puis payer)
  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAddress?.id) throw new Error('Veuillez sélectionner une adresse de livraison');
      if (!paymentMethod?.apiId) throw new Error('Veuillez sélectionner un moyen de paiement');
      if (!orderLines.length) throw new Error('Aucun article à commander');

      const createPayload = {
        origin_address: selectedAddress.id,
        shipping_method: shippingMethod,
        discount: couponDiscount || 0,
        coupon_code: couponCode || '',
        order_lines: orderLines,
      };

      // Étape 2 — Créer la commande
      console.log(createPayload);
      const createResp = await orderService.placeOrder(createPayload);
      const order = createResp?.data || createResp;

      if (!order?.id) throw new Error('Réponse invalide du serveur lors de la création');

      // Étape 3 — Payer la commande
      const payPayload = {
        payment_method: [paymentMethod.apiId],
        first_name: selectedAddress.first_name || '',
        last_name: selectedAddress.last_name || '',
        phone_number: selectedAddress.phone_number || '',
      };

      await orderService.payOrder(order.id, payPayload);

      return order;
    },
    onSuccess: async (order) => {
      // Vider le panier
      if (clearMutation) {
        try {
          await clearMutation.mutateAsync();
        } catch {
          // Ignorer l'échec du clear panier
        }
      }
      queryClient.invalidateQueries({ queryKey: ['cart-items'] });
      navigate('/order-success', { replace: true, state: { orderId: order.id, orderNumber: order.order_number } });
    },
  });

  return {
    orderLines,
    previewMutation,
    previewData,
    submitMutation,
    submitOrder: submitMutation.mutate,
    isPending: submitMutation.isPending,
    error: submitMutation.error?.response?.data?.detail || submitMutation.error?.message || null,
  };
}
