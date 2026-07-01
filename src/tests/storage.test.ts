import { describe, it, expect, vi, beforeEach } from "vitest";
import { StorageManager } from "@/lib/storage";
import { createFolderAction, uploadFileAction, deleteFileAction } from "@/app/actions/storage";

// Mock Prisma actions
vi.mock("@prisma/client", () => {
  const mockPrisma = {
    folder: {
      create: vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: "fold-123", ...data }))
    },
    file: {
      create: vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: "file-123", ...data })),
      delete: vi.fn().mockResolvedValue({ id: "file-123", name: "invoice.pdf" })
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

describe("Enterprise File Storage Backend Manager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should select local storage provider when env parameters are empty", async () => {
    const manager = new StorageManager();
    const url = await manager.getSignedUrl("report.pdf", "invoice-bucket");
    expect(url).toContain("token=mock_local_token");
  });

  it("should create folder record in postgres successfully", async () => {
    const res = await createFolderAction("ws-123", "Corporate Reports");
    expect(res.success).toBe(true);
    expect(res.folder?.name).toBe("Corporate Reports");
  });

  it("should create file record in postgres successfully", async () => {
    const res = await uploadFileAction("fold-123", "invoice.pdf", 1024, "https://storage.expendmore.com/files/invoice.pdf");
    expect(res.success).toBe(true);
    expect(res.file?.sizeBytes).toBe(1024);
  });

  it("should delete file successfully", async () => {
    const res = await deleteFileAction("file-123");
    expect(res.success).toBe(true);
  });
});
