import { Loader2, Check, Tag } from 'lucide-react';
import { formatPrice } from '@/utils/helpers';

const STATUS_LABELS = {
  draft: 'Brouillon',
  sent: 'Offre envoyée',
  countered: 'Contre-proposition',
  accepted: 'Acceptée',
  rejected: 'Refusée',
  expired: 'Expirée',
  converted: 'Convertie',
};

export default function QuoteOfferCard({ data, isSentByMe, onAccept, isAccepting, canAccept }) {
  const { quoteId, status, quantity, unitPrice, currency, total, remarks } = data;

  return (
    <div className="rounded-xl border-2 border-orange-200 bg-orange-50/60 px-4 py-3 max-w-[340px]">
      <div className="flex items-center gap-2 mb-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
          <Tag size={13} />
        </span>
        <div className="min-w-0">
          <div className="text-[12px] font-black text-[#0d1b2a]">
            Proposition {quoteId ? `#${quoteId}` : ''}
          </div>
          <span className="inline-block rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-black text-orange-700">
            {STATUS_LABELS[status] || status}
          </span>
        </div>
      </div>

      <div className="space-y-1 mb-2">
        <div className="flex justify-between text-[12px]">
          <span className="text-gray-500">Quantité</span>
          <span className="font-bold text-[#0d1b2a]">{quantity}</span>
        </div>
        <div className="flex justify-between text-[12px]">
          <span className="text-gray-500">Prix unitaire</span>
          <span className="font-bold text-[#0d1b2a]">{formatPrice(unitPrice)}</span>
        </div>
        <div className="flex justify-between text-[12px] border-t border-orange-200 pt-1 mt-1">
          <span className="text-gray-500 font-bold">Total</span>
          <span className="font-black text-orange-600 text-[14px]">{formatPrice(total)}</span>
        </div>
      </div>

      {remarks && (
        <div className="text-[11px] text-gray-500 italic mb-2 border-t border-orange-100 pt-1">
          {remarks}
        </div>
      )}

      {canAccept && !isSentByMe && (
        <button
          type="button"
          onClick={onAccept}
          disabled={isAccepting}
          className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2 text-[12px] font-black text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
        >
          {isAccepting ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
          Valider cette offre
        </button>
      )}
    </div>
  );
}
