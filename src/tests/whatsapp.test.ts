import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendMessageAction, syncTemplatesAction } from "@/app/actions/whatsapp";

// Mock Prisma actions
vi.mock("@prisma/client", () => {
  const mockPrisma = {
    apiKey: {
      findFirst: vi.fn().mockResolvedValue({ secretValue: "test-token" })
    },
    whatsAppMessage: {
      create: vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: "msg-123", ...data }))
    },
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
  setCachedValue: vi.fn().mockResolvedValue(undefined),
  cacheKeys: {
    workspace: (id: string) => `workspace:${id}`
  }
}));

// Mock Next.js cached revalidations
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn()
}));

// Mock WhatsApp Meta API connections
vi.mock("@/lib/whatsapp", () => ({
  sendMetaWhatsAppMessage: vi.fn().mockResolvedValue({ success: true, data: { message_id: "wam-123" } }),
  syncMetaWhatsAppTemplates: vi.fn().mockResolvedValue({ success: true, templates: [{ name: "welcome_onboarding" }] })
}));

describe("Meta WhatsApp Cloud API Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should send outbound WhatsApp message successfully and save to database", async () => {
    const res = await sendMessageAction("ws-123", "acct-456", "+919999988888", "Hello from ExpendMore!");
    expect(res.success).toBe(true);
    expect(res.message?.body).toBe("Hello from ExpendMore!");
  });

  it("should sync WhatsApp templates successfully and create audit logs", async () => {
    const res = await syncTemplatesAction("ws-123", "acct-456", "biz-789");
    expect(res.success).toBe(true);
    expect(res.templates).toBeDefined();
  });
});
