'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useVesselStore } from '@/stores/vesselStore';
import { Vessel } from '@/types/vessel';

interface WebSocketMessage {
  type: 'vessel_update' | 'vessel_new' | 'vessel_remove' | 'ping';
  data?: Vessel | Vessel[] | string;
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

if (!WS_URL) {
  throw new Error('NEXT_PUBLIC_WS_URL is not configured');
}

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const { updateVessel, setVessels } = useVesselStore();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
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
            // Handle new vessel
            break;
          case 'vessel_remove':
            // Handle vessel removal
            break;
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong' }));
            break;
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected, reconnecting...');
      reconnectTimeoutRef.current = setTimeout(connect, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      ws.close();
    };

    wsRef.current = ws;
  }, [updateVessel]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    wsRef.current?.close();
    wsRef.current = null;
  }, []);

  const sendMessage = useCallback((message: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
    sendMessage,
    reconnect: connect,
  };
}