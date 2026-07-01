"use server";

import { WorkflowStep } from "@/types/workflows";
import { WorkflowExecutor } from "@/lib/workflow-engine";
import { revalidatePath } from "next/cache";

export async function executeWorkflowAction(
  workflowId: string,
  steps: WorkflowStep[],
  context: Record<string, any>
) {
  try {
    const executor = new WorkflowExecutor(steps);
    const runResult = await executor.execute(workflowId, context);

    revalidatePath(`/workflows/${workflowId}`);
    return { success: true, run: runResult };
  } catch (error: any) {
    return { error: error.message };
  }
}
