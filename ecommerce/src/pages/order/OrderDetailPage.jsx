import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CreditCard, MapPin, Package } from 'lucide-react';
import { ORDER_STATUS } from '@/features/order/data/orderData';
import OrderTrackingModal from '@/features/order/components/OrderTrackingModal';
import TopBar from '@/components/shared/TopBar';

function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
}

export default function OrderDetailPage({ order }) {
  const navigate = useNavigate();
  const [showTracking, setShowTracking] = useState(false);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Package size={64} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-[20px] font-black text-[#0d1b2a] mb-2">Commande introuvable</h2>
          <button onClick={() => navigate('/profile/orders')} className="text-orange-500 font-bold hover:underline">
            Retour aux commandes
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = ORDER_STATUS[order.status];
  const StatusIcon = statusConfig.icon;
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      <TopBar backTo="/profile/orders" backLabel="Retour aux commandes" />

      <div className="max-w-[900px] mx-auto px-4 pt-5 space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[18px] font-black text-[#0d1b2a]">{order.id}</h2>
              <p className="text-[12px] text-gray-400">Passée le {order.date}</p>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-black ${statusConfig.color}`}>
              <StatusIcon size={14} /> {statusConfig.label}
            </span>
          </div>

          <button
            onClick={() => setShowTracking(true)}
            className="flex items-center justify-between w-full bg-[#0d1b2a]/5 hover:bg-[#0d1b2a]/10 rounded-lg px-4 py-3 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Package size={18} className="text-[#0d1b2a]" />
              <div className="text-left">
                <div className="text-[13px] font-bold text-[#0d1b2a]">Suivre ma commande</div>
                <div className="text-[11px] text-gray-400">{order.tracking.filter(t => t.done).length} sur {order.tracking.length} étapes</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <h3 className="text-[14px] font-black text-[#0d1b2a] mb-4 flex items-center gap-2">
            <Package size={16} /> Articles commandés
          </h3>
          <div className="divide-y divide-gray-100">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold text-[#0d1b2a]">{item.name}</div>
                  <div className="text-[12px] text-gray-400">Quantité : {item.qty}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[14px] font-['Barlow_Condensed'] font-black text-[#0d1b2a]">{formatPrice(item.price * item.qty)}</div>
                  <div className="text-[11px] text-gray-400">{formatPrice(item.price)} / unité</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <h3 className="text-[14px] font-black text-[#0d1b2a] mb-4 flex items-center gap-2">
            <MapPin size={16} /> Adresse de livraison
          </h3>
          <p className="text-[13px] text-gray-600">{order.address}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <h3 className="text-[14px] font-black text-[#0d1b2a] mb-4 flex items-center gap-2">
            <CreditCard size={16} /> Résumé de la commande
          </h3>
          <div className="space-y-2 text-[13px]">
            <div className="flex justify-between">
              <span className="text-gray-500">Sous-total</span>
              <span className="font-bold text-[#0d1b2a]">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Livraison</span>
              <span className="font-bold text-[#0d1b2a]">{order.shipping === 0 ? 'Gratuite' : formatPrice(order.shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Mode de paiement</span>
              <span className="font-bold text-[#0d1b2a]">{order.paymentMethod}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-[16px]">
              <span className="font-black text-[#0d1b2a]">Total</span>
              <span className="font-['Barlow_Condensed'] font-black text-orange-500">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {showTracking && (
        <OrderTrackingModal order={order} onClose={() => setShowTracking(false)} />
      )}
    </div>
  );
}
