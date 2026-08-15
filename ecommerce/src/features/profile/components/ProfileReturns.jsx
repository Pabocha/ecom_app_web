import { RotateCcw, Package } from 'lucide-react';
import { useReturns } from '@/features/order/hooks/useReturns';
import { RETURN_STATUS, RETURN_REASON_LABELS } from '@/features/order/data/orderData';
import { formatPrice, formatDate } from '@/utils/helpers';

export default function ProfileReturns() {
  const { data: returns, isLoading, isError } = useReturns();

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex items-center gap-3 mb-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-500">
          <RotateCcw size={18} />
        </span>
        <div>
          <h2 className="text-[16px] font-black text-[#0d1b2a]">Mes retours</h2>
          <p className="text-[12px] text-gray-400">Suivez l'avancement de vos demandes de retour</p>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 rounded-lg border border-gray-100 animate-pulse">
                <div className="h-4 w-48 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-32 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <p className="text-[13px] text-red-500 text-center py-6">Une erreur est survenue lors du chargement de vos retours.</p>
        ) : returns.length === 0 ? (
          <div className="text-center py-10">
            <Package size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-[13px] text-gray-500 font-bold">Aucune demande de retour</p>
            <p className="text-[12px] text-gray-400 mt-1">
              Passez par le chat support de la page Aide pour retourner un produit de vos commandes livrées.
            </p>
          </div>
        ) : (
          returns.map((r) => {
            const status = RETURN_STATUS[r.status] || RETURN_STATUS.pending;
            const reasonLabel = RETURN_REASON_LABELS[r.reason] || r.reason;
            return (
              <div key={r.id} className="p-4 rounded-lg border border-gray-100 hover:border-orange-200 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[14px] font-black text-[#0d1b2a]">
                      Retour #{r.id}
                      <span className="text-gray-400 font-normal"> · Commande #{r.order_number}</span>
                    </div>
                    <div className="text-[12px] text-gray-500 mt-0.5">
                      {reasonLabel} · {r.created_at ? formatDate(r.created_at) : ''}
                    </div>
                    {r.description && (
                      <div className="text-[12px] text-gray-500 mt-1">{r.description}</div>
                    )}
                    <div className="mt-3 space-y-1.5">
                      {r.items?.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-[12px]">
                          <span className="text-gray-600 min-w-0 truncate">
                            {item.product_name} <span className="text-gray-400">× {item.quantity}</span>
                          </span>
                          <span className="font-bold text-[#0d1b2a] ml-3 shrink-0">
                            {formatPrice(item.refund_amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-black ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
