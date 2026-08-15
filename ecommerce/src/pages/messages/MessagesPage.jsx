import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageCircle, MessagesSquare } from 'lucide-react';
import { useConversations, useOpenVendorChat } from '@/features/chat/hooks/useConversations';
import ConversationList from '@/features/chat/components/ConversationList';
import ConversationWindow from '@/features/chat/components/ConversationWindow';

export default function MessagesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const roomId = searchParams.get('room');
  const productId = searchParams.get('product');
  const sellerId = searchParams.get('seller');

  const { conversations, unreadTotal, isLoading } = useConversations();
  const openChat = useOpenVendorChat();

  useEffect(() => {
    if (roomId || !productId || !sellerId || openChat.isPending) return;
    openChat.mutate(
      { members: [Number(sellerId)], productId: Number(productId) },
      {
        onSuccess: (res) => {
          const newRoomId = res?.data?.roomId;
          if (newRoomId) {
            setSearchParams({ room: newRoomId }, { replace: true });
          }
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, productId, sellerId, openChat.isPending]);

  const selected = conversations.find((c) => String(c.roomId) === String(roomId)) || null;

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-40px)] lg:h-[calc(100vh-40px)] overflow-hidden">
      <div className="h-full lg:flex bg-white">
        <aside
          className={`h-full lg:w-80 lg:shrink-0 border-r border-gray-100 ${
            roomId ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessagesSquare size={18} className="text-cyan-600" />
              <h1 className="text-[15px] font-black text-[#0d1b2a]">Messages</h1>
            </div>
            {unreadTotal > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[11px] font-black">
                {unreadTotal} non-lus
              </span>
            )}
          </div>
          <div className="overflow-y-auto h-[calc(100%-53px)]">
            <ConversationList
              conversations={conversations}
              selectedRoomId={roomId}
              onSelect={(id) => setSearchParams({ room: id }, { replace: true })}
              isLoading={isLoading}
            />
          </div>
        </aside>

        <main
          className={`h-full flex-1 min-w-0 ${
            roomId ? 'block' : 'hidden lg:block'
          }`}
        >
          {roomId ? (
            <ConversationWindow
              roomId={roomId}
              conversation={selected}
              onBack={() => setSearchParams({}, { replace: true })}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50 text-cyan-600 mb-4">
                <MessageCircle size={26} />
              </span>
              <h2 className="text-[15px] font-black text-[#0d1b2a] mb-1">Vos conversations</h2>
              <p className="text-[12px] text-gray-500 max-w-xs">
                Sélectionnez une conversation ou utilisez le bouton « Contacter » sur une fiche produit
                pour discuter avec un vendeur.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
