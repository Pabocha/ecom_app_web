import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { shippingMethods } from '@/data/shippingMethods';
import { cartService } from '@/features/cart/services/cartService';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { usePaymentMethods } from '@/features/payment/hooks/usePaymentMethods';
import { resolveCountry } from '@/features/payment/utils/helpers';

export function useCheckout({ cartItems = [], country } = {}) {
  const [couponResult, setCouponResult] = useState(null);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const location = useLocation();

  // AJOUT — Moyens de paiement dynamiques depuis le backend, filtrés par pays
  const { user } = useAuth();
  const resolvedCountry = country || resolveCountry(user?.country);
  const { methods: paymentMethods } = usePaymentMethods({ country: resolvedCountry });

  const selectedPayment = location.state?.selectedPayment || paymentMethods[0]?.id || 'wave';
  const paymentMethod = paymentMethods.find(method => method.id === selectedPayment) || paymentMethods[0] || null;

  // MODIFICATION ICI — Supprimé shipping/serviceFee locaux (calculés par le backend via preview)
  const checkoutTotals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    return {
      subtotal,
      totalQty: cartItems.reduce((sum, item) => sum + item.qty, 0),
    };
  }, [cartItems]);

  const couponMutation = useMutation({
    mutationFn: ({ couponCode, deliveryCost, cartItemIds }) => {
      const payload = { coupon_code: couponCode };
      if (deliveryCost != null) payload.delivery_cost = deliveryCost;
      if (cartItemIds?.length) payload.cart_item_ids = cartItemIds;
      return cartService.previewCouponCart(payload);
    },
    onSuccess: (response) => {
      const data = response?.data || response;
      const discount = data?.total_discount || data?.discount_on_items || data?.discount_amount || data?.discount || data?.amount || 0;
      setCouponResult({
        valid: data?.coupon_valid ?? data?.valid ?? !data?.error,
        message: data?.message || (data?.coupon_valid ? 'Code promo appliqué.' : 'Code promo invalide.'),
        discount: Number(discount),
        couponCode: data?.coupon_code ?? '',
        couponId: data?.coupon_id ?? null,
        discountType: data?.discount_type ?? null,
        discountValue: data?.discount_value ?? null,
        scope: data?.scope ?? null,
        discountOnItems: data?.discount_on_items ?? null,
        discountOnShipping: data?.discount_on_shipping ?? null,
        eligibleSubtotal: data?.eligible_subtotal ?? null,
        totalAfterDiscount: data?.total_after_discount ?? null,
        selectedItemsCount: data?.selected_items_count ?? null,
      });
    },
    onError: (error) => {
      setCouponResult({
        valid: false,
        message: error?.response?.data?.detail || error?.response?.data?.message || 'Code promo invalide.',
        discount: 0,
      });
    },
  });

  return {
    items: cartItems,
    selectedPayment,
    paymentMethod,
    paymentMethods, // AJOUT — liste dynamique
    shippingMethod,
    setShippingMethod,
    shippingMethods,
    couponMutation,
    couponResult,
    ...checkoutTotals,
  };
}
