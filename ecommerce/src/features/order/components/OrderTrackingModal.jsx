import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Package, Truck, MapPin, CheckCircle, Clock, XCircle } from 'lucide-react';
import { ORDER_STATUS } from '@/features/order/data/orderData';

const trackIcons = {
  'Commande confirmée': CheckCircle,
  'Préparation en cours': Package,
  'Expédiée': Truck,
  'En transit': Truck,
  'Livrée': MapPin,
  'Annulée': XCircle,
};

export default function OrderTrackingModal({ order, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = '' };
  }, []);

  if (!order) return null;

  const statusConfig = ORDER_STATUS[order.status];
  const StatusIcon = statusConfig.icon;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-[18px] font-black text-[#0d1b2a]">Suivi de commande</h2>
            <p className="text-[12px] text-gray-400">{order.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="flex items-center gap-3 mb-5 p-4 rounded-lg bg-[#0d1b2a]/5">
            <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${statusConfig.color}`}>
              <StatusIcon size={18} />
            </span>
            <div>
              <div className="text-[13px] font-black text-[#0d1b2a]">Statut : {statusConfig.label}</div>
              <div className="text-[11px] text-gray-400">Passée le {order.date}</div>
            </div>
          </div>

          <div className="relative space-y-0">
            {order.tracking.map((step, i) => {
              const Icon = trackIcons[step.label] || Clock;
              const isLast = i === order.tracking.length - 1;
              return (
                <div key={i} className="flex gap-4 pb-2">
                  <div className="flex flex-col items-center">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${
                      step.done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Icon size={14} />
                    </span>
                    {!isLast && (
                      <div className={`w-0.5 h-full min-h-[24px] ${step.done ? 'bg-green-300' : 'bg-gray-200'}`} />
                    )}
                  </div>
                  <div className={`pb-6 ${isLast ? '' : ''}`}>
                    <div className={`text-[13px] font-bold ${step.done ? 'text-[#0d1b2a]' : 'text-gray-400'}`}>
                      {step.label}
                    </div>
                    {step.date && (
                      <div className="text-[11px] text-gray-400">{step.date}</div>
                    )}
                    {!step.done && !step.date && (
                      <div className="text-[11px] text-orange-500 font-bold">En attente</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-gray-500">Livraison</span>
            <span className="font-bold text-[#0d1b2a]">{order.shipping === 0 ? 'Gratuite' : `${order.shipping.toLocaleString('fr-FR')} FCFA`}</span>
          </div>
          <div className="flex items-center justify-between text-[13px] mt-1">
            <span className="text-gray-500">Adresse</span>
            <span className="font-bold text-[#0d1b2a] text-right max-w-[250px] truncate">{order.address}</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
