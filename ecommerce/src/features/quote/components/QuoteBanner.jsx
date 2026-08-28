import { useEffect, useState } from 'react';
import { FileText, Check, X, Repeat, CreditCard, Loader2, Send, Link, MessageSquare } from 'lucide-react';
import { useRoomQuote, useQuoteMutations, useSellerQuoteMutations } from '@/features/quote/hooks/useQuote';
import QuoteCounterModal from './QuoteCounterModal';
import QuotePayModal from './QuotePayModal';
import SellerOfferModal from './SellerOfferModal';
import { formatQuoteStatus, formatPrice, quoteLineUnitPrice, quoteTotal } from '@/utils/helpers';

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-600',
  sent: 'bg-orange-100 text-orange-700',
  countered: 'bg-orange-100 text-orange-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
  expired: 'bg-gray-100 text-gray-500',
  converted: 'bg-blue-100 text-blue-700',
};

function buildOfferMessage(quote, lines) {
  const line = lines?.[0] || quote?.lines?.[0];
  if (!line) return null;
  const qty = line.quantity;
  const price = Number(line.negotiated_price || quoteLineUnitPrice(line));
  const total = qty * price;
  const parts = [
    `quote_id=${quote.id}`,
    `status=${quote.status}`,
    `quantity=${qty}`,
    `unit_price=${price}`,
    `currency=XOF`,
    `total=${total}`,
  ];
  if (line.remarks) parts.push(`remarks=${line.remarks}`);
  return `[QUOTE_OFFER] ${parts.join(';')}`;
}

