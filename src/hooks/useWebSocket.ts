import { useState, useEffect, useRef, useCallback } from 'react';

export type WebSocketStatus = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED';

export interface UseWebSocketOptions<T = any> {
  onMessage?: (data: T) => void;
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  autoReconnect?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number; // in milliseconds
}

export interface UseWebSocketReturn<T = any> {
  status: WebSocketStatus;
  isConnected: boolean;
  lastMessage: T | null;
  sendMessage: (data: any) => boolean;
  reconnect: () => void;
}

/**
 * Reusable Custom React Hook for Managing WebSocket Connections.
 * Handles auto-reconnection, event subscription, state tracking, and cleanup.
 */
export function useWebSocket<T = any>(
  url: string | null,
  options: UseWebSocketOptions<T> = {}
): UseWebSocketReturn<T> {
  const {
    onMessage,
    onOpen,
    onClose,
    onError,
    autoReconnect = true,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
  } = options;

  const [status, setStatus] = useState<WebSocketStatus>('CLOSED');
  const [lastMessage, setLastMessage] = useState<T | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const attemptsRef = useRef<number>(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Store options callbacks in refs to avoid re-triggering effects
  const onMessageRef = useRef(onMessage);
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onMessageRef.current = onMessage;
    onOpenRef.current = onOpen;
    onCloseRef.current = onClose;
    onErrorRef.current = onError;
  });

  const connect = useCallback(() => {
    if (!url) return;

    // Clean up existing socket if any
    if (socketRef.current) {
      socketRef.current.close();
    }

    try {
      setStatus('CONNECTING');
      const ws = new WebSocket(url);
      socketRef.current = ws;

      ws.onopen = (event) => {
        setStatus('OPEN');
        attemptsRef.current = 0;
        if (onOpenRef.current) onOpenRef.current(event);
      };

      ws.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data) as T;
          setLastMessage(parsedData);
          if (onMessageRef.current) onMessageRef.current(parsedData);
        } catch {
          setLastMessage(event.data as any);
          if (onMessageRef.current) onMessageRef.current(event.data as any);
        }
      };

      ws.onerror = (event) => {
        if (onErrorRef.current) onErrorRef.current(event);
      };

      ws.onclose = (event) => {
        setStatus('CLOSED');
        if (onCloseRef.current) onCloseRef.current(event);

        // Handle auto reconnection
        if (autoReconnect && attemptsRef.current < reconnectAttempts) {
          attemptsRef.current += 1;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };
    } catch (err) {
      setStatus('CLOSED');
    }
  }, [url, autoReconnect, reconnectAttempts, reconnectInterval]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [connect]);

  const sendMessage = useCallback((data: any): boolean => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const payload = typeof data === 'string' ? data : JSON.stringify(data);
      socketRef.current.send(payload);
      return true;
    }
    return false;
  }, []);

  const reconnect = useCallback(() => {
    attemptsRef.current = 0;
    connect();
  }, [connect]);

  return {
    status,
    isConnected: status === 'OPEN',
    lastMessage,
    sendMessage,
    reconnect,
  };
}
