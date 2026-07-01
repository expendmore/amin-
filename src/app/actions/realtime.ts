"use server";

import { RealtimeEventBus, PresenceEngine } from "@/lib/realtime-engine";
import { revalidatePath } from "next/cache";

export async function publishRealtimeEventAction(
  channelId: string,
  eventType: string,
  payload: Record<string, any>
) {
  if (!channelId || !eventType || !payload) {
    return { error: "Channel ID, event type, and payload are required." };
  }

  try {
    const bus = new RealtimeEventBus();
    const message = await bus.publishEvent(channelId, "system", eventType, payload);

    revalidatePath("/whatsapp/inbox");
    return { success: true, message };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateUserPresenceAction(
  workspaceId: string,
  userId: string,
  status: "online" | "idle" | "offline",
  currentScreen?: string
) {
  if (!workspaceId || !userId) {
    return { error: "Workspace ID and User ID are required." };
  }

  try {
    const presence = new PresenceEngine();
    const outcome = await presence.trackPresence(workspaceId, userId, status, currentScreen);
    return { success: true, presence: outcome };
  } catch (error: any) {
    return { error: error.message };
  }
}
