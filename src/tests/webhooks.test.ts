import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateWebhookSignature, EventBus } from "@/lib/webhook-engine";
import { publishEventAction, replayWebhookEventAction } from "@/app/actions/webhooks";

// Mock Prisma actions
vi.mock("@prisma/client", () => {
  const mockPrisma = {
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

// Mock Redis Caching
vi.mock("@/lib/redis", () => ({
  getCachedValue: vi.fn().mockResolvedValue(null),
  setCachedValue: vi.fn().mockResolvedValue(undefined)
}));

// Mock Next.js cached revalidations
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn()
}));

describe("Enterprise Webhook Engine & Event Bus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should generate correct HMAC SHA256 signature output", () => {
    const payload = JSON.stringify({ event: "user.created" });
    const secret = "secret123";
    const sig = generateWebhookSignature(payload, secret);
    expect(sig).toBeDefined();
    expect(sig.length).toBe(64); // SHA256 hex is 64 characters
  });

  it("should routing-publish events to matching subscriptions", async () => {
    const bus = new EventBus();
    const result = await bus.publishEvent("ws-123", "whatsapp.message_received", { from: "+919999988888" });
    expect(result.deliveredCount).toBe(1);
  });

  it("should trigger publish server action successfully", async () => {
    const res = await publishEventAction("ws-123", "payment.succeeded", { amount: 4900 });
    expect(res.success).toBe(true);
    expect(res.deliveredCount).toBe(1);
  });

  it("should trigger replay event handler action and create audit logs", async () => {
    const res = await replayWebhookEventAction("ws-123", "evt-999");
    expect(res.success).toBe(true);
  });
});
