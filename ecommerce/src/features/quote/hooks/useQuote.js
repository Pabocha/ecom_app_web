import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createQuote,
  getQuote,
  getMyQuotes,
  acceptQuote,
  counterQuote,
  rejectQuote,
  checkoutQuote,
  payQuotePreview,
  payQuoteByToken,
  updateQuote,
  sendQuote,
  sellerCounterQuote,
  sellerRejectQuote,
  generatePaymentLink,
  getSellerQuotes,
} from '@/features/quote/services/quoteService';

// MODIFICATION ICI — Hooks devis (création, acceptation, contre-proposition, paiement)
export const QUOTE_QUERY_KEY = (id) => ['quote', id];

export function useQuote(id) {
  return useQuery({
    queryKey: QUOTE_QUERY_KEY(id),
    queryFn: () => getQuote(id),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}

// Hook lié au chat : le devis actif d'une room (renouvelé à chaque événement WS 'quote')
export function useRoomQuote({ roomMeta } = {}) {
  const queryClient = useQueryClient();
  const quoteId = roomMeta?.active_quote_id;

  const { data, isLoading, isError } = useQuery({
    queryKey: QUOTE_QUERY_KEY(quoteId),
    queryFn: () => getQuote(quoteId),
    enabled: Boolean(quoteId),
    staleTime: 0,
  });

  const refresh = () => {
    if (quoteId) {
      queryClient.invalidateQueries({ queryKey: QUOTE_QUERY_KEY(quoteId) });
    }
  };

  return {
    quote: data ?? null,
    quoteId,
    role: roomMeta?.current_user_quote_role ?? null,
    canGeneratePaymentLink: roomMeta?.can_generate_payment_link ?? false,
    isLoading,
    isError,
    refresh,
  };
}

export function useQuoteMutations(roomId) {
  const queryClient = useQueryClient();

  const invalidateQuote = (quoteId) => {
    if (quoteId) queryClient.invalidateQueries({ queryKey: QUOTE_QUERY_KEY(quoteId) });
    if (roomId) queryClient.invalidateQueries({ queryKey: ['room-quote', roomId] });
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
    queryClient.invalidateQueries({ queryKey: ['my-quotes'] });
  };

  const createMutation = useMutation({
    mutationFn: createQuote,
    onSuccess: (quote) => {
      invalidateQuote(quote?.id);
      queryClient.invalidateQueries({ queryKey: ['room-meta'] });
    },
  });

  const acceptMutation = useMutation({
    mutationFn: (id) => acceptQuote(id),
    onSuccess: (quote) => invalidateQuote(quote?.id),
  });

  const counterMutation = useMutation({
    mutationFn: ({ id, payload }) => counterQuote(id, payload),
    onSuccess: (quote) => invalidateQuote(quote?.id),
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => rejectQuote(id),
    onSuccess: (quote) => invalidateQuote(quote?.id),
  });

  const checkoutMutation = useMutation({
    mutationFn: ({ id, payload }) => checkoutQuote(id, payload),
    onSuccess: (resp) => invalidateQuote(resp?.quote_id),
  });

  const payTokenMutation = useMutation({
    mutationFn: ({ token, payload }) => payQuoteByToken(token, payload),
    onSuccess: (resp) => invalidateQuote(resp?.quote_id),
  });

  return {
    createMutation,
    acceptMutation,
    counterMutation,
    rejectMutation,
    checkoutMutation,
    payTokenMutation,
  };
}

export function useQuotePreview(token) {
  return useQuery({
    queryKey: ['quote-preview', token],
    queryFn: () => payQuotePreview(token),
    enabled: Boolean(token),
    staleTime: 0,
    retry: 1,
  });
}

export function useMyQuotes() {
  return useQuery({
    queryKey: ['my-quotes'],
    queryFn: () => getMyQuotes(),
    staleTime: 30_000,
  });
}

// Crée ou réutilise un devis draft pour un même shop/produit
export function useEnsureActiveQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ shop, productId, variantId, quantity, price }) => {
      const existingQuotes = await getMyQuotes();
      const list = existingQuotes?.results || existingQuotes || [];
      const active = list.find((q) =>
        q.status !== 'rejected' &&
        q.status !== 'expired' &&
        q.status !== 'converted' &&
        q.shop === shop &&
        q.lines?.some((l) =>
          variantId ? l.variant === variantId : l.product === productId,
        ),
      );
      if (active) return active;
      return createQuote({
        shop,
        expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
        lines: [
          {
            ...(variantId ? { variant: variantId } : { product: productId }),
            quantity: quantity || 1,
            negotiated_price: String(price || 0),
          },
        ],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-quotes'] });
    },
  });
}

// Mutations vendeur pour gérer un devis dans le chat
export function useSellerQuoteMutations(roomId) {
  const queryClient = useQueryClient();

  const invalidateAll = (quoteId) => {
    if (quoteId) queryClient.invalidateQueries({ queryKey: QUOTE_QUERY_KEY(quoteId) });
    if (roomId) queryClient.invalidateQueries({ queryKey: ['room-quote', roomId] });
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
    queryClient.invalidateQueries({ queryKey: ['my-quotes'] });
  };

  // Vendeur : mettre à jour les lignes + envoyer (draft → sent)
  const sendMutation = useMutation({
    mutationFn: ({ id, payload }) => sendQuote(id, payload),
    onSuccess: (quote) => invalidateAll(quote?.id),
  });

  // Vendeur : contre-proposition
  const sellerCounterMutation = useMutation({
    mutationFn: ({ id, payload }) => sellerCounterQuote(id, payload),
    onSuccess: (quote) => invalidateAll(quote?.id),
  });

  // Vendeur : refuser
  const sellerRejectMutation = useMutation({
    mutationFn: (id) => sellerRejectQuote(id),
    onSuccess: (quote) => invalidateAll(quote?.id),
  });

  // Vendeur : générer lien de paiement
  const paymentLinkMutation = useMutation({
    mutationFn: ({ id, payload }) => generatePaymentLink(id, payload),
    onSuccess: () => invalidateAll(null),
  });

  // Mettre à jour les lignes d'un devis (PATCH)
  const updateLinesMutation = useMutation({
    mutationFn: ({ id, payload }) => updateQuote(id, payload),
    onSuccess: (quote) => invalidateAll(quote?.id),
  });

  return {
    sendMutation,
    sellerCounterMutation,
    sellerRejectMutation,
    paymentLinkMutation,
    updateLinesMutation,
  };
}
