import { describe, it, expect, vi, beforeEach } from "vitest";
import { RealtimeEventBus, PresenceEngine, simulateAiTokenStream } from "@/lib/realtime-engine";
import { publishRealtimeEventAction, updateUserPresenceAction } from "@/app/actions/realtime";

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
  getCachedValue: vi.fn().mockResolvedValue({ userId: "u-123", status: "online" }),
  setCachedValue: vi.fn().mockResolvedValue(undefined)
}));

// Mock Next.js cached revalidations
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn()
}));

describe("Enterprise Realtime Engine & Presence Monitor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should publish realtime messages via event bus", async () => {
    const bus = new RealtimeEventBus();
    const res = await bus.publishEvent("chan-789", "system", "typing_started", { userId: "usr-456" });
    expect(res.channelId).toBe("chan-789");
    expect(res.eventType).toBe("typing_started");
  });

  it("should track user online statuses in cache registers", async () => {
    const presence = new PresenceEngine();
    const res = await presence.trackPresence("ws-123", "usr-456", "online", "/whatsapp/inbox");
    expect(res.status).toBe("online");
    expect(res.currentScreen).toBe("/whatsapp/inbox");
  });

  it("should simulate AI stream tokens generator dispatches", async () => {
    const stream = simulateAiTokenStream("Summarize details");
    const chunks: string[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks.join("")).toContain("streamed AI response");
  });

  it("should run publish realtime server action successfully", async () => {
    const res = await publishRealtimeEventAction("chan-789", "message_received", { text: "Hello" });
    expect(res.success).toBe(true);
    expect(res.message?.eventType).toBe("message_received");
  });

  it("should run update presence server action successfully", async () => {
    const res = await updateUserPresenceAction("ws-123", "usr-456", "idle", "/workflows");
    expect(res.success).toBe(true);
    expect(res.presence?.status).toBe("idle");
  });
});
