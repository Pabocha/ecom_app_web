import { formatPrice } from '@/utils/helpers';

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function MessageBubble({ message, isOwn }) {
  const isProduct = message.message_type === 'product';
  const product = message.product_detail || null;
  const price = message.active_price?.amount ?? product?.base_price?.amount ?? null;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2 shadow-sm ${
          isOwn ? 'bg-cyan-600 text-white' : 'bg-white border border-gray-100 text-[#0d1b2a]'
        }`}
      >
        {!isOwn && <div className="text-[10px] font-black mb-0.5 text-gray-400">{message.userName}</div>}
        {isProduct && product ? (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-[9px]">IMG</div>
              )}
            </div>
            <div className="min-w-0">
              <div className={`text-[13px] font-black leading-tight ${isOwn ? 'text-white' : 'text-[#0d1b2a]'}`}>
                {product.name}
              </div>
              {message.variant_detail?.sku && (
                <div className={`text-[11px] ${isOwn ? 'text-white/80' : 'text-gray-400'}`}>{message.variant_detail.sku}</div>
              )}
              {price != null && (
                <div className={`text-[12px] font-black mt-0.5 ${isOwn ? 'text-white' : 'text-orange-500'}`}>
                  {formatPrice(price)}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={`text-[13px] leading-relaxed ${isOwn ? 'text-white' : 'text-[#0d1b2a]'}`}>
            {message.message || '…'}
          </div>
        )}
        <div className={`text-[10px] mt-1 ${isOwn ? 'text-white/70' : 'text-gray-400'}`}>{formatTime(message.timestamp)}</div>
      </div>
    </div>
  );
}
