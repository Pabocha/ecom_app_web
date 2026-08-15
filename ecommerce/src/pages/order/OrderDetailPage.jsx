import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CreditCard, MapPin, Package, RotateCcw } from 'lucide-react';
import { ORDER_STATUS, RETURN_STATUS, RETURN_REASON_LABELS } from '@/features/order/data/orderData';
import OrderTrackingModal from '@/features/order/components/OrderTrackingModal';
import OrderReviewSection from '@/features/reviews/components/OrderReviewSection';
import TopBar from '@/components/shared/TopBar';
import { formatPrice, formatDate } from '@/utils/helpers';

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

  const statusConfig = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
  const StatusIcon = statusConfig.icon;
  const displayName = order.order_number ? `#${order.order_number}` : order.id;
  const displayDate = order.order_date ? formatDate(order.order_date) : '';
  const lines = order.order_lines || [];

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      <TopBar backTo="/profile/orders" backLabel="Retour aux commandes" />

      <div className="max-w-[900px] mx-auto px-4 pt-5 space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[18px] font-black text-[#0d1b2a]">{displayName}</h2>
              <p className="text-[12px] text-gray-400">Passée le {displayDate}</p>
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
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        </div>

        {order.return_requests?.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h3 className="text-[14px] font-black text-[#0d1b2a] mb-4 flex items-center gap-2">
              <RotateCcw size={16} className="text-orange-500" /> Demandes de retour
            </h3>
            <div className="space-y-3">
              {order.return_requests.map((r) => {
                const status = RETURN_STATUS[r.status] || RETURN_STATUS.pending;
                const reasonLabel = RETURN_REASON_LABELS[r.reason] || r.reason;
                return (
                  <div key={r.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-100">
                    <div className="min-w-0">
                      <div className="text-[13px] font-bold text-[#0d1b2a]">Retour #{r.id} — {reasonLabel}</div>
                      <div className="text-[11px] text-gray-400">
                        {r.items?.length || 0} article(s) · {r.created_at ? formatDate(r.created_at) : ''}
                      </div>
                    </div>
                    <span className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-black ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-5">
          <h3 className="text-[14px] font-black text-[#0d1b2a] mb-4 flex items-center gap-2">
            <Package size={16} /> Articles commandés
          </h3>
          <div className="divide-y divide-gray-100">
            {lines.map((line) => (
              <div key={line.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                  {line.product_image ? (
                    <img src={line.product_image} alt={line.product_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">IMG</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold text-[#0d1b2a]">{line.product_name}</div>
                  {line.variant_options?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {line.variant_options.map((opt, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 text-[11px] text-gray-600 bg-gray-100 rounded-full px-2 py-0.5">
                          {opt.hex_color && <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-gray-200" style={{ backgroundColor: opt.hex_color }} />}
                          <span className="font-medium text-gray-500">{opt.attribute}:</span> {opt.value}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="text-[12px] text-gray-400 mt-0.5">Quantité : {line.quantity}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[14px] font-['Barlow_Condensed'] font-black text-[#0d1b2a]">{formatPrice(line.unit_price * line.quantity)}</div>
                  <div className="text-[11px] text-gray-400">{formatPrice(line.unit_price)} / unité</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <h3 className="text-[14px] font-black text-[#0d1b2a] mb-4 flex items-center gap-2">
            <MapPin size={16} /> Adresse de livraison
          </h3>
          <div className="text-[13px] text-gray-600 space-y-1">
            <p className="font-bold">{order.shipping_first_name} {order.shipping_last_name}</p>
            <p>{order.shipping_street_address}</p>
            <p>{order.shipping_city}{order.shipping_postal_code ? ` - ${order.shipping_postal_code}` : ''}</p>
            <p>{order.shipping_state_region ? `${order.shipping_state_region}, ` : ''}{order.shipping_country}</p>
            {order.shipping_phone_number && <p>Tél : {order.shipping_phone_number}</p>}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <h3 className="text-[14px] font-black text-[#0d1b2a] mb-4 flex items-center gap-2">
            <CreditCard size={16} /> Résumé de la commande
          </h3>
          <div className="space-y-2 text-[13px]">
            <div className="flex justify-between">
              <span className="text-gray-500">Sous-total</span>
              <span className="font-bold text-[#0d1b2a]">{formatPrice(lines.reduce((sum, l) => sum + l.unit_price * l.quantity, 0))}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Réduction</span>
                <span className="font-bold">-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Livraison</span>
              <span className="font-bold text-[#0d1b2a]">{order.delivery_cost > 0 ? formatPrice(order.delivery_cost) : 'Gratuite'}</span>
            </div>
            {order.payment_method_name?.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Mode de paiement</span>
                <span className="font-bold text-[#0d1b2a]">{order.payment_method_name.join(', ')}</span>
              </div>
            )}
            {order.applied_coupon_code && (
              <div className="flex justify-between">
                <span className="text-gray-500">Code promo</span>
                <span className="font-bold text-green-600">{order.applied_coupon_code}</span>
              </div>
            )}
            <hr className="my-2" />
            <div className="flex justify-between text-[16px]">
              <span className="font-black text-[#0d1b2a]">Total</span>
              <span className="font-['Barlow_Condensed'] font-black text-orange-500">{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* MODIFICATION ICI — Avis possible uniquement quand la commande est livrée */}
        {order.status === 'delivered' && (
          <OrderReviewSection orderId={order.id} />
        )}
      </div>

      {showTracking && (
        <OrderTrackingModal order={order} onClose={() => setShowTracking(false)} />
      )}
    </div>
  );
}
