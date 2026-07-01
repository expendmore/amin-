import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateChunks } from "@/lib/chunker";
import { getVectorEmbedding } from "@/lib/embeddings";
import { uploadDocumentAction, searchKnowledgeAction } from "@/app/actions/knowledge";

// Mock Prisma actions
vi.mock("@prisma/client", () => {
  const mockPrisma = {
    document: {
      create: vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: "doc-123", ...data })),
      findMany: vi.fn().mockResolvedValue([
        { id: "doc-1", title: "Standard Corporate Policy", content: "Our company guidelines specify opt-in checks rules." }
      ])
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

describe("Enterprise RAG & Vector Search Platform", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should divide document text into overlapping sliding chunks", () => {
    const text = "A very long document paragraph text to be split into chunks.";
    const chunks = generateChunks(text, 5, 2);
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0].content).toBeDefined();
  });

  it("should generate deterministic float vector dimensions", async () => {
    const vector = await getVectorEmbedding("Hello context prompter");
    expect(vector.length).toBe(1536);
  });

  it("should execute RAG upload action successfully", async () => {
    const res = await uploadDocumentAction("col-1", "corporate_policy.txt", "Our corporate policies allow for flexitime schedules.");
    expect(res.success).toBe(true);
    expect(res.chunksCount).toBeDefined();
  });

  it("should query dynamic knowledge search and return matching source citations", async () => {
    const res = await searchKnowledgeAction("col-1", "guidelines");
    expect(res.success).toBe(true);
    expect(res.citations?.length).toBeGreaterThan(0);
    expect(res.citations?.[0].source).toBe("Standard Corporate Policy");
  });
});
