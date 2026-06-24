import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Eye } from 'lucide-react';
import { ORDER_STATUS } from '@/features/order/data/orderData';
import OrderTrackingModal from '@/features/order/components/OrderTrackingModal';

function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
}

export default function OrderCard({ order }) {
  const navigate = useNavigate();
  const [showTracking, setShowTracking] = useState(false);
  const statusConfig = ORDER_STATUS[order.status];
  const StatusIcon = statusConfig.icon;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-[15px] font-black text-[#0d1b2a]">{order.id}</div>
              <div className="text-[12px] text-gray-400">{order.date}</div>
            </div>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-black ${statusConfig.color}`}>
              <StatusIcon size={12} /> {statusConfig.label}
            </span>
          </div>
          <button onClick={() => navigate(`/profile/orders/${order.id}`)} className="text-[12px] font-bold text-orange-500 hover:underline flex items-center gap-1">
            Détails <ChevronRight size={12} />
          </button>
        </div>

        <div className="px-5 py-3">
          <div className="flex items-center gap-3">
            {order.items.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold text-[#0d1b2a] truncate">{item.name}</div>
                  <div className="text-[11px] text-gray-400">x{item.qty}</div>
                </div>
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="text-[12px] font-bold text-gray-400 shrink-0">+{order.items.length - 3}</div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 bg-gray-50">
          <div className="text-[12px] text-gray-500">
            {order.items.length} article{order.items.length > 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[11px] text-gray-400">Total </span>
              <span className="text-[16px] font-['Barlow_Condensed'] font-black text-[#0d1b2a]">{formatPrice(order.total)}</span>
            </div>
            <button onClick={() => setShowTracking(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-[12px] font-black transition-colors flex items-center gap-1.5">
              <Eye size={14} /> Suivre
            </button>
          </div>
        </div>
      </div>

      {showTracking && (
        <OrderTrackingModal order={order} onClose={() => setShowTracking(false)} />
      )}
    </>
  );
}
