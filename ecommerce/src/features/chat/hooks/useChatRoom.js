import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const messagesRef = useRef([]);
  const typingResetRef = useRef(null);

  useEffect(() => () => clearTimeout(typingResetRef.current), []);

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

  const applyReadReceipts = useCallback((ids) => {
    if (!ids?.length) return;
    messagesRef.current = messagesRef.current.map((m) => (ids.includes(m.id) ? { ...m, is_read: true } : m));
    setMessages(messagesRef.current);
  }, []);

  const { send, onlineUserIds, lastSeenMap } = useChatSocket(userId, {
    onMessage: (data) => {
      if (!roomId) return;
      if (data.action === 'message' && data.roomId === roomId) {
        appendMessage(data);
      } else if (data.action === 'read' && data.roomId === roomId) {
        applyReadReceipts(data.message_ids);
      } else if (data.action === 'typing' && data.roomId === roomId && String(data.user) !== String(userId)) {
        setIsPeerTyping(true);
        clearTimeout(typingResetRef.current);
        typingResetRef.current = setTimeout(() => setIsPeerTyping(false), 4000);
      } else if (data.action === 'stop_typing' && data.roomId === roomId) {
        setIsPeerTyping(false);
        clearTimeout(typingResetRef.current);
      }
    },
    onStatus: setIsConnected,
  });

  const peerId = useMemo(() => {
    const member = (roomMeta?.member || []).find((m) => String(m.id) !== String(userId));
    return member ? member.id : null;
  }, [roomMeta, userId]);

  const isPeerOnline = peerId != null && onlineUserIds.includes(Number(peerId));

  const peerLastSeen = useMemo(() => {
    if (peerId == null) return null;
    const member = (roomMeta?.member || []).find((m) => String(m.id) === String(peerId));
    return lastSeenMap[peerId] ?? member?.last_seen ?? null;
  }, [peerId, roomMeta, lastSeenMap]);

  const notifyTyping = useCallback(() => {
    if (!roomId) return;
    send({ action: 'typing', user: userId, roomId });
  }, [roomId, send, userId]);

  const notifyStopTyping = useCallback(() => {
    if (!roomId) return;
    send({ action: 'stop_typing', user: userId, roomId });
  }, [roomId, send, userId]);

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

  const sendImage = useCallback(
    async (file, caption) => {
      if (!roomId || !file || isSending) return;
      setIsSending(true);
      try {
        const res = await chatService.sendMessage(roomId, {
          image: file,
          ...(caption ? { message: caption } : {}),
        });
        appendMessage(res?.data);
      } catch {
        // silencieux
      } finally {
        setIsSending(false);
      }
    },
    [roomId, appendMessage, isSending],
  );

  return {
    userId,
    messages,
    roomMeta,
    isLoading,
    isConnected,
    isSending,
    isPeerOnline,
    isPeerTyping,
    peerLastSeen,
    sendText,
    sendProductMessage,
    sendImage,
    notifyTyping,
    notifyStopTyping,
  };
}
