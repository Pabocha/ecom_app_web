import { useQuery } from '@tanstack/react-query';
import { paymentService } from '@/features/payment/services/paymentService';
import { normalizePaymentMethods } from '@/features/payment/utils/helpers';
import { paymentMethods as staticPaymentMethods } from '@/data/paymentMethod';

// AJOUT — Récupère les moyens de paiement depuis le backend, filtrés par pays.
// Fallback sur la liste statique si l'API échoue (défensif).
export function usePaymentMethods({ country } = {}) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['payment-methods', country],
    queryFn: () => paymentService.getPaymentMethods(country),
    staleTime: 5 * 60_000,
    retry: 1,
  });

  const apiResponse = data?.data ?? data ?? null;
  const apiMethods = Array.isArray(apiResponse) ? apiResponse : [];

  const methods =
    apiMethods.length > 0
      ? normalizePaymentMethods(apiMethods)
      : normalizePaymentMethods(staticPaymentMethods);

  return {
    methods,
    isLoading: isLoading && apiMethods.length === 0,
    isError,
    error,
    refetch,
  };
}
