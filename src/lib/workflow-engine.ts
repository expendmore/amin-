/**
 * Workflow Engine — Firestore-backed execution engine
 *
 * Executes multi-step workflows defined as directed graphs.
 * Persists execution logs to Firestore `workflowExecutions` collection.
 */

import { WorkflowStep, WorkflowRun } from "@/types/workflows";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// Dynamic Expression Parser evaluating {{variableName}} templates
export function evaluateTemplateExpression(
  template: string,
  context: Record<string, unknown>
): string {
  if (!template) return "";
  return template.replace(/\{\{\s*([^}]+)\s*\}\}/g, (_, key) => {
    const value = context[key.trim()];
    return value !== undefined ? String(value) : `{{${key}}}`;
  });
}

export class WorkflowExecutor {
  private stepsMap: Map<string, WorkflowStep> = new Map();
  private logs: string[] = [];

  constructor(steps: WorkflowStep[]) {
    steps.forEach((step) => {
      this.stepsMap.set(step.id, step);
    });
  }

  public async execute(
    workspaceId: string,
    workflowId: string,
    initialContext: Record<string, unknown> = {}
  ): Promise<WorkflowRun> {
    const startedTime = Date.now();
    const context = { ...initialContext };
    this.logs.push(`[Workflow Initialized]: Starting workflow ${workflowId}`);

    // Locate initial trigger step
    const triggerStep = Array.from(this.stepsMap.values()).find(
      (s) => s.type === "trigger"
    );

    if (!triggerStep) {
      this.logs.push("[Workflow Execution Error]: No entrypoint trigger step configured.");
      return this.buildRunResult(workspaceId, workflowId, startedTime, "failed");
    }

    let currentStep: WorkflowStep | undefined = triggerStep;

    try {
      while (currentStep) {
        this.logs.push(
          `[Executing Step ${currentStep.id} (${currentStep.type})]: ${currentStep.label}`
        );

        if (currentStep.type === "ai_prompt") {
          const prompt = evaluateTemplateExpression(
            currentStep.config.promptTemplate || "",
            context
          );
          this.logs.push(`[AI Prompter Node Prompt]: Resolved prompt: "${prompt}"`);
          context[`${currentStep.id}_output`] = "Mocked AI output based on contextual parameters.";
        } else if (
          currentStep.type === "action" &&
          currentStep.config.actionType === "condition"
        ) {
          const conditionKey: string = currentStep.config.conditionKey || "input";
          const matchValue: string = currentStep.config.matchValue || "yes";
          const isMatch: boolean = String(context[conditionKey]) === String(matchValue);

          this.logs.push(
            `[Condition Node Check]: Asserting ${conditionKey} == ${matchValue}. Match: ${isMatch}`
          );

          const nextStepId: string | undefined = isMatch
            ? currentStep.nextStepIds?.[0]
            : currentStep.nextStepIds?.[1];

          currentStep = nextStepId ? this.stepsMap.get(nextStepId) : undefined;
          continue;
        }

        const nextId = currentStep.nextStepIds?.[0];
        currentStep = nextId ? this.stepsMap.get(nextId) : undefined;
      }

      this.logs.push("[Workflow Finished]: Execution sequence completed successfully.");
      return this.buildRunResult(workspaceId, workflowId, startedTime, "success");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      this.logs.push(`[Execution Fatal Failure]: ${message}`);
      return this.buildRunResult(workspaceId, workflowId, startedTime, "failed");
    }
  }

  private async buildRunResult(
    workspaceId: string,
    workflowId: string,
    startedTime: number,
    status: "success" | "failed"
  ): Promise<WorkflowRun> {
    const latencyMs = Date.now() - startedTime;

    // Persist execution record to Firestore
    if (adminDb) {
      try {
        await adminDb.collection("workflowExecutions").add({
          workspaceId,     // Required for multi-tenant isolation
          workflowId,
          status,
          logs: this.logs,
          latencyMs,
          createdAt: FieldValue.serverTimestamp(),
        });
      } catch (err) {
        console.error("[WorkflowExecutor] Failed to persist execution to Firestore:", err);
      }
    }

    return {
      id: `run_${Date.now()}`,
      workflowId,
      status,
      startedAt: new Date(startedTime).toISOString(),
      latencyMs,
      logs: this.logs,
    };
  }
}
