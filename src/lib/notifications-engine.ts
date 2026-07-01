/**
 * Notifications Engine — Multi-channel delivery with Firestore persistence
 *
 * Supports: email (Resend), push (FCM), in-app (Firestore)
 * In-app notifications are stored in Firestore `notifications` collection.
 */

import axios from "axios";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export interface DeliveryResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Resend Email Integration wrapper
export async function sendEmailNotification(
  to: string,
  subject: string,
  html: string
): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    try {
      const response = await axios.post(
        "https://api.resend.com/emails",
        {
          from: "ExpendMore <notifications@expendmore.com>",
          to: [to],
          subject,
          html,
        },
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );
      return { success: true, messageId: response.data.id };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Resend API error";
      console.error("[Notifications Engine] Resend email failed:", message);
    }
  }

  // Development fallback: log the email
  console.log(`[Notifications Engine - DEV] Email to ${to} | Subject: "${subject}"`);
  return { success: true, messageId: `msg_dev_${Date.now()}` };
}

// Firebase Cloud Messaging (FCM) push notification
export async function sendPushNotification(
  deviceToken: string,
  title: string,
  body: string
): Promise<DeliveryResult> {
  const fcmKey = process.env.FCM_SERVER_KEY;

  if (fcmKey) {
    try {
      const response = await axios.post(
        "https://fcm.googleapis.com/fcm/send",
        { to: deviceToken, notification: { title, body } },
        { headers: { Authorization: `key=${fcmKey}` } }
      );
      return { success: true, messageId: String(response.data.multicast_id) };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "FCM error";
      console.error("[Notifications Engine] FCM push failed:", message);
    }
  }

  console.log(`[Notifications Engine - DEV] Push to ${deviceToken} | Title: "${title}"`);
  return { success: true, messageId: `msg_push_${Date.now()}` };
}

// Notification Engine coordinating all delivery channels
export class NotificationEngine {
  public async dispatch(
    workspaceId: string,
    channels: ("email" | "push" | "in_app")[],
    params: {
      userId?: string;
      emailAddress?: string;
      deviceToken?: string;
      title: string;
      body: string;
    }
  ): Promise<{ results: Record<string, DeliveryResult> }> {
    const results: Record<string, DeliveryResult> = {};

    for (const channel of channels) {
      if (channel === "email" && params.emailAddress) {
        results.email = await sendEmailNotification(
          params.emailAddress,
          params.title,
          `<p>${params.body}</p>`
        );
      } else if (channel === "push" && params.deviceToken) {
        results.push = await sendPushNotification(
          params.deviceToken,
          params.title,
          params.body
        );
      } else if (channel === "in_app") {
        // Persist in-app notification to Firestore
        if (adminDb) {
          try {
            const docRef = await adminDb.collection("notifications").add({
              workspaceId,                    // Required for multi-tenant isolation
              userId: params.userId || null,
              title: params.title,
              body: params.body,
              isRead: false,
              createdAt: FieldValue.serverTimestamp(),
            });
            results.in_app = { success: true, messageId: docRef.id };
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Firestore error";
            console.error("[Notifications Engine] Failed to persist in-app notification:", message);
            results.in_app = { success: false, error: message };
          }
        } else {
          results.in_app = { success: false, error: "Database not initialized" };
        }
      }
    }

    return { results };
  }
}
