import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { FileText, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useQuotePreview } from '@/features/quote/hooks/useQuote';
import { payQuoteByToken } from '@/features/quote/services/quoteService';
import QuotePaymentForm from '@/features/quote/components/QuotePaymentForm';
import { formatPrice } from '@/utils/helpers';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// MODIFICATION ICI — Paiement d'un devis via lien de paiement (token)
export default function DevisPayPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(null);

  const { data, isLoading, isError, error: previewError } = useQuotePreview(token);
  const preview = data?.data || data || null;

  const [now] = useState(() => Date.now());

  const linkExpired = preview
    ? !preview.payment_link_expires_at || new Date(preview.payment_link_expires_at).getTime() <= now
    : false;

  const handleSubmit = async (formData) => {
    setError(null);
    setPaying(true);
    try {
      const resp = await payQuoteByToken(token, {
        origin_address: formData.origin_address,
        transport_mode: formData.transport_mode,
      });
      navigate('/order-success', {
        replace: true,
        state: { orderId: resp?.order_id, quoteId: resp?.quote_id },
      });
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.detail || 'Le paiement a échoué. Veuillez réessayer.');
      setPaying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !preview) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <AlertTriangle size={34} className="text-red-400 mb-3" />
        <h1 className="text-[16px] font-black text-[#0d1b2a] mb-1">Lien de paiement invalide</h1>
        <p className="text-[13px] text-gray-500 max-w-sm">
          {previewError?.response?.data?.error || 'Ce lien ne vous appartient pas, a expiré ou le devis a déjà été converti.'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-xl mx-auto px-4">
        <div className="rounded-xl bg-white shadow-sm overflow-hidden">
          <div className="bg-[#0d1b2a] px-5 py-4 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300">
              <FileText size={17} />
            </span>
            <div>
              <h1 className="text-[15px] font-black text-white">Paiement du devis</h1>
              <p className="text-[11px] text-cyan-200/70">Boutique {preview.shop?.name}</p>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {linkExpired ? (
              <div className="flex items-start gap-2.5 rounded-lg bg-red-50 px-4 py-3 text-[12px] font-bold text-red-600">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                Ce lien de paiement a expiré. Contactez le vendeur pour obtenir un nouveau lien.
              </div>
            ) : (
              <>
                <div className="rounded-lg bg-gray-50 p-4 space-y-2">
                  {(preview.lines || []).map((line) => (
                    <div key={line.line_id} className="flex items-center justify-between gap-2 text-[12px]">
                      <span className="text-gray-600 truncate">
                        {line.product_name || `Produit #${line.product_id}`}
                      </span>
                      <span className="text-gray-500 shrink-0">
                        {line.quantity} × {formatPrice(line.negotiated_unit_price)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
                    <span className="text-[12px] font-bold text-gray-500">Sous-total</span>
                    <span className="text-[16px] font-black text-[#0d1b2a]">{formatPrice(preview.subtotal)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <ShieldCheck size={14} className="text-green-500 shrink-0" />
                  Paiement sécurisé — la commande sera créée et marquée comme payée.
                </div>

                <QuotePaymentForm
                  amount={preview.subtotal}
                  requirePayment={false}
                  isPending={paying}
                  submitLabel="Confirmer le paiement"
                  onSubmit={handleSubmit}
                />

                {error && (
                  <div className="rounded-lg bg-red-50 px-3 py-2.5 text-[12px] font-bold text-red-600">{error}</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
