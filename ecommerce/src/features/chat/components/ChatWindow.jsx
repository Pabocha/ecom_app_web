import { useState } from 'react';
import { Headphones, X } from 'lucide-react';
import MessageList from './MessageList';
import ChatComposer from './ChatComposer';
import ReturnConfirmBar from './ReturnConfirmBar';
import ProductPickerModal from './ProductPickerModal';
import { RETURN_REASON_LABELS } from '@/features/order/data/orderData';

export default function ChatWindow({
  agent,
  messages,
  currentUserId,
  isLoading,
  isConnected,
  isSending,
  sendText,
  sendProductMessage,
  returnDraft,
  addReturnItem,
  setReturnReason,
  clearReturnDraft,
  onClose,
}) {
  const [showPicker, setShowPicker] = useState(false);

  const agentName = agent?.first_name || agent?.last_name
    ? `${agent?.first_name || ''} ${agent?.last_name || ''}`.trim()
    : 'Support TradeHub';

  const handleConfirmPick = (items, reason, description) => {
    setReturnReason(reason, description);
    items.forEach((i) => {
      const payload = {
        product_id: i.product_id,
        message_type: 'product',
        message: `Demande de retour${reason ? ` : ${RETURN_REASON_LABELS[reason] || reason}` : ''}${description ? ` — ${description}` : ''}`,
      };
      if (i.variant_id) payload.variant_id = i.variant_id;
      sendProductMessage(payload);
      addReturnItem({ ...i, reason, description });
    });
    setShowPicker(false);
  };

  return (
    <div className="flex flex-col h-[480px]">
      <div className="px-5 py-3.5 bg-[#0d1b2a] text-white flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300">
            <Headphones size={18} />
          </span>
          <div>
            <div className="text-[14px] font-black">{agentName}</div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-500'}`} />
              <span className={isConnected ? 'text-green-300' : 'text-gray-400'}>
                {isConnected ? 'En ligne' : 'Connexion…'}
              </span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <X size={18} className="text-gray-300" />
        </button>
      </div>

      <MessageList messages={messages} currentUserId={currentUserId} isLoading={isLoading} />

      <ReturnConfirmBar draft={returnDraft} onClear={clearReturnDraft} />

      <ChatComposer
        onSendText={sendText}
        onOpenProductPicker={() => setShowPicker(true)}
        isSending={isSending}
        disabled={false}
      />

      {showPicker && (
        <ProductPickerModal
          existingDraft={returnDraft}
          onConfirm={handleConfirmPick}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
