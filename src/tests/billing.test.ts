import { describe, it, expect, vi, beforeEach } from "vitest";
import { PaymentManager } from "@/lib/payments";
import { createSubscriptionAction, recordOrderAction, calculateGSTAction } from "@/app/actions/billing";

// Mock Prisma actions
vi.mock("@prisma/client", () => {
  const mockPrisma = {
    subscription: {
      create: vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: "sub-123", ...data }))
    },
    order: {
      create: vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: "ord-123", ...data }))
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
  setCachedValue: vi.fn().mockResolvedValue(undefined)
}));

// Mock Next.js cached revalidations
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn()
}));

describe("SaaS Billing, Subscription & GST Backend Manager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should select local gateway fallback when env keys are absent", async () => {
    const manager = new PaymentManager();
    const session = await manager.initiatePayment(999, "INR", "ws-123");
    expect(session.sessionId).toContain("order_rzp");
  });

  it("should record active subscription plan tiers in postgres", async () => {
    const res = await createSubscriptionAction("org-123", "PRO");
    expect(res.success).toBe(true);
    expect(res.subscription?.planTier).toBe("PRO");
  });

  it("should log purchase order dispatches in postgres", async () => {
    const res = await recordOrderAction("ws-123", 4900, "INR");
    expect(res.success).toBe(true);
    expect(res.order?.amount).toBe(4900);
  });

  it("should calculate split CGST/SGST taxes correctly on intra-state billing", async () => {
    const res = await calculateGSTAction(1000, false);
    expect(res.cgst).toBe(90);
    expect(res.sgst).toBe(90);
    expect(res.igst).toBe(0);
    expect(res.totalWithTax).toBe(1180);
  });

  it("should calculate unified IGST taxes correctly on inter-state billing", async () => {
    const res = await calculateGSTAction(1000, true);
    expect(res.cgst).toBe(0);
    expect(res.sgst).toBe(0);
    expect(res.igst).toBe(180);
    expect(res.totalWithTax).toBe(1180);
  });
});
