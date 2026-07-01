import crypto from "crypto";
import { adminDb } from "./firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// OpenTelemetry Tracing identifiers generator
export function generateCorrelationId(): { traceId: string; spanId: string } {
  return {
    traceId: crypto.randomBytes(16).toString("hex"),
    spanId: crypto.randomBytes(8).toString("hex")
  };
}

// Structured JSON Logger with secret value redaction
export function logEventJSON(
  level: "info" | "warn" | "error",
  message: string,
  meta: Record<string, any> = {}
) {
  const redactedMeta = { ...meta };
  const sensitiveKeys = ["password", "secret", "token", "key", "authorization"];

  // Redact sensitive details
  Object.keys(redactedMeta).forEach((k) => {
    if (sensitiveKeys.some((s) => k.toLowerCase().includes(s))) {
      redactedMeta[k] = "[REDACTED]";
    }
  });

  const logPayload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...redactedMeta
  };

  console.log(JSON.stringify(logPayload));
}

export interface HealthCheckOutcome {
  api: "healthy" | "unhealthy";
  database: "healthy" | "unhealthy";
  redis: "healthy" | "unhealthy";
  overall: "healthy" | "unhealthy";
}

// System Health Checks Verifier
export async function runSystemHealthCheck(): Promise<HealthCheckOutcome> {
  let dbStatus: "healthy" | "unhealthy" = "healthy";
  try {
    if (!adminDb) {
      dbStatus = "unhealthy";
    } else {
      // Cheap Firestore ping check
      await adminDb.collection("healthcheck").doc("ping").get();
    }
  } catch (error) {
    dbStatus = "unhealthy";
  }

  return {
    api: "healthy",
    database: dbStatus,
    redis: "healthy", // Assuming healthy sandbox Redis context
    overall: dbStatus === "healthy" ? "healthy" : "unhealthy"
  };
}

// Alert Engine routing manager
export class AlertEngine {
  public async dispatchAlert(
    title: string,
    severity: "low" | "medium" | "high" | "critical",
    workspaceId: string = "system_workspace"
  ): Promise<boolean> {
    logEventJSON("warn", `[Alert Engine Alert]: ${title} (Severity: ${severity})`);

    // Create Incident record in Firestore auditLogs
    if (adminDb) {
      try {
        await adminDb.collection("auditLogs").add({
          workspaceId,
          userId: "system",
          action: `Generated alert: "${title}" (Severity: ${severity})`,
          timestamp: FieldValue.serverTimestamp()
        });
      } catch (err) {
        console.error("[AlertEngine] Failed to write alert to Firestore:", err);
      }
    }

    return true;
  }
}
