import { useState } from 'react';
import { X, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QuotePaymentForm from './QuotePaymentForm';
import { formatPrice, quoteTotal } from '@/utils/helpers';
import { orderService } from '@/features/order/services/orderService';

// MODIFICATION ICI — Modale de paiement d'un devis accepté (checkout + paiement de la commande)
export default function QuotePayModal({ quote, onClose, checkoutMutation }) {
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(null);

  const total = quoteTotal(quote);

  const handleSubmit = async (formData) => {
    setError(null);
    setPaying(true);
    try {
      const resp = await checkoutMutation.mutateAsync({
        id: quote.id,
        payload: {
          origin_address: formData.origin_address,
          transport_mode: formData.transport_mode,
        },
      });
      const orderId = resp?.order_id;
      if (!orderId) throw new Error('Réponse invalide du serveur lors du checkout');

      await orderService.payOrder(orderId, {
        payment_method: [formData.paymentMethod.apiId],
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
      });

      navigate('/order-success', {
        replace: true,
        state: { orderId, orderNumber: resp?.order_number },
      });
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.detail || err?.message || 'Le paiement a échoué. Veuillez réessayer.');
      setPaying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/55 px-4">
      <div className="w-full max-w-[560px] max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <CreditCard size={17} />
            </span>
            <div>
              <h3 className="text-[16px] font-black text-[#0d1b2a]">Payer ce devis</h3>
              <p className="text-[12px] text-gray-400">La commande sera créée puis réglée immédiatement</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded bg-gray-100 p-2 text-gray-500 hover:bg-red-50 hover:text-red-500">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
            <div className="text-[13px] font-bold text-gray-600">
              Total de la commande
              <span className="block text-[11px] font-normal text-gray-400">Frais de livraison calculés à la création</span>
            </div>
            <div className="text-[18px] font-black text-[#0d1b2a]">{formatPrice(total)}</div>
          </div>

          <QuotePaymentForm
            amount={total}
            isPending={paying}
            submitLabel="Confirmer et payer"
            onSubmit={handleSubmit}
          />

          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2.5 text-[12px] font-bold text-red-600">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
}
