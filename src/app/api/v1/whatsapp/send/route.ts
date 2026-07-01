/**
 * POST /api/v1/whatsapp/send
 * Allows dashboard agents to send manual WhatsApp messages to customers.
 * Supports text, templates, images, and documents.
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireWorkspaceAccess, apiError, apiSuccess } from "@/lib/api-auth";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { sendMetaWhatsAppMessage, WhatsAppMessagePayload } from "@/lib/whatsapp";
import { redis } from "@/lib/redis";

interface SendMessageBody {
  to: string;
  type: "text" | "template" | "image" | "document";
  text?: string;
  templateName?: string;
  templateLanguage?: string;
  templateParams?: string[];
  mediaUrl?: string;
  mediaCaption?: string;
  workspaceId: string;
  accountId?: string; // Optional if we only have one connected account
}

export async function POST(request: NextRequest) {
  try {
    const { uid, error: authErr } = await requireAuth(request);
    if (authErr) return apiError(authErr, 401);

    const body: SendMessageBody = await request.json();
    const { to, type, text, templateName, templateLanguage, templateParams, mediaUrl, mediaCaption, workspaceId, accountId } = body;

    if (!workspaceId) {
      return apiError("workspaceId is required.", 400);
    }

    const { error: wsErr } = await requireWorkspaceAccess(workspaceId, uid);
    if (wsErr) return apiError(wsErr, 403);

    if (!to) {
      return apiError("Recipient phone number 'to' is required.", 400);
    }
    if (type === "text" && !text) {
      return apiError("Text message body is required for type 'text'.", 400);
    }
    if (type === "template" && !templateName) {
      return apiError("templateName is required for type 'template'.", 400);
    }

    if (!adminDb) {
      return apiError("Database not available", 500);
    }

    // Resolve workspace WABA account credentials
    let accountData: any = null;

    if (accountId) {
      const docSnap = await adminDb.collection("whatsappAccounts").doc(accountId).get();
      if (docSnap.exists && docSnap.data()?.workspaceId === workspaceId) {
        accountData = docSnap.data();
      }
    } else {
      // Grab the first active account for the workspace
      const snapshot = await adminDb
        .collection("whatsappAccounts")
        .where("workspaceId", "==", workspaceId)
        .where("status", "==", "active")
        .limit(1)
        .get();
      if (!snapshot.empty) {
        accountData = snapshot.docs[0].data();
      }
    }

    if (!accountData) {
      return apiError("No connected WhatsApp Business Account found for this workspace.", 404);
    }

    const { phoneNumberId, accessToken } = accountData;

    if (!phoneNumberId || !accessToken) {
      return apiError("WhatsApp integration is misconfigured (missing phone ID or access token).", 400);
    }

    // Build the Meta message payload
    let payload: WhatsAppMessagePayload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type
    };

    if (type === "text") {
      payload.text = { body: text! };
    } else if (type === "template") {
      payload.template = {
        name: templateName!,
        language: { code: templateLanguage || "en_US" },
        components: templateParams?.length
          ? [{ type: "body", parameters: templateParams.map(v => ({ type: "text", text: v })) }]
          : undefined
      };
    } else if (type === "image") {
      payload.image = mediaUrl?.startsWith("http")
        ? { link: mediaUrl, caption: mediaCaption }
        : { id: mediaUrl!, caption: mediaCaption };
    } else if (type === "document") {
      payload.document = mediaUrl?.startsWith("http")
        ? { link: mediaUrl, caption: mediaCaption, filename: mediaCaption || "document.pdf" }
        : { id: mediaUrl!, caption: mediaCaption, filename: mediaCaption || "document.pdf" };
    }

    // Send via Meta Graph API
    const result = await sendMetaWhatsAppMessage(phoneNumberId, accessToken, payload);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    // Persist outbound message to Firestore
    const msgRef = adminDb.collection("messages").doc();
    const savedMsg = {
      id: msgRef.id,
      workspaceId,
      whatsappAccountId: accountData.id,
      direction: "outbound",
      type,
      content: type === "text" ? { text: text! } : { template: templateName! },
      status: "sent",
      metaMessageId: result.messageId || null,
      timestamp: FieldValue.serverTimestamp()
    };
    await msgRef.set(savedMsg);

    // Push event to SSE stream channel on Redis
    const channelKey = `inbox_stream:${workspaceId}`;
    try {
      await redis.rpush(channelKey, JSON.stringify({
        eventType: "WHATSAPP_MESSAGE_SENT",
        messageId: msgRef.id,
        accountId: accountData.id,
        body: type === "text" ? text! : `[${type} template: ${templateName}]`,
        direction: "outbound",
        to,
        createdAt: new Date().toISOString()
      }));
    } catch (redisErr) {
      console.warn("Failed to publish SSE live stream event:", redisErr);
    }

    return apiSuccess({
      success: true,
      messageId: result.messageId,
      message: savedMsg
    });
  } catch (error: any) {
    console.error("[Send Message API Error]:", error);
    return apiError("Failed to send WhatsApp message.", 500);
  }
}
