"use server";

import { EventBus } from "@/lib/webhook-engine";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

export async function publishEventAction(
  workspaceId: string,
  eventType: string,
  data: Record<string, any>
) {
  if (!workspaceId || !eventType || !data) {
    return { error: "Workspace ID, event type, and data payload are required." };
  }

  try {
    const bus = new EventBus();
    const result = await bus.publishEvent(workspaceId, eventType, data);

    revalidatePath("/developer/webhooks");
    return { success: true, deliveredCount: result.deliveredCount };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function replayWebhookEventAction(workspaceId: string, eventId: string) {
  if (!workspaceId || !eventId) {
    return { error: "Workspace ID and event ID are required." };
  }

  try {
    const bus = new EventBus();
    await bus.replayEvent(workspaceId, eventId);

    if (adminDb) {
      await adminDb.collection("auditLogs").add({
        workspaceId,
        userId: "system",
        action: `Replayed webhook event ${eventId} in workspace ${workspaceId}`,
        timestamp: FieldValue.serverTimestamp()
      });
    }

    revalidatePath("/developer/webhooks");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
