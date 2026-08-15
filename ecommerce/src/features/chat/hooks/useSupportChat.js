import { useCallback, useEffect, useRef, useState } from 'react';
import { chatService } from '../services/chatService';
import { useAuthStore } from '@/stores/authStore';
import { useChatSocket } from './useChatSocket';

const EMPTY_DRAFT = { items: [], reason: '', description: '' };

export function useSupportChat() {
  const userId = useAuthStore((s) => s.user?.id);
  const [room, setRoom] = useState(null);
  const [agent, setAgent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [returnDraft, setReturnDraft] = useState(EMPTY_DRAFT);
  const roomIdRef = useRef(null);
  const messagesRef = useRef([]);

  const appendMessage = useCallback((msg) => {
    if (!msg || !msg.id) return;
    if (messagesRef.current.some((m) => m.id === msg.id)) return;
    messagesRef.current = [...messagesRef.current, msg];
    setMessages(messagesRef.current);
  }, []);

  useChatSocket(userId, {
    onMessage: (data) => {
      if (data.action === 'message' && data.roomId === roomIdRef.current) {
        appendMessage(data);
      }
    },
    onStatus: setIsConnected,
  });

  const loadMessages = useCallback(async (roomId) => {
    setIsLoading(true);
    try {
      const res = await chatService.getMessages(roomId);
      const data = res?.data;
      const list = data?.results || [];
      messagesRef.current = list;
      setMessages(list);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const roomId = roomIdRef.current;
    if (!roomId || messages.length === 0 || !userId) return;
    const unreadIds = messages
      .filter((m) => !m.is_read && String(m.user) !== String(userId))
      .map((m) => m.id);
    if (unreadIds.length === 0) return;
    chatService.markMessagesRead(roomId, unreadIds).catch(() => {});
  }, [messages, userId]);

  const start = useCallback(async () => {
    setIsStarting(true);
    setError(null);
    try {
      const res = await chatService.startSupportChat();
      const data = res?.data;
      setRoom(data);
      setAgent(data?.support_user || null);
      roomIdRef.current = data?.roomId;
      await loadMessages(data?.roomId);
    } catch (e) {
      setError(e?.response?.data?.detail || 'Impossible de démarrer le chat support.');
    } finally {
      setIsStarting(false);
    }
  }, [loadMessages]);

  const sendText = useCallback(
    async (text) => {
      const roomId = roomIdRef.current;
      const trimmed = (text || '').trim();
      if (!roomId || !trimmed || isSending) return;
      setIsSending(true);
      try {
        const res = await chatService.sendMessage(roomId, { message: trimmed });
        appendMessage(res?.data);
      } catch {
        // silencieux, l'utilisateur peut réessayer
      } finally {
        setIsSending(false);
      }
    },
    [appendMessage, isSending],
  );

  const sendProductMessage = useCallback(
    async (payload) => {
      const roomId = roomIdRef.current;
      if (!roomId) return;
      setIsSending(true);
      try {
        const res = await chatService.sendMessage(roomId, payload);
        appendMessage(res?.data);
      } catch {
        // silencieux
      } finally {
        setIsSending(false);
      }
    },
    [appendMessage],
  );

  const addReturnItem = useCallback((item) => {
    setReturnDraft((draft) => {
      const existingOrderId = draft.items[0]?.order_id;
      if (existingOrderId && existingOrderId !== item.order_id) {
        return { items: [item], reason: draft.reason, description: draft.description };
      }
      const exists = draft.items.some((i) => i.order_line_id === item.order_line_id);
      const items = exists
        ? draft.items.map((i) => (i.order_line_id === item.order_line_id ? item : i))
        : [...draft.items, item];
      return { ...draft, items };
    });
  }, []);

  const setReturnReason = useCallback((reason, description) => {
    setReturnDraft((draft) => ({ ...draft, reason, description }));
  }, []);

  const clearReturnDraft = useCallback(() => setReturnDraft(EMPTY_DRAFT), []);

  return {
    userId,
    room,
    agent,
    messages,
    isLoading,
    isStarting,
    isConnected,
    isSending,
    error,
    start,
    sendText,
    sendProductMessage,
    returnDraft,
    addReturnItem,
    setReturnReason,
    clearReturnDraft,
  };
}
