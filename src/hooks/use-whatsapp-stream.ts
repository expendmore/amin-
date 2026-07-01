/**
 * useWhatsAppStream – React hook for real-time WhatsApp inbox updates via SSE.
 *
 * Usage:
 *   const { events, isConnected, lastEvent } = useWhatsAppStream(workspaceId);
 *
 * The hook opens a Server-Sent Events connection to /api/v1/whatsapp/stream
 * and automatically reconnects on disconnect.
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface InboxStreamEvent {
  eventType: string;
  messageId?: string;
  accountId?: string;
  body?: string;
  direction?: "inbound" | "outbound";
  from?: string;
  to?: string;
  contactName?: string;
  createdAt?: string;
  ts?: number;
}

interface UseWhatsAppStreamOptions {
  workspaceId: string;
  maxEvents?: number; // How many events to keep in memory
  onMessage?: (event: InboxStreamEvent) => void;
}

interface UseWhatsAppStreamReturn {
  events: InboxStreamEvent[];
  lastEvent: InboxStreamEvent | null;
  isConnected: boolean;
  clearEvents: () => void;
}

export function useWhatsAppStream({
  workspaceId,
  maxEvents = 100,
  onMessage
}: UseWhatsAppStreamOptions): UseWhatsAppStreamReturn {
  const [events, setEvents] = useState<InboxStreamEvent[]>([]);
  const [lastEvent, setLastEvent] = useState<InboxStreamEvent | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const connect = useCallback(() => {
    if (!workspaceId) return;

    // Close any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const url = `/api/v1/whatsapp/stream?workspaceId=${encodeURIComponent(workspaceId)}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.addEventListener("connected", () => {
      setIsConnected(true);
    });

    es.addEventListener("ping", () => {
      // Heartbeat — connection still alive, no action needed
      setIsConnected(true);
    });

    es.addEventListener("reconnect", () => {
      // Server rotating stream — reconnect after brief delay
      es.close();
      setIsConnected(false);
      reconnectTimerRef.current = setTimeout(connect, 500);
    });

    // Listen for WhatsApp message events
    const handleInboxEvent = (eventType: string) => (e: MessageEvent) => {
      try {
        const data: InboxStreamEvent = JSON.parse(e.data);
        const event: InboxStreamEvent = { ...data, eventType };
        setLastEvent(event);
        setEvents(prev => [event, ...prev].slice(0, maxEvents));
        onMessageRef.current?.(event);
      } catch {
        /* ignore parse errors */
      }
    };

    es.addEventListener("WHATSAPP_MESSAGE_RECEIVED", handleInboxEvent("WHATSAPP_MESSAGE_RECEIVED"));
    es.addEventListener("WHATSAPP_MESSAGE_SENT", handleInboxEvent("WHATSAPP_MESSAGE_SENT"));
    es.addEventListener("inbox_event", handleInboxEvent("inbox_event"));

    es.onerror = () => {
      setIsConnected(false);
      es.close();
      // Auto-reconnect after 3 seconds
      reconnectTimerRef.current = setTimeout(connect, 3000);
    };
  }, [workspaceId, maxEvents]);

  useEffect(() => {
    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      setIsConnected(false);
    };
  }, [connect]);

  const clearEvents = useCallback(() => setEvents([]), []);

  return { events, lastEvent, isConnected, clearEvents };
}
