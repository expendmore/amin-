"use server";

import { NotificationEngine } from "@/lib/notifications-engine";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

export async function dispatchNotificationAction(
  workspaceId: string,
  channels: ("email" | "push" | "in_app")[],
  params: {
    userId?: string;
    emailAddress?: string;
    deviceToken?: string;
    title: string;
    body: string;
  }
) {
  if (!workspaceId || !channels.length || !params.title || !params.body) {
    return { error: "Workspace ID, channels, title, and body are required." };
  }

  try {
    const engine = new NotificationEngine();
    const result = await engine.dispatch(workspaceId, channels, params);

    if (adminDb) {
      await adminDb.collection("auditLogs").add({
        workspaceId,
        userId: "system",
        action: `Dispatched notification "${params.title}" via channels: ${channels.join(", ")}`,
        timestamp: FieldValue.serverTimestamp()
      });
    }

    revalidatePath("/notifications/inbox");
    return { success: true, results: result.results };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function markNotificationAsReadAction(notificationId: string, workspaceId: string = "system_workspace") {
  if (!notificationId) return { error: "Notification ID is required." };
  if (!adminDb) return { error: "Database not available" };

  try {
    const notificationRef = adminDb.collection("notifications").doc(notificationId);
    const docSnap = await notificationRef.get();
    if (!docSnap.exists) return { error: "Notification not found." };
    const docWorkspaceId = docSnap.data()?.workspaceId || workspaceId;

    await notificationRef.update({
      isRead: true,
      updatedAt: FieldValue.serverTimestamp()
    });

    revalidatePath("/notifications/inbox");
    return { success: true, notification: { id: notificationId, ...docSnap.data(), isRead: true } };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteNotificationAction(notificationId: string, workspaceId: string = "system_workspace") {
  if (!notificationId) return { error: "Notification ID is required." };
  if (!adminDb) return { error: "Database not available" };

  try {
    const notificationRef = adminDb.collection("notifications").doc(notificationId);
    const docSnap = await notificationRef.get();
    if (!docSnap.exists) return { error: "Notification not found." };

    await notificationRef.delete();

    revalidatePath("/notifications/inbox");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
