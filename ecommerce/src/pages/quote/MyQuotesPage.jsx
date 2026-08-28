import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Check, X, Repeat, CreditCard, MessageCircle, Package } from 'lucide-react';
import { useQuoteMutations } from '@/features/quote/hooks/useQuote';
import { getMyQuotes } from '@/features/quote/services/quoteService';
import QuoteCounterModal from '@/features/quote/components/QuoteCounterModal';
import QuotePayModal from '@/features/quote/components/QuotePayModal';
import { formatQuoteStatus, formatPrice, quoteLineUnitPrice, quoteTotal } from '@/utils/helpers';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-600',
  sent: 'bg-cyan-100 text-cyan-700',
  countered: 'bg-orange-100 text-orange-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
  expired: 'bg-gray-100 text-gray-500',
  converted: 'bg-blue-100 text-blue-700',
};

// MODIFICATION ICI — Page « Mes devis »
export default function MyQuotesPage() {
  const navigate = useNavigate();
  const [counterTarget, setCounterTarget] = useState(null);
  const [payTarget, setPayTarget] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['my-quotes'],
    queryFn: getMyQuotes,
  });

  const { acceptMutation, counterMutation, rejectMutation, checkoutMutation } = useQuoteMutations();

  const quotes = data?.results || data || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
            <FileText size={19} />
          </span>
          <div>
            <h1 className="text-[18px] font-black text-[#0d1b2a]">Mes devis</h1>
            <p className="text-[12px] text-gray-400">Négociations de prix en cours avec les vendeurs</p>
          </div>
        </div>
        <Link
          to="/messages"
          className="rounded-lg border-2 border-cyan-200 px-3 py-2 text-[12px] font-black text-cyan-700 transition-colors hover:bg-cyan-50"
        >
          Voir les messages
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner />
        </div>
      ) : quotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package size={32} className="text-gray-300 mb-3" />
          <p className="text-[13px] text-gray-500">
            Aucun devis pour le moment.
            <br />
            Utilisez « Demander un devis » dans une discussion produit pour négocier un prix.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {quotes.map((quote) => {
            const status = quote.status;
            const total = quoteTotal(quote);
            const canRespond = ['sent', 'countered'].includes(status);
            return (
              <div key={quote.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-black text-[#0d1b2a]">Devis #{quote.id}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${STATUS_COLORS[status] || STATUS_COLORS.draft}`}>
                        {formatQuoteStatus(status)}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      Créé le {quote.created_at ? new Date(quote.created_at).toLocaleDateString('fr-FR') : '—'} ·{' '}
                      {quote.expires_at ? `valide jusqu'au ${new Date(quote.expires_at).toLocaleDateString('fr-FR')}` : 'sans échéance'}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[16px] font-black text-[#0d1b2a]">{formatPrice(total)}</div>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5">
                  {(quote.lines || []).map((line) => (
                    <div key={line.id} className="flex items-center justify-between gap-2 text-[12px]">
                      <span className="text-gray-600 truncate">
                        {line.product_name || `Produit #${line.product || line.variant}`}
                        {line.variant_sku ? ` (${line.variant_sku})` : ''}
                      </span>
                      <span className="text-gray-500 shrink-0">
                        {line.quantity} × {formatPrice(quoteLineUnitPrice(line))}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
                  {canRespond && (
                    <>
                      <button
                        type="button"
                        onClick={() => acceptMutation.mutate(quote.id)}
                        disabled={acceptMutation.isPending}
                        className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-[12px] font-black text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                      >
                        <Check size={13} />
                        Accepter
                      </button>
                      <button
                        type="button"
                        onClick={() => setCounterTarget(quote)}
                        className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2 text-[12px] font-black text-white transition-colors hover:bg-orange-600"
                      >
                        <Repeat size={13} />
                        Contre-proposer
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Refuser ce devis ?')) {
                            rejectMutation.mutate(quote.id);
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
                  {status === 'accepted' && (
                    <button
                      type="button"
                      onClick={() => setPayTarget(quote)}
                      className="flex items-center gap-1.5 rounded-lg bg-[#0d1b2a] px-4 py-2 text-[12px] font-black text-white transition-colors hover:bg-[#14283d]"
                    >
                      <CreditCard size={13} />
                      Payer ce devis
                    </button>
                  )}
                  {status === 'converted' && quote.converted_order && (
                    <button
                      type="button"
                      onClick={() => navigate(`/profile/orders/${quote.converted_order}`)}
                      className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-[12px] font-black text-white transition-colors hover:bg-blue-700"
                    >
                      Voir la commande n°{quote.converted_order}
                    </button>
                  )}
                  {quote.room_id && (
                    <button
                      type="button"
                      onClick={() => navigate(`/messages?room=${quote.room_id}`)}
                      className="ml-auto flex items-center gap-1.5 rounded-lg border-2 border-gray-200 px-3 py-2 text-[12px] font-black text-gray-600 transition-colors hover:bg-gray-50"
                    >
                      <MessageCircle size={13} />
                      Discussion
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {counterTarget && (
        <QuoteCounterModal
          quote={counterTarget}
          onClose={() => setCounterTarget(null)}
          counterMutation={counterMutation}
        />
      )}
      {payTarget && (
        <QuotePayModal
          quote={payTarget}
          onClose={() => setPayTarget(null)}
          checkoutMutation={checkoutMutation}
        />
      )}
    </div>
  );
}
