import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { sendMetaWhatsAppMessage } from "@/lib/whatsapp";
import { AIGateway } from "@/services/ai-gateway/gateway";
import { redis } from "@/lib/redis";

// Push live updates to SSE stream channel for the workspace
async function publishToStream(workspaceId: string, eventType: string, data: Record<string, any>) {
  try {
    await redis.rpush(`inbox_stream:${workspaceId}`, JSON.stringify({ eventType, ...data }));
  } catch (err) {
    console.error(`[Stream Publish Error] channel inbox_stream:${workspaceId}`, err);
  }
}

// Verify webhook URL from Meta (WhatsApp Cloud API)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN || "expendmore_ai_token_123";

  if (mode && token) {
    if (mode === "subscribe" && token === verifyToken) {
      console.log("WHATSAPP_WEBHOOK_VERIFIED");
      return new Response(challenge, { status: 200 });
    } else {
      return new Response("Forbidden", { status: 403 });
    }
  }
  return new Response("Bad Request", { status: 400 });
}

// Receive payload from WhatsApp API
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("WhatsApp Webhook Event Received:", JSON.stringify(body));

    const entry = body.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const metadata = change?.metadata;
    const message = change?.messages?.[0];
    const contact = change?.contacts?.[0];

    if (!adminDb) {
      return NextResponse.json({ status: "DATABASE_NOT_AVAILABLE" }, { status: 200 });
    }

    // Process incoming message
    if (message) {
      const from = message.from; // Customer's phone number
      const bodyText = message.text?.body || "";
      const displayPhoneNumber = metadata?.display_phone_number || "default_test_number";

      // 1. Identify connected WhatsAppAccount in Firestore
      const accountSnap = await adminDb
        .collection("whatsappAccounts")
        .where("phoneNumber", "==", displayPhoneNumber)
        .limit(1)
        .get();

      let accountData: any = null;
      let accountId: string = "";

      if (!accountSnap.empty) {
        accountId = accountSnap.docs[0].id;
        accountData = accountSnap.docs[0].data();
      } else {
        // Fallback: Bind to first active workspace in database
        const defaultWS = await adminDb.collection("workspaces").limit(1).get();
        if (defaultWS.empty) {
          return NextResponse.json({ status: "NO_WORKSPACE_AVAILABLE" }, { status: 200 });
        }

        const wsId = defaultWS.docs[0].id;
        const newRef = adminDb.collection("whatsappAccounts").doc();
        accountId = newRef.id;
        accountData = {
          id: accountId,
          workspaceId: wsId,
          phoneNumber: displayPhoneNumber,
          displayName: "Auto provisioned account",
          status: "active",
        };
        await newRef.set(accountData);
      }

      const workspaceId = accountData.workspaceId;

      // 2. Create or sync CRM Contact in Firestore
      const contactName = contact?.profile?.name || `WhatsApp Contact ${from}`;
      const contactSnap = await adminDb
        .collection("contacts")
        .where("workspaceId", "==", workspaceId)
        .where("phone", "==", from)
        .limit(1)
        .get();

      let contactId: string = "";
      if (contactSnap.empty) {
        const crmRef = adminDb.collection("contacts").doc();
        contactId = crmRef.id;
        await crmRef.set({
          id: contactId,
          workspaceId,
          phone: from,
          name: contactName,
          email: `${from}@whatsapp.com`,
          tags: ["inbound"],
          optedOut: false,
          lastMessageAt: FieldValue.serverTimestamp(),
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp()
        });
      } else {
        contactId = contactSnap.docs[0].id;
        await adminDb.collection("contacts").doc(contactId).update({
          lastMessageAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp()
        });
      }

      // 3. Save the inbound message to Firestore messages collection
      const msgRef = adminDb.collection("messages").doc();
      const savedMessage = {
        id: msgRef.id,
        workspaceId,
        contactId,
        whatsappAccountId: accountId,
        direction: "inbound",
        type: "text",
        content: { text: bodyText || `[Media/Interactive of type ${message.type}]` },
        status: "delivered",
        metaMessageId: message.id || null,
        timestamp: FieldValue.serverTimestamp()
      };
      await msgRef.set(savedMessage);

      // 4. Push live stream notification to SSE Redis channel
      await publishToStream(workspaceId, "WHATSAPP_MESSAGE_RECEIVED", {
        messageId: msgRef.id,
        accountId: accountId,
        body: savedMessage.content.text,
        direction: "inbound",
        from,
        contactName,
        createdAt: new Date().toISOString()
      });

      // 5. Trigger AI agent auto-reply if chatbot builder is configured
      const chatbotSnap = await adminDb
        .collection("chatbots")
        .where("workspaceId", "==", workspaceId)
        .where("status", "==", "active")
        .limit(1)
        .get();

      if (!chatbotSnap.empty && bodyText) {
        const chatbot = chatbotSnap.docs[0].data();
        console.log(`[AI Autoreply]: Processing message through chatbot "${chatbot.name}"`);

        const aiResponse = await AIGateway.execute({
          modelName: chatbot.modelName || "gemini-1.5-flash",
          providerName: "google",
          messages: [
            { role: "system", content: chatbot.systemPrompt || "You are a concise customer support agent." },
            { role: "user", content: bodyText }
          ]
        }, {
          userId: "system",
          workspaceId
        });

        if (aiResponse.success && aiResponse.choices?.[0]?.message) {
          const replyText = aiResponse.choices[0].message;
          const accessToken = accountData.accessToken || process.env.WHATSAPP_ACCESS_TOKEN || "mock_access_token";

          // Send response back to customer via Meta API
          const sendResult = await sendMetaWhatsAppMessage(
            metadata?.phone_number_id || accountData.phoneNumberId || "mock_phone_id",
            accessToken,
            {
              messaging_product: "whatsapp",
              to: from,
              type: "text",
              text: { body: replyText }
            }
          );

          if (sendResult.success) {
            // Save outbound reply to Firestore messages
            const replyRef = adminDb.collection("messages").doc();
            const savedReply = {
              id: replyRef.id,
              workspaceId,
              contactId,
              whatsappAccountId: accountId,
              direction: "outbound",
              type: "text",
              content: { text: replyText },
              status: "sent",
              metaMessageId: sendResult.messageId || null,
              timestamp: FieldValue.serverTimestamp()
            };
            await replyRef.set(savedReply);

            // Push realtime update for outbound message to SSE stream
            await publishToStream(workspaceId, "WHATSAPP_MESSAGE_SENT", {
              messageId: replyRef.id,
              accountId: accountId,
              body: replyText,
              direction: "outbound",
              createdAt: new Date().toISOString()
            });
          }
        }
      }
    }

    return NextResponse.json({ status: "EVENT_RECEIVED" }, { status: 200 });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { status: "PROCESSED_WITH_ERRORS", message: error.message },
      { status: 200 }
    );
  }
}
