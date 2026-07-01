import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotificationEngine } from "@/lib/notifications-engine";
import {
  dispatchNotificationAction,
  markNotificationAsReadAction,
  deleteNotificationAction
} from "@/app/actions/notifications";

// Mock Prisma actions
vi.mock("@prisma/client", () => {
  const mockPrisma = {
    notification: {
      create: vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: "notif-123", ...data })),
      update: vi.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, isRead: data.isRead })),
      delete: vi.fn().mockResolvedValue({ id: "notif-123" })
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

// Mock Next.js cached revalidations
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn()
}));

describe("Enterprise Notification & Delivery Backend Engine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should dispatch notification via SMTP email and FCM push fallbacks successfully", async () => {
    const engine = new NotificationEngine();
    const result = await engine.dispatch("ws-123", ["email", "push"], {
      emailAddress: "aditya@example.com",
      deviceToken: "fcm_token_456",
      title: "System Update Scheduled",
      body: "Maintenance window begins tonight."
    });

    expect(result.results.email?.success).toBe(true);
    expect(result.results.push?.success).toBe(true);
  });

  it("should trigger dispatch server action and log audit trail", async () => {
    const res = await dispatchNotificationAction("ws-123", ["in_app"], {
      title: "New Lead Qualified",
      body: "A new custom enterprise lead qualified."
    });

    expect(res.success).toBe(true);
    expect(res.results?.in_app?.success).toBe(true);
  });

  it("should mark in-app notification status read flag in postgres successfully", async () => {
    const res = await markNotificationAsReadAction("notif-123");
    expect(res.success).toBe(true);
    expect(res.notification?.isRead).toBe(true);
  });

  it("should delete notification record from database successfully", async () => {
    const res = await deleteNotificationAction("notif-123");
    expect(res.success).toBe(true);
  });
});
