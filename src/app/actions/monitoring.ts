"use server";

import { runSystemHealthCheck, AlertEngine } from "@/lib/observability";
import { revalidatePath } from "next/cache";

export async function runHealthChecksAction() {
  try {
    const outcome = await runSystemHealthCheck();
    revalidatePath("/monitoring/uptime");
    return { success: true, health: outcome };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function triggerSystemAlertAction(title: string, severity: "low" | "medium" | "high" | "critical") {
  if (!title || !severity) {
    return { error: "Alert title and severity are required." };
  }

  try {
    const engine = new AlertEngine();
    await engine.dispatchAlert(title, severity);
    revalidatePath("/monitoring/alerts");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
