import { ArrowLeft, Package, Pin } from 'lucide-react';
import MessageList from './MessageList';
import ChatComposer from './ChatComposer';
import { useChatRoom } from '../hooks/useChatRoom';
import { formatPrice } from '@/utils/helpers';
import { useAuthStore } from '@/stores/authStore';

function initialsOf(name) {
  return (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

export default function ConversationWindow({ roomId, conversation, onBack }) {
  const currentUserId = useAuthStore((s) => s.user?.id);
  const { userId, messages, roomMeta, isLoading, isConnected, isSending, sendText } = useChatRoom(roomId);

  const counterMember = (roomMeta?.member || []).find((m) => String(m.id) !== String(currentUserId));
  const support = conversation?.is_support;
  const name = support
    ? 'Support TradeHub'
    : conversation
      ? `${conversation.user?.first_name || ''} ${conversation.user?.last_name || ''}`.trim() ||
        conversation.shop_name ||
        'Discussion'
      : `${counterMember?.first_name || ''} ${counterMember?.last_name || ''}`.trim() || 'Discussion';

  const photo = !support && conversation?.user?.photo ? conversation.user.photo : null;

  const pinned = roomMeta?.pinned_product_detail || null;

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-5 py-3.5 bg-[#0d1b2a] text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Retour"
          >
            <ArrowLeft size={18} />
          </button>
          {support ? (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300">
              <Package size={16} />
            </span>
          ) : photo ? (
            <img src={photo} alt="" className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 text-[13px] font-black">
              {initialsOf(name)}
            </span>
          )}
          <div className="min-w-0">
            <div className="text-[14px] font-black truncate">{name}</div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-500'}`} />
              <span className={isConnected ? 'text-green-300' : 'text-gray-400'}>
                {isConnected ? 'En ligne' : 'Connexion…'}
              </span>
            </div>
          </div>
        </div>
        {pinned && (
          <div className="hidden sm:flex items-center gap-2 max-w-[220px] bg-white/5 rounded-lg px-2 py-1.5">
            <Pin size={13} className="text-cyan-300 shrink-0" />
            <div className="w-7 h-7 rounded overflow-hidden bg-white/10 shrink-0">
              {pinned.image ? (
                <img src={pinned.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-[8px]">IMG</div>
              )}
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold truncate">{pinned.name}</div>
              {pinned.base_price?.amount != null && (
                <div className="text-[10px] text-orange-300 font-black">{formatPrice(pinned.base_price.amount)}</div>
              )}
            </div>
          </div>
        )}
      </div>

      <MessageList
        messages={messages}
        currentUserId={userId}
        isLoading={isLoading}
        emptyText="Aucun message. Posez votre question à ce sujet."
      />

      <ChatComposer onSendText={sendText} isSending={isSending} disabled={!roomId} />
    </div>
  );
}
