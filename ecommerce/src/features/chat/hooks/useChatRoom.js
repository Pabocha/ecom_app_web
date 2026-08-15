import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { chatService } from '../services/chatService';
import { useAuthStore } from '@/stores/authStore';
import { useChatSocket } from './useChatSocket';

export function useChatRoom(roomId) {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [roomMeta, setRoomMeta] = useState(null);
  const messagesRef = useRef([]);

  const appendMessage = useCallback(
    (msg) => {
      if (!msg || !msg.id) return;
      if (messagesRef.current.some((m) => m.id === msg.id)) return;
      messagesRef.current = [...messagesRef.current, msg];
      setMessages(messagesRef.current);
      queryClient.invalidateQueries({ queryKey: ['chat-conversations'] });
    },
    [queryClient],
  );

  useChatSocket(userId, {
    onMessage: (data) => {
      if (data.action === 'message' && roomId && data.roomId === roomId) {
        appendMessage(data);
      }
    },
    onStatus: setIsConnected,
  });

  useEffect(() => {
    let cancelled = false;
    messagesRef.current = [];
    const load = () => chatService.getMessages(roomId);
    Promise.resolve()
      .then(() => {
        if (cancelled) return null;
        setIsLoading(true);
        return roomId ? load() : null;
      })
      .then((res) => {
        if (cancelled) return;
        if (!res) {
          setMessages([]);
          setRoomMeta(null);
          return;
        }
        const data = res?.data;
        const list = [...(data?.results || [])].reverse();
        messagesRef.current = list;
        setMessages(list);
        setRoomMeta(data?.room_meta || null);
      })
      .catch(() => {
        if (cancelled) return;
        setMessages([]);
        setRoomMeta(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [roomId]);

  useEffect(() => {
    if (!roomId || messages.length === 0 || !userId) return;
    const unreadIds = messages
      .filter((m) => !m.is_read && String(m.user) !== String(userId))
      .map((m) => m.id);
    if (unreadIds.length === 0) return;
    chatService.markMessagesRead(roomId, unreadIds).catch(() => {});
  }, [messages, roomId, userId]);

  const sendText = useCallback(
    async (text) => {
      const trimmed = (text || '').trim();
      if (!roomId || !trimmed || isSending) return;
      setIsSending(true);
      try {
        const res = await chatService.sendMessage(roomId, { message: trimmed });
        appendMessage(res?.data);
      } catch {
        // silencieux
      } finally {
        setIsSending(false);
      }
    },
    [roomId, appendMessage, isSending],
  );

  const sendProductMessage = useCallback(
    async (payload) => {
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
    [roomId, appendMessage],
  );

  return {
    userId,
    messages,
    roomMeta,
    isLoading,
    isConnected,
    isSending,
    sendText,
    sendProductMessage,
  };
}
