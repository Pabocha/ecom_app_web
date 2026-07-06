import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { paymentMethods } from '@/data/paymentMethod';
import { cartService } from '@/features/cart/services/cartService';
import { useMutation } from '@tanstack/react-query';

export function useCheckout({ cartItems = [] } = {}) {
  const [couponResult, setCouponResult] = useState(null);
  const location = useLocation();
  const selectedPayment = location.state?.selectedPayment || 'wave';
  const paymentMethod = paymentMethods.find(method => method.id === selectedPayment) || paymentMethods[0];

  const checkoutTotals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = subtotal >= 50000 || subtotal === 0 ? 0 : 2500;
    const serviceFee = subtotal > 0 ? Math.round(subtotal * 0.012) : 0;

    return {
      subtotal,
      shipping,
      serviceFee,
      total: Math.max(0, subtotal + shipping + serviceFee),
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
      console.log('Coupon preview response:', data);
      const discount = data?.total_discount || data?.discount_on_items || data?.discount_amount || data?.discount || data?.amount || 0;
      setCouponResult({
        valid: data?.coupon_valid ?? data?.valid ?? !data?.error,
        message: data?.message || (data?.coupon_valid ? 'Code promo appliqué.' : 'Code promo invalide.'),
        discount: Number(discount),
        couponCode: data?.coupon_code ?? '',
        couponId: data?.coupon_id ?? null,
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
    couponMutation,
    couponResult,
    ...checkoutTotals,
  };
}
