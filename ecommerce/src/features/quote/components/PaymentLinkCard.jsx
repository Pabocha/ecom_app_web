import { ExternalLink, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuotePreview } from '@/features/quote/hooks/useQuote';
import { formatPrice } from '@/utils/helpers';

export default function PaymentLinkCard({ data, isSentByMe }) {
  const navigate = useNavigate();
  const { token } = data;
  const [paying, setPaying] = useState(false);

  const { data: preview, isLoading } = useQuotePreview(token);

  const subtotal = preview?.subtotal || 0;

  const handlePay = () => {
    navigate(`/paiement/devis/${token}`);
  };

  return (
    <div className="rounded-xl border-2 border-[#0d1b2a]/20 bg-[#0d1b2a]/5 px-4 py-3 max-w-[300px]">
      <div className="flex items-center gap-2 mb-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0d1b2a]/10 text-[#0d1b2a]">
          <ExternalLink size={13} />
        </span>
        <div>
          <div className="text-[12px] font-black text-[#0d1b2a]">
            {isSentByMe ? 'Lien de paiement envoyé' : 'Lien de paiement reçu'}
          </div>
          <div className="text-[11px] text-gray-500">
            Vérifiez le récapitulatif puis confirmez le paiement.
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-2">
          <Loader2 size={14} className="animate-spin text-gray-400" />
        </div>
      ) : subtotal > 0 ? (
        <div className="text-[14px] font-black text-[#0d1b2a] mb-2">
          {formatPrice(subtotal)}
        </div>
      ) : null}

      {!isSentByMe && (
        <button
          type="button"
          onClick={handlePay}
          disabled={paying || isLoading}
          className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[#0d1b2a] px-3 py-2 text-[12px] font-black text-white transition-colors hover:bg-[#14283d] disabled:opacity-50"
        >
          {paying ? <Loader2 size={13} className="animate-spin" /> : <ExternalLink size={13} />}
          Payer cette offre
        </button>
      )}
    </div>
  );
}
