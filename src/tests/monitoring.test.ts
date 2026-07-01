import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateCorrelationId, logEventJSON, runSystemHealthCheck } from "@/lib/observability";
import { runHealthChecksAction, triggerSystemAlertAction } from "@/app/actions/monitoring";

// Mock Prisma actions
vi.mock("@prisma/client", () => {
  const mockPrisma = {
    $queryRaw: vi.fn().mockResolvedValue([{ 1: 1 }]),
    auditLog: {
      create: vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: "log-123", ...data }))
    }
  };
  return {
    PrismaClient: function() {
      return mockPrisma;
    }
  };
});

// Mock Next.js cached revalidations
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn()
}));

describe("Enterprise Observability, Tracing & Monitoring Platform", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should generate traceId and spanId correlation IDs", () => {
    const ids = generateCorrelationId();
    expect(ids.traceId.length).toBe(32);
    expect(ids.spanId.length).toBe(16);
  });

  it("should log structured JSON and redact sensitive credentials", () => {
    const consoleSpy = vi.spyOn(console, "log");
    logEventJSON("info", "User authentication session started", {
      username: "aditya",
      apiKey: "secret_value_key_124"
    });

    expect(consoleSpy).toHaveBeenCalled();
    const logString = consoleSpy.mock.calls[0][0];
    const parsed = JSON.parse(logString);
    expect(parsed.apiKey).toBe("[REDACTED]");
    consoleSpy.mockRestore();
  });

  it("should report database connectivity health successfully", async () => {
    const outcome = await runSystemHealthCheck();
    expect(outcome.database).toBe("healthy");
    expect(outcome.overall).toBe("healthy");
  });

  it("should execute run health checks server action successfully", async () => {
    const res = await runHealthChecksAction();
    expect(res.success).toBe(true);
    expect(res.health?.overall).toBe("healthy");
  });

  it("should dispatch alerting action successfully and record logs", async () => {
    const res = await triggerSystemAlertAction("High Latency on API Gateway", "critical");
    expect(res.success).toBe(true);
  });
});
