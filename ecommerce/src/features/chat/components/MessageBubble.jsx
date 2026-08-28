import { Check, CheckCheck } from 'lucide-react';
import { formatPrice } from '@/utils/helpers';
import QuoteOfferCard from '@/features/quote/components/QuoteOfferCard';
import QuoteAcceptedCard from '@/features/quote/components/QuoteAcceptedCard';
import PaymentLinkCard from '@/features/quote/components/PaymentLinkCard';

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function parseOfferMessage(text) {
  const match = text?.match(/^\[QUOTE_OFFER\]\s*(.+)$/);
  if (!match) return null;
  const pairs = match[1].split(';');
  const data = {};
  for (const pair of pairs) {
    const [key, ...rest] = pair.split('=');
    if (key) data[key.trim()] = rest.join('=').trim();
  }
  return {
    quoteId: data.quote_id ? Number(data.quote_id) : null,
    status: data.status || '',
    quantity: data.quantity || '',
    unitPrice: Number(data.unit_price) || 0,
    currency: data.currency || 'XOF',
    total: Number(data.total) || 0,
    remarks: data.remarks || '',
  };
}

function parseAcceptedMessage(text) {
  const match = text?.match(/^\[QUOTE_ACCEPTED\]\s*(.+)$/);
  if (!match) return null;
  const pairs = match[1].split(';');
  const data = {};
  for (const pair of pairs) {
    const [key, ...rest] = pair.split('=');
    if (key) data[key.trim()] = rest.join('=').trim();
  }
  return {
    quoteId: data.quote_id ? Number(data.quote_id) : null,
    status: data.status || 'accepted',
  };
}

function parsePaymentMessage(text) {
  const tokenMatch = text?.match(/^\[PAYMENT\]\s*token=(.+)$/);
  if (tokenMatch) return { token: tokenMatch[1].trim() };
  const urlMatch = text?.match(/\/(?:api\/)?v1?\/orders\/quotes\/pay\/([^/\s]+)/);
  if (urlMatch) return { token: urlMatch[1].trim() };
  return null;
}

export default function MessageBubble({ message, isOwn, quoteContext, onAcceptOffer, acceptingQuoteId }) {
  const text = message.message || '';
  const offerData = parseOfferMessage(text);
  const acceptedData = parseAcceptedMessage(text);
  const paymentData = parsePaymentMessage(text);
  const isStructured = offerData || acceptedData || paymentData;

  const isProduct = message.message_type === 'product';
  const isImage = message.message_type === 'image';
  const product = message.product_detail || null;
  const active = message.active_price || null;
  const pd = product?.pricing_display || {};

  const mainAmount = active?.amount ?? product?.base_price?.amount ?? null;
  let oldAmount = null;
  let tierBadge = null;
  if (active?.type === 'promo') {
    oldAmount = pd.base_price ?? null;
  } else if (active?.type === 'variant') {
    if (pd.base_price != null && Number(pd.base_price) !== Number(mainAmount)) oldAmount = pd.base_price;
  } else if ((active?.type === 'tier' || (!active && pd.type === 'tiers')) && pd.tiers_count) {
    tierBadge = `${pd.tiers_count} prix`;
  }
  const minQty = message.min_order_quantity ?? product?.min_order_quantity ?? null;

  if (isStructured) {
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
        <div className="max-w-[80%]">
          {!isOwn && <div className="text-[10px] font-black mb-1 text-gray-400 px-1">{message.userName}</div>}
          {offerData && (
            <QuoteOfferCard
              data={offerData}
              isSentByMe={isOwn}
              canAccept={quoteContext?.canAccept && !isOwn}
              onAccept={() => onAcceptOffer?.(offerData.quoteId)}
              isAccepting={acceptingQuoteId === offerData.quoteId}
            />
          )}
          {acceptedData && (
            <QuoteAcceptedCard data={acceptedData} />
          )}
          {paymentData && (
            <PaymentLinkCard data={paymentData} isSentByMe={isOwn} />
          )}
          <div className="flex items-center justify-end gap-1 mt-1 px-1">
            <span className={`text-[10px] ${isOwn ? 'text-gray-400' : 'text-gray-400'}`}>{formatTime(message.timestamp)}</span>
            {isOwn &&
              (message.is_read ? (
                <CheckCheck size={14} className="text-cyan-500" />
              ) : (
                <Check size={14} className="text-gray-300" />
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2 shadow-sm ${
          isOwn ? 'bg-cyan-600 text-white' : 'bg-white border border-gray-100 text-[#0d1b2a]'
        }`}
      >
        {!isOwn && <div className="text-[10px] font-black mb-0.5 text-gray-400">{message.userName}</div>}
        {isProduct && product ? (
          <div className="w-56 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="h-32 bg-gray-100 overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">IMG</div>
              )}
            </div>
            <div className="p-2.5 space-y-1">
              <div className="text-[12px] font-black leading-snug text-[#0d1b2a] line-clamp-2">{product.name}</div>
              {message.variant_detail?.sku && <div className="text-[10px] text-gray-400">{message.variant_detail.sku}</div>}
              <div className="flex items-center gap-1.5">
                {mainAmount != null && (
                  <span className="text-orange-500 font-black text-[13px]">{formatPrice(mainAmount)}</span>
                )}
                {oldAmount != null && (
                  <span className="text-gray-400 text-[11px] line-through">{formatPrice(oldAmount)}</span>
                )}
                {tierBadge && (
                  <span className="ml-auto text-[9px] font-black text-cyan-700 bg-cyan-50 rounded px-1.5 py-0.5">
                    {tierBadge}
                  </span>
                )}
              </div>
              {minQty != null && <div className="text-[10px] text-gray-400">Quantité min. : {minQty}</div>}
            </div>
          </div>
        ) : isImage ? (
          <div className="flex flex-col gap-1.5">
            {message.image && (
              <img src={message.image} alt="" className="max-h-56 rounded-lg object-cover" />
            )}
            {message.message && (
              <div className={`text-[13px] leading-relaxed ${isOwn ? 'text-white' : 'text-[#0d1b2a]'}`}>
                {message.message}
              </div>
            )}
          </div>
        ) : (
          <div className={`text-[13px] leading-relaxed ${isOwn ? 'text-white' : 'text-[#0d1b2a]'}`}>
            {message.message || '…'}
          </div>
        )}
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className={`text-[10px] ${isOwn ? 'text-white/70' : 'text-gray-400'}`}>{formatTime(message.timestamp)}</span>
          {isOwn &&
            (message.is_read ? (
              <CheckCheck size={14} className="text-cyan-100" />
            ) : (
              <Check size={14} className="text-white/60" />
            ))}
        </div>
      </div>
    </div>
  );
}
