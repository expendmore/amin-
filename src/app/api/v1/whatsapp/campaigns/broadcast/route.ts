/**
 * Campaign Broadcast API
 * POST /api/v1/whatsapp/campaigns/broadcast
 *   – Enqueues batch send jobs for a campaign to all recipients.
 *   – Throttled via Redis queue (WHATSAPP_DISPATCH) to avoid Meta rate limits.
 *
 * GET /api/v1/whatsapp/campaigns/broadcast?workspaceId=xxx
 *   – Returns the current dispatch status and counters for a campaign.
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireWorkspaceAccess, apiError, apiSuccess } from "@/lib/api-auth";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { enqueueJob, Queues } from "@/lib/queue";
import { sendMetaWhatsAppMessage } from "@/lib/whatsapp";

interface RecipientEntry {
  phone: string;
  params?: string[]; // Template variables for this recipient
}

interface BroadcastBody {
  workspaceId: string;
  campaignName: string;
  templateName: string;
  templateLanguage?: string;
  recipients: RecipientEntry[];
  scheduleAt?: string; // ISO timestamp for delayed dispatch
}

// ── POST: Launch broadcast campaign ─────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const { uid, error: authErr } = await requireAuth(request);
    if (authErr) return apiError(authErr, 401);

    const body: BroadcastBody = await request.json();
    const { workspaceId, campaignName, templateName, templateLanguage, recipients, scheduleAt } = body;

    if (!workspaceId || !templateName || !recipients?.length) {
      return apiError("workspaceId, templateName, and recipients[] are required.", 400);
    }

    const { error: wsErr } = await requireWorkspaceAccess(workspaceId, uid);
    if (wsErr) return apiError(wsErr, 403);

    if (!adminDb) {
      return apiError("Database not available", 500);
    }

    // Resolve workspace WABA account credentials
    const accountSnap = await adminDb
      .collection("whatsappAccounts")
      .where("workspaceId", "==", workspaceId)
      .where("status", "==", "active")
      .limit(1)
      .get();

    if (accountSnap.empty) {
      return apiError("No active WhatsApp Business Account connected to this workspace.", 404);
    }

    const account = accountSnap.docs[0].data();
    const accountId = accountSnap.docs[0].id;
    const { phoneNumberId, accessToken } = account;

    if (!phoneNumberId || !accessToken) {
      return apiError("WhatsApp integration is misconfigured (missing phone ID or access token).", 400);
    }

    // Calculate delay for scheduled campaigns
    const delaySeconds = scheduleAt
      ? Math.max(0, Math.floor((new Date(scheduleAt).getTime() - Date.now()) / 1000))
      : 0;

    // Enqueue one job per recipient (throttled via Redis queue)
    const BATCH_DELAY_SECONDS = 1; // 1 msg/sec safe rate
    const jobIds: string[] = [];

    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      const jobDelay = delaySeconds + i * BATCH_DELAY_SECONDS;

      const jobId = `campaign_${campaignName}_${recipient.phone}_${Date.now()}`;
      jobIds.push(jobId);

      await enqueueJob(
        Queues.WHATSAPP_DISPATCH,
        {
          jobId,
          workspaceId,
          phoneNumberId,
          accessToken,
          to: recipient.phone,
          templateName,
          templateLanguage: templateLanguage || "en_US",
          templateParams: recipient.params || [],
          campaignName
        },
        jobDelay
      );
    }

    // For small batches (≤ 5), also send immediately as a demo
    let immediateResults: any[] = [];
    if (recipients.length <= 5) {
      for (const recipient of recipients) {
        const result = await sendMetaWhatsAppMessage(phoneNumberId, accessToken, {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: recipient.phone,
          type: "template",
          template: {
            name: templateName,
            language: { code: templateLanguage || "en_US" },
            components: recipient.params?.length
              ? [{ type: "body", parameters: recipient.params.map(v => ({ type: "text", text: v })) }]
              : undefined
          }
        });
        immediateResults.push({ phone: recipient.phone, success: result.success, data: result.data });

        // Save outbound record for each sent message
        const msgRef = adminDb.collection("messages").doc();
        await msgRef.set({
          id: msgRef.id,
          workspaceId,
          whatsappAccountId: accountId,
          direction: "outbound",
          type: "template",
          content: { template: templateName },
          status: result.success ? "sent" : "failed",
          metaMessageId: result.messageId || null,
          timestamp: FieldValue.serverTimestamp()
        });
      }
    }

    // Record campaign entry
    const campaignRef = adminDb.collection("campaigns").doc();
    await campaignRef.set({
      id: campaignRef.id,
      workspaceId,
      name: campaignName,
      templateId: templateName,
      whatsappAccountId: accountId,
      status: recipients.length > 5 ? "running" : "completed",
      totalRecipients: recipients.length,
      sent: recipients.length,
      createdAt: FieldValue.serverTimestamp()
    });

    return apiSuccess({
      success: true,
      campaignName,
      totalRecipients: recipients.length,
      jobsEnqueued: jobIds.length,
      scheduledAt: scheduleAt || "immediate",
      immediateResults: immediateResults.length ? immediateResults : undefined
    });

  } catch (error: any) {
    console.error("[Campaign Broadcast Error]:", error);
    return apiError("Failed to launch campaign.", 500);
  }
}

// ── GET: Campaign status ─────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { uid, error: authErr } = await requireAuth(request);
    if (authErr) return apiError(authErr, 401);

    const workspaceId = request.nextUrl.searchParams.get("workspaceId");
    if (!workspaceId) return apiError("workspaceId is required.", 400);

    const { error: wsErr } = await requireWorkspaceAccess(workspaceId, uid);
    if (wsErr) return apiError(wsErr, 403);

    if (!adminDb) {
      return apiError("Database not available", 500);
    }

    // Get stats from messages collection
    const sentSnapshot = await adminDb
      .collection("messages")
      .where("workspaceId", "==", workspaceId)
      .where("direction", "==", "outbound")
      .get();

    const receivedSnapshot = await adminDb
      .collection("messages")
      .where("workspaceId", "==", workspaceId)
      .where("direction", "==", "inbound")
      .get();

    const stats = {
      totalSent: sentSnapshot.size,
      totalReceived: receivedSnapshot.size
    };

    // Get campaigns list
    const campaignsSnap = await adminDb
      .collection("campaigns")
      .where("workspaceId", "==", workspaceId)
      .get();

    const campaigns = campaignsSnap.docs.map(doc => doc.data());

    return apiSuccess({
      workspaceId,
      stats,
      campaigns
    });
  } catch (error: any) {
    console.error("[Campaign Status GET Error]:", error);
    return apiError("Failed to fetch campaign stats.", 500);
  }
}
