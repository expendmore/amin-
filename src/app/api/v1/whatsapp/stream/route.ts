/**
 * GET /api/v1/whatsapp/stream
 * Server-Sent Events (SSE) endpoint for real-time WhatsApp inbox updates.
 * Streams events to the dashboard without needing a separate WebSocket server.
 *
 * Usage: EventSource("/api/v1/whatsapp/stream?workspaceId=xxx")
 */

import { NextRequest } from "next/server";
import { redis } from "@/lib/redis";

// How often (ms) to poll Redis for new events
const POLL_INTERVAL_MS = 1500;
// Max time a stream stays open (ms) before client auto-reconnects
const MAX_STREAM_DURATION_MS = 55_000;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspaceId") || "default";
  const channelKey = `inbox_stream:${workspaceId}`;

  // Set up SSE response headers
  const encoder = new TextEncoder();
  let controller: ReadableStreamDefaultController | null = null;
  let isClosed = false;

  const stream = new ReadableStream({
    start(ctrl) {
      controller = ctrl;
    },
    cancel() {
      isClosed = true;
    }
  });

  const sendEvent = (eventType: string, data: Record<string, any>) => {
    if (!isClosed && controller) {
      try {
        const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(payload));
      } catch {
        isClosed = true;
      }
    }
  };

  // Send initial heartbeat so browser knows connection is alive
  sendEvent("connected", { workspaceId, timestamp: new Date().toISOString() });

  // Background polling loop
  const pollLoop = async () => {
    const startTime = Date.now();

    while (!isClosed && Date.now() - startTime < MAX_STREAM_DURATION_MS) {
      try {
        // Pop ALL pending events from the Redis list for this workspace stream
        const rawEvent = await redis.lpop(channelKey) as string | null;
        if (rawEvent) {
          const event = typeof rawEvent === "string" ? JSON.parse(rawEvent) : rawEvent;
          sendEvent(event.eventType || "inbox_event", event);
        } else {
          // No event — send heartbeat ping to keep connection alive
          sendEvent("ping", { ts: Date.now() });
        }
      } catch (err) {
        console.error("[SSE Poll Error]:", err);
      }
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    }

    // Gracefully close after MAX duration so client auto-reconnects
    if (controller && !isClosed) {
      sendEvent("reconnect", { message: "Stream rotating. Reconnecting..." });
      try {
        controller.close();
      } catch { /* already closed */ }
    }
  };

  // Launch background poll (non-blocking)
  pollLoop().catch(console.error);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no" // Required for Nginx proxy streaming
    }
  });
}
