import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Eye } from 'lucide-react';
import { ORDER_STATUS } from '@/features/order/data/orderData';
import OrderTrackingModal from '@/features/order/components/OrderTrackingModal';
import { formatPrice, formatDate } from '@/utils/helpers';

export default function OrderCard({ order }) {
  const navigate = useNavigate();
  const [showTracking, setShowTracking] = useState(false);
  const statusConfig = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
  const StatusIcon = statusConfig.icon;

  const displayName = order.order_number ? `#${order.order_number}` : order.id;
  const displayDate = order.order_date ? formatDate(order.order_date) : '';
  const lines = order.order_lines || [];
  const totalAmount = order.total_amount ?? order.total ?? 0;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-[15px] font-black text-[#0d1b2a]">{displayName}</div>
              <div className="text-[12px] text-gray-400">{displayDate}</div>
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
            {lines.slice(0, 3).map((line) => (
              <div key={line.id} className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                  {line.product_image ? (
                    <img src={line.product_image} alt={line.product_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">IMG</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold text-[#0d1b2a] truncate">{line.product_name}</div>
                  {line.variant_options?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {line.variant_options.map((opt, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-gray-100 rounded px-1.5 py-0.5">
                          {opt.hex_color && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: opt.hex_color }} />}
                          {opt.attribute}: {opt.value}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="text-[11px] text-gray-400">x{line.quantity}</div>
                </div>
              </div>
            ))}
            {lines.length > 3 && (
              <div className="text-[12px] font-bold text-gray-400 shrink-0">+{lines.length - 3}</div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 bg-gray-50">
          <div className="text-[12px] text-gray-500">
            {lines.length} article{lines.length > 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[11px] text-gray-400">Total </span>
              <span className="text-[16px] font-['Barlow_Condensed'] font-black text-[#0d1b2a]">{formatPrice(totalAmount)}</span>
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
