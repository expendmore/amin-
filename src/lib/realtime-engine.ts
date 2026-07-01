import { getCachedValue, setCachedValue } from "./redis";
import { adminDb } from "./firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export interface RealtimeMessage {
  channelId: string;
  senderId: string;
  eventType: string;
  payload: Record<string, any>;
  timestamp: string;
}

export interface UserPresence {
  userId: string;
  status: "online" | "idle" | "offline";
  currentScreen?: string;
  lastActive: string;
}

// Realtime dispatcher leveraging Redis pub/sub wrappers
export class RealtimeEventBus {
  public async publishEvent(
    channelId: string,
    senderId: string,
    eventType: string,
    payload: Record<string, any>
  ): Promise<RealtimeMessage> {
    const timestamp = new Date().toISOString();
    const msg: RealtimeMessage = { channelId, senderId, eventType, payload, timestamp };

    // In production, publish to Redis Pub/Sub channel
    console.log(`[Redis PubSub]: Publishing event "${eventType}" to channel "${channelId}"`);

    // Audit logs tracking realtime operations in Firestore
    if (adminDb) {
      try {
        const workspaceId = payload.workspaceId || (channelId.startsWith("ws_") ? channelId : "system_workspace");
        await adminDb.collection("auditLogs").add({
          workspaceId,
          userId: senderId === "system" ? "system" : senderId,
          action: `Published realtime event ${eventType} into channel ${channelId}`,
          timestamp: FieldValue.serverTimestamp()
        });
      } catch (err) {
        console.error("[RealtimeEventBus] Failed to write audit log to Firestore:", err);
      }
    }

    return msg;
  }
}

// Presence Tracker storing online session keys
export class PresenceEngine {
  public async trackPresence(
    workspaceId: string,
    userId: string,
    status: "online" | "idle" | "offline",
    currentScreen?: string
  ): Promise<UserPresence> {
    const cacheKey = `presence:${workspaceId}:${userId}`;
    const presence: UserPresence = {
      userId,
      status,
      currentScreen,
      lastActive: new Date().toISOString()
    };

    await setCachedValue(cacheKey, presence, 300); // 5 minutes presence expiry
    console.log(`[Presence Engine]: Tracked user ${userId} status as ${status} in workspace ${workspaceId}`);
    return presence;
  }

  public async getPresence(workspaceId: string, userId: string): Promise<UserPresence | null> {
    const cacheKey = `presence:${workspaceId}:${userId}`;
    return await getCachedValue<UserPresence>(cacheKey);
  }
}

// AI Streaming Engine yielding token payloads
export async function* simulateAiTokenStream(prompt: string): AsyncGenerator<string, void, unknown> {
  const words = `This is a streamed AI response token sequence for prompt: "${prompt}".`.split(" ");
  for (const word of words) {
    yield `${word} `;
    // Emulate server timing delay
    await new Promise((resolve) => setTimeout(resolve, 30));
  }
}
