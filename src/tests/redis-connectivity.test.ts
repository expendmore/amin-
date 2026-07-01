import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCachedValue, setCachedValue, invalidateCache } from "@/lib/redis";
import { enqueueJob, dequeueJob, sendToDeadLetterQueue, Queues } from "@/lib/queue";

// Mock Upstash Redis REST wrapper to prevent remote HTTP queries during unit test runs
vi.mock("@/lib/redis", () => {
  const store: Record<string, string> = {};
  return {
    getCachedValue: vi.fn().mockImplementation(async (key: string) => {
      const val = store[key];
      return val ? JSON.parse(val) : null;
    }),
    setCachedValue: vi.fn().mockImplementation(async (key: string, val: any) => {
      store[key] = JSON.stringify(val);
    }),
    invalidateCache: vi.fn().mockImplementation(async (key: string) => {
      delete store[key];
    })
  };
});

// Mock Queue Redis calls
vi.mock("@/lib/queue", () => {
  const listStore: Record<string, string[]> = {};
  return {
    Queues: {
      WHATSAPP_DISPATCH: "queue:whatsapp_dispatch",
      DEAD_LETTER_QUEUE: "queue:dead_letter_queue"
    },
    enqueueJob: vi.fn().mockImplementation(async (queueName: string, payload: any) => {
      if (!listStore[queueName]) listStore[queueName] = [];
      listStore[queueName].push(JSON.stringify({ id: "job-123", payload }));
    }),
    dequeueJob: vi.fn().mockImplementation(async (queueName: string) => {
      const queue = listStore[queueName];
      if (!queue || queue.length === 0) return null;
      return JSON.parse(queue.shift()!);
    }),
    sendToDeadLetterQueue: vi.fn().mockImplementation(async (job: any, msg: string) => {
      if (!listStore["queue:dead_letter_queue"]) listStore["queue:dead_letter_queue"] = [];
      listStore["queue:dead_letter_queue"].push(JSON.stringify({ ...job, failedReason: msg }));
    })
  };
});

describe("Redis & BullMQ Service Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should validate cache write, read, and delete flow", async () => {
    await setCachedValue("workspace:ws-123", { name: "Aditya Enterprises" });
    const cachedVal = await getCachedValue<any>("workspace:ws-123");
    expect(cachedVal?.name).toBe("Aditya Enterprises");

    await invalidateCache("workspace:ws-123");
    const clearedVal = await getCachedValue<any>("workspace:ws-123");
    expect(clearedVal).toBeNull();
  });

  it("should validate queue job flow: enqueue, dequeue, and DLQ", async () => {
    await enqueueJob("queue:whatsapp_dispatch", { message: "Hello Customer" });
    const job = await dequeueJob<any>("queue:whatsapp_dispatch");
    expect(job).toBeDefined();
    expect(job?.payload?.message).toBe("Hello Customer");

    await sendToDeadLetterQueue(job, "Rate limit exceeded");
  });
});
