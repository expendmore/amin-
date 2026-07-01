"use server";

import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

export async function createSubscriptionAction(workspaceId: string, planTier: string) {
  if (!workspaceId || !planTier) {
    return { error: "Workspace ID and plan tier are required." };
  }
  if (!adminDb) return { error: "Database not available" };

  try {
    const subRef = adminDb.collection("subscriptions").doc();
    const subscription = {
      id: subRef.id,
      workspaceId,
      planTier,
      status: "active",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: FieldValue.serverTimestamp()
    };
    await subRef.set(subscription);

    await adminDb.collection("auditLogs").add({
      workspaceId,
      userId: "system",
      action: `Subscribed workspace ${workspaceId} to plan ${planTier}`,
      timestamp: FieldValue.serverTimestamp()
    });

    revalidatePath("/billing");
    return { success: true, subscription };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function recordOrderAction(workspaceId: string, amount: number, currency: string) {
  if (!workspaceId || amount <= 0 || !currency) {
    return { error: "Workspace ID, positive amount, and currency are required." };
  }
  if (!adminDb) return { error: "Database not available" };

  try {
    const orderRef = adminDb.collection("orders").doc();
    const order = {
      id: orderRef.id,
      workspaceId,
      amount,
      currency,
      status: "paid",
      createdAt: FieldValue.serverTimestamp()
    };
    await orderRef.set(order);

    await adminDb.collection("auditLogs").add({
      workspaceId,
      userId: "system",
      action: `Recorded order payment transaction of ${amount} ${currency} for workspace ${workspaceId}`,
      timestamp: FieldValue.serverTimestamp()
    });

    revalidatePath("/billing");
    return { success: true, order };
  } catch (error: any) {
    return { error: error.message };
  }
}

export interface GSTCalculationOutcome {
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  totalWithTax: number;
}

export async function calculateGSTAction(amount: number, isInterState: boolean): Promise<GSTCalculationOutcome> {
  const rate = 18; // 18% standard GST rate
  const tax = (amount * rate) / 100;

  if (isInterState) {
    return {
      cgst: 0,
      sgst: 0,
      igst: tax,
      totalTax: tax,
      totalWithTax: amount + tax
    };
  } else {
    const splitTax = tax / 2;
    return {
      cgst: splitTax,
      sgst: splitTax,
      igst: 0,
      totalTax: tax,
      totalWithTax: amount + tax
    };
  }
}