export default function QuoteBanner({ roomId, roomMeta, onQuoteChanged, sendText }) {
  const [offerOpen, setOfferOpen] = useState(false);
  const [counterOpen, setCounterOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);

  const { quote, role, isLoading: isLoadingQuote } = useRoomQuote({ roomMeta });
  const { createMutation, acceptMutation, counterMutation, rejectMutation, checkoutMutation } = useQuoteMutations(roomId);
  const { sendMutation, paymentLinkMutation } = useSellerQuoteMutations(roomId);

  const pinned = roomMeta?.pinned_product_detail || null;
  const shopId = pinned?.shop ?? roomMeta?.pinned_product?.shop_id;

  const handleMutated = () => {
    onQuoteChanged?.();
  };

  // ---role='none': pas encore de devis ---
  if (role === 'none') {
    if (!pinned) return null;
    return (
      <div className="mx-4 mt-3 shrink-0 rounded-xl border border-cyan-200 bg-cyan-50/70 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[12px] font-black text-cyan-700">
              <MessageSquare size={14} />
              Discuter avec le vendeur
            </div>
            <p className="text-[11px] text-cyan-900/70 mt-0.5">
              Posez vos questions sur « {pinned.name} » ou demandez un devis.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              createMutation.mutate(
                {
                  shop: shopId,
                  expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
                  lines: [
                    {
                      product: pinned.id,
                      quantity: 1,
                      negotiated_price: String(pinned.base_price?.amount || 0),
                    },
                  ],
                },
                { onSuccess: handleMutated },
              );
            }}
            disabled={createMutation.isPending}
            className="shrink-0 rounded-lg bg-cyan-600 px-3 py-2 text-[12px] font-black text-white transition-colors hover:bg-cyan-700 disabled:opacity-50"
          >
            {createMutation.isPending ? <Loader2 size={13} className="animate-spin" /> : <MessageSquare size={13} className="mr-1 inline" />}
            Démarrer la discussion
          </button>
        </div>
      </div>
    );
  }

  if (isLoadingQuote && !quote) return null;
  if (!quote) return null;

  const status = quote.status;
  const total = quoteTotal(quote);
  const isBuyer = role === 'buyer';
  const isSeller = role === 'seller';
  const canRespond = isBuyer && ['sent', 'countered'].includes(status);
  const canPay = isBuyer && status === 'accepted';
  const canSendOffer = isSeller && ['draft', 'countered'].includes(status);
  const canGenerateLink = isSeller && status === 'accepted';

  const handleSendOffer = (modalData) => {
    const payload = { lines: modalData.lines };
    sendMutation.mutate(
      { id: quote.id, payload },
      {
        onSuccess: (updatedQuote) => {
          handleMutated();
          const offerMsg = buildOfferMessage(updatedQuote || quote, modalData.lines);
          if (offerMsg) sendText?.(offerMsg);
        },
      },
    );
  };

  const handleAccept = () => {
    acceptMutation.mutate(quote.id, {
      onSuccess: () => {
        handleMutated();
        sendText?.(`[QUOTE_ACCEPTED] quote_id=${quote.id};status=accepted`);
      },
    });
  };

  const handleGenerateLink = () => {
    paymentLinkMutation.mutate(
      { id: quote.id, payload: { expires_in_minutes: 1440 } },
      {
        onSuccess: (data) => {
          handleMutated();
          const token = data?.token;
          if (token) sendText?.(`[PAYMENT] token=${token}`);
        },
      },
    );
  };

  return (
    <div className="mx-4 mt-3 shrink-0 rounded-xl border border-gray-200 bg-white shadow-sm px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
            <FileText size={15} />
          </span>
          <div className="min-w-0">
            <div className="text-[12px] font-black text-[#0d1b2a]">Devis</div>
            <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-black ${STATUS_COLORS[status] || STATUS_COLORS.draft}`}>
              {formatQuoteStatus(status)}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[14px] font-black text-[#0d1b2a]">{formatPrice(total)}</div>
          <div className="text-[10px] text-gray-400">
            {quote.lines?.length} ligne{quote.lines?.length > 1 ? 's' : ''} · Expire le{' '}
            {quote.expires_at ? new Date(quote.expires_at).toLocaleDateString('fr-FR') : '—'}
          </div>
        </div>
      </div>

      <div className="mt-2 space-y-1">
        {(quote.lines || []).map((line) => (
          <div key={line.id} className="flex items-center justify-between gap-2 text-[11px]">
            <span className="text-gray-600 truncate">
              {line.product_name || `Produit #${line.product || line.variant}`}{line.variant_sku ? ` (${line.variant_sku})` : ''}
            </span>
            <span className="text-gray-500 shrink-0">
              {line.quantity} × {formatPrice(quoteLineUnitPrice(line))}
            </span>
          </div>
        ))}
      </div>

      {/* --- Actions acheteur --- */}
      {isBuyer && (
        <div className="mt-3 flex flex-wrap gap-2">
          {canRespond && (
            <>
              <button
                type="button"
                onClick={handleAccept}
                disabled={acceptMutation.isPending}
                className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-[12px] font-black text-white transition-colors hover:bg-green-700 disabled:opacity-50"
              >
                {acceptMutation.isPending ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                Accepter
              </button>
              <button
                type="button"
                onClick={() => setCounterOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2 text-[12px] font-black text-white transition-colors hover:bg-orange-600"
              >
                <Repeat size={13} />
                Contre-proposer
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Refuser ce devis ?')) {
                    rejectMutation.mutate(quote.id, { onSuccess: handleMutated });
                  }
                }}
                disabled={rejectMutation.isPending}
                className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-[12px] font-black text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-50"
              >
                <X size={13} />
                Refuser
              </button>
            </>
          )}
          {canPay && (
            <button
              type="button"
              onClick={() => setPayOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-[#0d1b2a] px-4 py-2 text-[12px] font-black text-white transition-colors hover:bg-[#14283d]"
            >
              <CreditCard size={13} />
              Payer ce devis
            </button>
          )}
          {status === 'draft' && (
            <span className="text-[11px] text-gray-400 self-center">En attente de la réponse du vendeur…</span>
          )}
          {status === 'converted' && quote.converted_order && (
            <span className="text-[11px] text-blue-600 font-bold self-center">
              Commandé — n°{quote.converted_order}
            </span>
          )}
        </div>
      )}

      {/* --- Actions vendeur --- */}
      {isSeller && (
        <div className="mt-3 flex flex-wrap gap-2">
          {canSendOffer && (
            <button
              type="button"
              onClick={() => setOfferOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2 text-[12px] font-black text-white transition-colors hover:bg-orange-600"
            >
              <Send size={13} />
              {status === 'draft' ? 'Envoyer une offre' : 'Mettre à jour et envoyer'}
            </button>
          )}
          {canGenerateLink && (
            <button
              type="button"
              onClick={handleGenerateLink}
              disabled={paymentLinkMutation.isPending}
              className="flex items-center gap-1.5 rounded-lg bg-[#0d1b2a] px-4 py-2 text-[12px] font-black text-white transition-colors hover:bg-[#14283d] disabled:opacity-50"
            >
              {paymentLinkMutation.isPending ? <Loader2 size={13} className="animate-spin" /> : <Link size={13} />}
              Générer le lien de paiement
            </button>
          )}
          {status === 'accepted' && !canGenerateLink && (
            <span className="text-[11px] text-green-600 font-bold self-center">Offre acceptée — en attente</span>
          )}
          {status === 'sent' && (
            <span className="text-[11px] text-gray-400 self-center">En attente de la réponse du client…</span>
          )}
        </div>
      )}

      {/* --- Modals --- */}
      {offerOpen && (
        <SellerOfferModal
          quote={quote}
          onClose={() => setOfferOpen(false)}
          sendMutation={sendMutation}
        />
      )}
      {counterOpen && (
        <QuoteCounterModal
          quote={quote}
          onClose={() => setCounterOpen(false)}
          counterMutation={counterMutation}
        />
      )}
      {payOpen && (
        <QuotePayModal
          quote={quote}
          onClose={() => setPayOpen(false)}
          checkoutMutation={checkoutMutation}
        />
      )}
    </div>
  );
}
