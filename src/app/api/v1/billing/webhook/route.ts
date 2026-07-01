import { NextRequest } from "next/server";
import { PaymentManager } from "@/lib/payments";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    const xVerify = request.headers.get("X-VERIFY");
    if (!xVerify) {
      return new Response("Missing X-VERIFY header", { status: 400 });
    }

    const body = await request.json();
    const payloadBase64 = body.response;

    if (!payloadBase64) {
      return new Response("Missing response payload", { status: 400 });
    }

    const manager = new PaymentManager();
    const isValid = manager.verifyWebhook(payloadBase64, xVerify);

    if (!isValid) {
      return new Response("Checksum verification failed", { status: 401 });
    }

    // Decode response payload
    const decodedString = Buffer.from(payloadBase64, "base64").toString("utf-8");
    const decodedPayload = JSON.parse(decodedString);

    const { success, code, data } = decodedPayload;

    if (success && code === "PAYMENT_SUCCESS" && data) {
      const transactionId = data.merchantTransactionId;
      const amountInPaise = data.amount; // in paise
      const phonePeTxId = data.transactionId;
      const userId = data.merchantUserId || "system";

      // Recover workspaceId from transactionId (format: tx_workspaceId_timestamp)
      const parts = transactionId.split("_");
      const workspaceId = parts[1] || "system_workspace";

      if (adminDb) {
        // Calculate tax breakdown (18% standard GST)
        const totalAmount = amountInPaise / 100; // in Rupees
        const baseAmount = totalAmount / 1.18;
        const totalTax = totalAmount - baseAmount;
        const cgst = totalTax / 2;
        const sgst = totalTax / 2;

        const orderRef = adminDb.collection("orders").doc(transactionId);
        const orderSnap = await orderRef.get();

        // Prevent double processing
        if (!orderSnap.exists) {
          // 1. Create order/transaction record in Firestore
          await orderRef.set({
            id: transactionId,
            workspaceId,
            userId,
            phonePeTxId,
            amount: totalAmount,
            baseAmount: Number(baseAmount.toFixed(2)),
            cgst: Number(cgst.toFixed(2)),
            sgst: Number(sgst.toFixed(2)),
            igst: 0,
            currency: "INR",
            paymentStatus: "paid",
            createdAt: FieldValue.serverTimestamp(),
          });

          // 2. Provision messaging credits (e.g. ₹1 = 10 messages)
          const creditsToDeliver = Math.round(totalAmount * 10);

          const workspaceRef = adminDb.collection("workspaces").doc(workspaceId);
          await adminDb.runTransaction(async (transaction) => {
            const wsDoc = await transaction.get(workspaceRef);
            if (wsDoc.exists) {
              const currentCredits = wsDoc.data()?.credits || 0;
              const currentPurchased = wsDoc.data()?.purchasedCredits || 0;
              transaction.update(workspaceRef, {
                credits: currentCredits + creditsToDeliver,
                purchasedCredits: currentPurchased + creditsToDeliver,
                updatedAt: FieldValue.serverTimestamp(),
              });
            }
          });

          // 3. Log details to Audit log
          await adminDb.collection("auditLogs").add({
            workspaceId,
            userId: "system",
            action: `Credited ${creditsToDeliver} messaging credits to workspace ${workspaceId} (Amt: ₹${totalAmount})`,
            timestamp: FieldValue.serverTimestamp(),
          });
        }
      }
    }

    return new Response(
      JSON.stringify({ status: "success", message: "Webhook processed successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("[PhonePe Webhook Fatal Error]:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
