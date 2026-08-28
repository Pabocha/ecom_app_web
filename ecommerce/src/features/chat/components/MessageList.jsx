import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

export default function MessageList({
  messages,
  currentUserId,
  isLoading,
  emptyText = 'Aucun message. Posez votre question à notre équipe support.',
  quoteContext,
  onAcceptOffer,
  acceptingQuoteId,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
      {isLoading ? (
        <p className="text-center text-[12px] text-gray-400 py-6">Chargement des messages…</p>
      ) : messages.length === 0 ? (
        <p className="text-center text-[12px] text-gray-400 py-6">
          {emptyText}
        </p>
      ) : (
        messages.map((m) => (
          <MessageBubble
            key={m.id}
            message={m}
            isOwn={String(m.user) === String(currentUserId)}
            quoteContext={quoteContext}
            onAcceptOffer={onAcceptOffer}
            acceptingQuoteId={acceptingQuoteId}
          />
        ))
      )}
      <div ref={bottomRef} />
    </div>
  );
}
