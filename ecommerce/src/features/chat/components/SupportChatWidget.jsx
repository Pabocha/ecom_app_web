import { createPortal } from 'react-dom';
import { Loader2, MessageSquare, X } from 'lucide-react';
import ChatWindow from './ChatWindow';

export default function SupportChatWidget({ chat, onClose }) {
  const { room, isStarting, error, start } = chat;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {!room ? (
          <div className="flex flex-col items-center text-center px-6 py-10">
            <button
              onClick={onClose}
              className="self-end p-2 hover:bg-gray-100 rounded-lg transition-colors mb-2"
            >
              <X size={18} className="text-gray-400" />
            </button>
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-100 text-cyan-600 mb-4">
              <MessageSquare size={26} />
            </span>
            <h2 className="text-[18px] font-black text-[#0d1b2a] mb-1">Chat avec le support</h2>
            <p className="text-[13px] text-gray-500 mb-6 max-w-[280px]">
              Discutez avec un membre de notre équipe. Vous pourrez ensuite choisir un produit à
              retourner.
            </p>
            {error && <p className="text-[12px] text-red-500 mb-4">{error}</p>}
            <button
              onClick={start}
              disabled={isStarting}
              className="px-6 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-[14px] font-bold disabled:opacity-40 inline-flex items-center gap-2"
            >
              {isStarting ? <Loader2 size={16} className="animate-spin" /> : <MessageSquare size={16} />}
              Démarrer la conversation
            </button>
          </div>
        ) : (
          <ChatWindow
            agent={chat.agent}
            messages={chat.messages}
            currentUserId={chat.userId}
            isLoading={chat.isLoading}
            isConnected={chat.isConnected}
            isSending={chat.isSending}
            sendText={chat.sendText}
            sendProductMessage={chat.sendProductMessage}
            returnDraft={chat.returnDraft}
            addReturnItem={chat.addReturnItem}
            setReturnReason={chat.setReturnReason}
            clearReturnDraft={chat.clearReturnDraft}
            onClose={onClose}
          />
        )}
      </div>
    </div>,
    document.body,
  );
}
