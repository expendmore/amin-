import { redis } from "./redis";
import crypto from "crypto";

export interface QueueJob<T = any> {
  id: string;
  queueName: string;
  payload: T;
  retryCount: number;
  maxRetries: number;
  runAfterTimestamp: number;
}

// Queue names routing targets mappings
export const Queues = {
  WHATSAPP_DISPATCH: "queue:whatsapp_dispatch",
  WORKFLOW_EXECUTION: "queue:workflow_execution",
  BILLING_RECONCILIATION: "queue:billing_reconciliation",
  DEAD_LETTER_QUEUE: "queue:dead_letter_queue"
};

// Queue operations wrappers
export async function enqueueJob<T>(queueName: string, payload: T, delaySeconds: number = 0, maxRetries: number = 3): Promise<void> {
  const job: QueueJob<T> = {
    id: `job:${crypto.randomUUID()}`,
    queueName,
    payload,
    retryCount: 0,
    maxRetries,
    runAfterTimestamp: Date.now() + (delaySeconds * 1000)
  };

  try {
    // Push task item into Redis list database index
    await redis.rpush(queueName, JSON.stringify(job));
  } catch (error) {
    console.error(`[Queue Enqueue Error]: Failed to push job ${job.id} to ${queueName}`, error);
  }
}

export async function dequeueJob<T>(queueName: string): Promise<QueueJob<T> | null> {
  try {
    const rawJob = await redis.lpop(queueName);
    if (!rawJob) return null;
    return typeof rawJob === "string" ? JSON.parse(rawJob) : (rawJob as QueueJob<T>);
  } catch (error) {
    console.error(`[Queue Dequeue Error]: Failed to pop job from ${queueName}`, error);
    return null;
  }
}

export async function sendToDeadLetterQueue<T>(job: QueueJob<T>, errorMessage: string): Promise<void> {
  const deadJob = {
    ...job,
    failedReason: errorMessage,
    failedAt: new Date().toISOString()
  };
  try {
    await redis.rpush(Queues.DEAD_LETTER_QUEUE, JSON.stringify(deadJob));
    console.warn(`[Queue DLQ Redirect]: Job ${job.id} shifted to DLQ due to failure: ${errorMessage}`);
  } catch (error) {
    console.error(`[Queue DLQ Error]: Failed to push job ${job.id} to DLQ`, error);
  }
}
