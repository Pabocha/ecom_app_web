import { useState } from 'react';
import { RotateCcw, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useCreateReturn } from '@/features/order/hooks/useReturns';
import { RETURN_REASON_LABELS, RETURN_STATUS } from '@/features/order/data/orderData';
import { formatPrice } from '@/utils/helpers';

function normalizeError(e) {
  const data = e?.response?.data;
  if (!data) return 'La demande de retour a échoué.';
  if (typeof data === 'string') return data;
  if (data.detail) return data.detail;
  if (typeof data === 'object') {
    return Object.values(data)
      .flat()
      .map((v) => (Array.isArray(v) ? v.join(' ') : v))
      .join(' ');
  }
  return 'La demande de retour a échoué.';
}

export default function ReturnConfirmBar({ draft, onClear }) {
  const createReturn = useCreateReturn();
  const [created, setCreated] = useState(null);
  const [error, setError] = useState(null);

  const { items = [], reason = '', description = '' } = draft || {};
  if (items.length === 0) return null;

  const total = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);

  const confirm = () => {
    setError(null);
    createReturn.mutate(
      {
        order_id: items[0].order_id,
        reason,
        description,
        items: items.map((i) => ({ order_line_id: i.order_line_id, quantity: i.quantity })),
      },
      {
        onSuccess: (res) => {
          setCreated(res?.data);
          onClear();
        },
        onError: (e) => {
          setError(normalizeError(e));
        },
      },
    );
  };

  if (created) {
    const status = RETURN_STATUS[created.status] || RETURN_STATUS.pending;
    return (
      <div className="border-t border-gray-100 bg-green-50 p-3 px-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[13px] text-green-700 font-bold">
          <CheckCircle size={16} />
          <span>
            Demande de retour <span className="font-black">#{created.id}</span> enregistrée ({status.label})
          </span>
        </div>
        <button
          onClick={() => setCreated(null)}
          className="text-[12px] text-gray-500 hover:underline"
        >
          Fermer
        </button>
      </div>
    );
  }

  const isValid = Boolean(reason) && items.length > 0;

  return (
    <div className="border-t border-gray-100 bg-white p-3 px-4">
      {error && (
        <div className="flex items-start gap-2 mb-2 p-2.5 rounded-lg bg-red-50 text-red-600 text-[12px]">
          <XCircle size={14} className="mt-0.5 shrink-0" />
          <span className="flex-1">{error}</span>
        </div>
      )}
      <div className="flex items-center justify-between gap-3">
        <div className="text-[12px] text-gray-500 min-w-0">
          <div className="flex items-center gap-1.5 font-bold text-[#0d1b2a]">
            <RotateCcw size={14} className="text-orange-500" />
            Retour : {items.length} produit{items.length > 1 ? 's' : ''}
            {reason && (
              <span className="text-orange-500 font-black">
                — {RETURN_REASON_LABELS[reason] || reason}
              </span>
            )}
          </div>
          <div>
            Commande #{items[0].order_number} · Total{' '}
            <span className="font-black text-orange-500">{formatPrice(total)}</span>
          </div>
        </div>
        <button
          onClick={confirm}
          disabled={!isValid || createReturn.isPending}
          className="shrink-0 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-[13px] font-bold disabled:opacity-40 transition-colors inline-flex items-center gap-2"
        >
          {createReturn.isPending && <Loader2 size={14} className="animate-spin" />}
          Confirmer la demande
        </button>
      </div>
      {!reason && (
        <p className="text-[11px] text-amber-600 mt-1.5">Sélectionnez un motif de retour pour valider la demande.</p>
      )}
    </div>
  );
}
