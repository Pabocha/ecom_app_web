import { Loader2, MessageCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const today = new Date();
  const sameDay =
    d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  if (sameDay) {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function initialsOf(name) {
  return (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

function ConversationAvatar({ conversation }) {
  if (conversation.is_support) {
    return (
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-600">
        <MessageCircle size={18} />
      </span>
    );
  }
  if (conversation.user?.photo) {
    return (
      <img
        src={conversation.user.photo}
        alt=""
        className="h-11 w-11 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500 text-[12px] font-black">
      {initialsOf(`${conversation.user?.first_name || ''} ${conversation.user?.last_name || ''}`) || '?'}
    </span>
  );
}

export default function ConversationList({ conversations, selectedRoomId, onSelect, isLoading }) {
  const currentUserId = useAuthStore((s) => s.user?.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 size={20} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <MessageCircle size={28} className="text-gray-300 mb-3" />
        <p className="text-[13px] text-gray-500">
          Aucune conversation.
          <br />
          Utilisez le bouton « Contacter » sur une fiche produit pour démarrer une discussion.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {conversations.map((c) => {
        const isOwnMessage = String(c.last_message_user_id ?? c.user_id) === String(currentUserId);
        const isActive = selectedRoomId && String(c.roomId) === String(selectedRoomId);
        const name = c.is_support
          ? 'Support TradeHub'
          : `${c.user?.first_name || ''} ${c.user?.last_name || ''}`.trim() || c.shop_name || 'Discussion';
        const preview =
          c.last_message_type === 'product'
            ? 'Produit partagé'
            : c.last_message || 'Démarrez la discussion…';

        return (
          <button
            key={c.roomId}
            type="button"
            onClick={() => onSelect(String(c.roomId))}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
              isActive ? 'bg-cyan-50' : 'hover:bg-gray-50'
            }`}
          >
            <ConversationAvatar conversation={c} />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[13px] font-black text-[#0d1b2a] truncate">{name}</span>
                {c.last_message_time && (
                  <span className="shrink-0 text-[10px] text-gray-400">{formatTime(c.last_message_time)}</span>
                )}
              </div>
              <div className="text-[11px] text-gray-500 truncate">
                {isOwnMessage ? 'Vous : ' : ''}
                {preview}
              </div>
              {c.shop_name && !c.is_support && (
                <div className="text-[10px] text-cyan-600 truncate">{c.shop_name}</div>
              )}
            </div>
            {c.unread_count > 0 && (
              <span className="shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-orange-500 text-white text-[11px] font-black">
                {c.unread_count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
