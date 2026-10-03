'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useVesselStore } from '@/stores/vesselStore';
import { Vessel } from '@/types/vessel';

interface WebSocketMessage {
  type: 'vessel_update' | 'vessel_new' | 'vessel_remove' | 'ping';
  data?: Vessel | Vessel[] | string;
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? (() => {
  throw new Error('NEXT_PUBLIC_WS_URL is not configured');
})();
const RECONNECT_DELAY = 3000;

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const connectRef = useRef<() => void>(() => undefined);
  const shouldReconnectRef = useRef(true);
  const [isConnected, setIsConnected] = useState(false);
  const { addVessel, updateVessel, removeVessel } = useVesselStore();

  const connect = useCallback(() => {
    if (
      !shouldReconnectRef.current ||
      wsRef.current?.readyState === WebSocket.OPEN ||
      wsRef.current?.readyState === WebSocket.CONNECTING
    ) {
      return;
    }

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);

        switch (message.type) {
          case 'vessel_update':
            if (message.data && typeof message.data === 'object' && ! Array.isArray(message.data)) {
              updateVessel(message.data as Vessel);
            }
            break;
          case 'vessel_new':
            if (Array.isArray(message.data)) {
              message.data.forEach((vessel) => addVessel(vessel));
            } else if (message.data && typeof message.data === 'object') {
              addVessel(message.data as Vessel);
            }
            break;
          case 'vessel_remove':
            if (typeof message.data === 'string') {
              removeVessel(message.data);
            }
            break;
          case 'ping':
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: 'pong' }));
            }
            break;
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      if (! shouldReconnectRef.current) return;
      console.log('WebSocket disconnected, reconnecting...');
      reconnectTimeoutRef.current = setTimeout(() => connectRef.current(), RECONNECT_DELAY);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current = ws;
  }, [addVessel, removeVessel, updateVessel]);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    wsRef.current?.close();
    wsRef.current = null;
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((message: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  useEffect(() => {
    shouldReconnectRef.current = true;
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    isConnected,
    sendMessage,
    reconnect: connect,
  };
}