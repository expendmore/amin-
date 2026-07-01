"use server";

import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { sendMetaWhatsAppMessage, syncMetaWhatsAppTemplates, registerMetaPhoneNumber } from "@/lib/whatsapp";
import { getCachedValue, setCachedValue, cacheKeys } from "@/lib/redis";
import { revalidatePath } from "next/cache";

// Helper to retrieve token credentials with cache fallback and workspace check
async function getWhatsAppToken(workspaceId: string, accountId: string): Promise<string> {
  const cacheKey = `whatsapp:token:${workspaceId}:${accountId}`;
  let token = await getCachedValue<string>(cacheKey);

  if (!token && adminDb) {
    const docSnap = await adminDb.collection("whatsappAccounts").doc(accountId).get();
    if (docSnap.exists) {
      const data = docSnap.data();
      if (data && data.workspaceId === workspaceId) {
        token = data.accessToken || "mock_access_token_12489";
        await setCachedValue(cacheKey, token, 3600);
      }
    }
  }
  return token || "mock_access_token_12489";
}

export async function sendMessageAction(
  workspaceId: string,
  accountId: string,
  recipient: string,
  body: string
) {
  if (!adminDb) return { error: "Database not available" };

  try {
    const accessToken = await getWhatsAppToken(workspaceId, accountId);

    // Call Meta API connection helper
    const result = await sendMetaWhatsAppMessage(accountId, accessToken, {
      messaging_product: "whatsapp",
      to: recipient,
      type: "text",
      text: { body }
    });

    if (!result.success) {
      return { error: result.error };
    }

    // Save outbound message to Firestore messages collection
    const msgRef = adminDb.collection("messages").doc();
    const msgId = msgRef.id;
    const msg = {
      id: msgId,
      workspaceId,
      whatsappAccountId: accountId,
      direction: "outbound",
      type: "text",
      content: { text: body },
      status: "sent",
      metaMessageId: result.messageId || null,
      timestamp: FieldValue.serverTimestamp()
    };
    await msgRef.set(msg);

    revalidatePath("/whatsapp/inbox");
    return { success: true, message: msg };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function syncTemplatesAction(
  workspaceId: string,
  accountId: string,
  businessId: string
) {
  if (!adminDb) return { error: "Database not available" };

  try {
    const accessToken = await getWhatsAppToken(workspaceId, accountId);

    const result = await syncMetaWhatsAppTemplates(businessId, accessToken);
    if (!result.success) {
      return { error: result.error };
    }

    // Save synced templates to Firestore and create audit log
    const batch = adminDb.batch();
    const templatesList = result.templates || [];

    for (const tpl of templatesList) {
      const tplRef = adminDb.collection("templates").doc(`${workspaceId}_${tpl.name}`);
      batch.set(tplRef, {
        id: tpl.id || `${workspaceId}_${tpl.name}`,
        workspaceId,
        metaTemplateId: tpl.id || "",
        name: tpl.name,
        category: tpl.category,
        language: tpl.language || "en_US",
        status: tpl.status,
        components: tpl.components || [],
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true });
    }

    await batch.commit();

    await adminDb.collection("auditLogs").add({
      workspaceId,
      userId: "system",
      action: `Synced ${templatesList.length} templates for account ${accountId}`,
      timestamp: FieldValue.serverTimestamp()
    });

    return { success: true, templates: templatesList };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function registerPhoneNumberAction(
  workspaceId: string,
  phoneNumberId: string,
  pin: string
) {
  try {
    // Note: accountId is same as phoneNumberId for lookup
    const accessToken = await getWhatsAppToken(workspaceId, phoneNumberId);

    const result = await registerMetaPhoneNumber(phoneNumberId, accessToken, pin);
    if (!result.success) {
      return { error: result.error };
    }

    return { success: true, data: result.data };
  } catch (error: any) {
    return { error: error.message };
  }
}
