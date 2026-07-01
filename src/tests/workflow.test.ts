import { describe, it, expect, vi, beforeEach } from "vitest";
import { evaluateTemplateExpression, WorkflowExecutor } from "@/lib/workflow-engine";
import { WorkflowStep } from "@/types/workflows";

// Mock Prisma actions
vi.mock("@prisma/client", () => {
  const mockPrisma = {
    workflowExecution: {
      create: vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: "run-123", ...data }))
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

describe("Workflow Compiler & Execution Engine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should parse and compile template expressions correctly", () => {
    const template = "Hello {{ name }}! Your order status is {{ status }}.";
    const context = { name: "Aditya", status: "dispatched" };
    const res = evaluateTemplateExpression(template, context);
    expect(res).toBe("Hello Aditya! Your order status is dispatched.");
  });

  it("should run a sequential sequence of steps successfully", async () => {
    const steps: WorkflowStep[] = [
      {
        id: "step-1",
        type: "trigger",
        label: "Manual webhook initial trigger",
        config: { triggerType: "manual" },
        nextStepIds: ["step-2"]
      },
      {
        id: "step-2",
        type: "ai_prompt",
        label: "AI prompt formatter qualification",
        config: { promptTemplate: "Summarize lead query: {{query}}" },
        nextStepIds: []
      }
    ];

    const executor = new WorkflowExecutor(steps);
    const res = await executor.execute("wf-1", { query: "I want custom pricing" });
    expect(res.status).toBe("success");
    expect(res.logs.some((l) => l.includes("Qualify"))).toBeFalsy(); // Should run formatter instead
  });
});
