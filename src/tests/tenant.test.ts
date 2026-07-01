import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createWorkspace,
  switchWorkspace,
  inviteMember,
  acceptInvite,
  suspendOrganization,
  transferWorkspaceOwnership
} from "@/app/actions/tenant";

// Mock Prisma constructible function with all necessary methods
vi.mock("@prisma/client", () => {
  const mockPrisma = {
    workspace: {
      create: vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: "ws-new", name: data.name, organizationId: data.organizationId })),
      findUnique: vi.fn().mockImplementation(({ where }) => Promise.resolve({ id: where.id, name: "Workspace Active", organizationId: "org-123", deletedAt: null }))
    },
    organization: {
      update: vi.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, name: "ExpendMore Enterprises", deletedAt: data.deletedAt }))
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

vi.mock("@/lib/redis", () => ({
  getCachedValue: vi.fn().mockResolvedValue(null),
  setCachedValue: vi.fn().mockResolvedValue(undefined),
  invalidateCache: vi.fn().mockResolvedValue(undefined),
  cacheKeys: {
    workspace: (id: string) => `workspace:${id}`
  }
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn()
}));

describe("Multi-Tenant & Workspace Switching", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a new workspace successfully within an organization", async () => {
    const res = await createWorkspace("org-123", "Marketing Cluster");
    expect(res.success).toBe(true);
    expect(res.workspace?.name).toBe("Marketing Cluster");
  });

  it("should return target workspace details during switching", async () => {
    const res = await switchWorkspace("ws-123");
    expect(res.success).toBe(true);
    expect(res.workspace?.id).toBe("ws-123");
  });

  it("should send workspace invitation successfully", async () => {
    const res = await inviteMember("ws-123", "candidate@expendmore.com", "MEMBER");
    expect(res.success).toBe(true);
    expect(res.invitation?.email).toBe("candidate@expendmore.com");
  });

  it("should accept invitation successfully", async () => {
    const res = await acceptInvite("invite-123");
    expect(res.success).toBe(true);
    expect(res.status).toBe("accepted");
  });

  it("should suspend an organization successfully", async () => {
    const res = await suspendOrganization("org-123");
    expect(res.success).toBe(true);
    expect(res.organization?.deletedAt).toBeDefined();
  });

  it("should transfer workspace ownership successfully", async () => {
    const res = await transferWorkspaceOwnership("ws-123", "user-456");
    expect(res.success).toBe(true);
  });
});
