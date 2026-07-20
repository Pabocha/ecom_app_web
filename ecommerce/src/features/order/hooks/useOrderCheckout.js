import { useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { orderService } from '@/features/order/services/orderService';

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
  transportMode = 'road',
  couponCode = '',
  couponDiscount = 0,
  paymentDetails = {},
  clearMutation,
} = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const orderLines = useMemo(() => buildOrderLines(cartItems), [cartItems]);

  const previewMutation = useMutation({
    mutationFn: () => {
      if (!selectedAddress?.id || !orderLines.length) return Promise.reject(new Error('Adresse ou articles manquants'));
      return orderService.previewOrder({
        origin_address: selectedAddress.id,
        shipping_method: shippingMethod,
        transport_mode: transportMode,
        discount: couponCode ? 0 : (couponDiscount || 0),
        coupon_code: couponCode || '',
        order_lines: orderLines,
      });
    },
  });

  const previewData = previewMutation?.data?.data || previewMutation?.data || null;
  const isInternational = previewData?.shipping?.is_international ?? false;

  const effectiveTransportMode = useMemo(() => {
    if (isInternational && transportMode === 'road') return 'sea';
    if (!isInternational && transportMode !== 'road') return 'road';
    return transportMode;
  }, [isInternational, transportMode]);

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAddress?.id) throw new Error('Veuillez sélectionner une adresse de livraison');
      if (!paymentMethod?.apiId) throw new Error('Veuillez sélectionner un moyen de paiement');
      if (!orderLines.length) throw new Error('Aucun article à commander');
      if (!paymentDetails.first_name?.trim()) throw new Error('Le prénom est requis pour le paiement');
      if (!paymentDetails.last_name?.trim()) throw new Error('Le nom est requis pour le paiement');
      if (!paymentDetails.phone_number?.trim()) throw new Error('Le numéro de téléphone est requis pour le paiement');

      const createPayload = {
        origin_address: selectedAddress.id,
        shipping_method: isInternational ? null : shippingMethod,
        transport_mode: transportMode,
        discount: couponCode ? 0 : (couponDiscount || 0),
        coupon_code: couponCode || '',
        order_lines: orderLines,
      };

      const createResp = await orderService.placeOrder(createPayload);
      const order = createResp?.data || createResp;

      if (!order?.id) throw new Error('Réponse invalide du serveur lors de la création');

      const payPayload = {
        payment_method: [paymentMethod.apiId],
        first_name: paymentDetails.first_name.trim(),
        last_name: paymentDetails.last_name.trim(),
        phone_number: paymentDetails.phone_number.trim(),
      };

      await orderService.payOrder(order.id, payPayload);

      return order;
    },
    onSuccess: async (order) => {
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
    onError: async (error, _variables, context) => {
      if (context?.orderId) {
        navigate('/profile/orders/' + context.orderId, {
          replace: true,
          state: { error: 'Le paiement a échoué. Veuillez réessayer depuis la page de la commande.' },
        });
      }
    },
  });

  return {
    orderLines,
    previewMutation,
    previewData,
    effectiveTransportMode,
    submitMutation,
    submitOrder: submitMutation.mutate,
    isPending: submitMutation.isPending,
    error: submitMutation.error?.response?.data?.detail || submitMutation.error?.message || null,
  };
}
