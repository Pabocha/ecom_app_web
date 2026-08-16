import { useCallback, useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '@/utils/constants';

function buildSocketUrl(userId) {
  const base = new URL(API_BASE_URL);
  const protocol = base.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${base.host}/ws/users/${userId}/chat/`;
}

export function useChatSocket(userId, { onMessage, onStatus } = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const [lastSeenMap, setLastSeenMap] = useState({});
  const wsRef = useRef(null);
  const retryRef = useRef(0);
  const connectRef = useRef(null);
  const onMessageRef = useRef(null);
  const onStatusRef = useRef(null);

  useEffect(() => {
    onMessageRef.current = onMessage;
    onStatusRef.current = onStatus;
  }, [onMessage, onStatus]);

  const connect = useCallback(() => {
    if (!userId) return;
    const ws = new WebSocket(buildSocketUrl(userId));
    wsRef.current = ws;

    ws.onopen = () => {
      retryRef.current = 0;
      setIsConnected(true);
      onStatusRef.current?.(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.action === 'onlineUser') {
          setOnlineUserIds(data.userList || []);
          if (data.last_seen && typeof data.last_seen === 'object') {
            setLastSeenMap((prev) => ({ ...prev, ...data.last_seen }));
          }
        }
        onMessageRef.current?.(data);
      } catch {
        // message JSON invalide ignoré
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      onStatusRef.current?.(false);
      if (wsRef.current !== ws) return;
      const delay = Math.min(1000 * 2 ** retryRef.current, 15000);
      retryRef.current += 1;
      setTimeout(() => connectRef.current?.(), delay);
    };

    ws.onerror = () => {
      try {
        ws.close();
      } catch {
        // ignore
      }
    };
  }, [userId]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  useEffect(() => {
    if (!userId) return;
    connect();
    return () => {
      const ws = wsRef.current;
      if (ws) {
        ws.onclose = null;
        try {
          ws.close();
        } catch {
          // ignore
        }
      }
      wsRef.current = null;
    };
  }, [userId, connect]);

  const send = useCallback((payload) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return false;
    ws.send(JSON.stringify(payload));
    return true;
  }, []);

  return { isConnected, send, onlineUserIds, lastSeenMap };
}
