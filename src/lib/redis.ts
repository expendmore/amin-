import { Redis } from "@upstash/redis";

// Dynamic initialization: use Upstash Redis if configured, otherwise fall back
// to a safe in-memory mock client for local development to prevent crashes.
let redisClient: any;

const hasRedisEnv = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

if (hasRedisEnv) {
  redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
} else {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[Redis] Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN. " +
      "Falling back to memory-based cache for local development."
    );
  }
  
  const memoryStore = new Map<string, string>();

  redisClient = {
    get: async (key: string) => {
      return memoryStore.get(key) || null;
    },
    set: async (key: string, value: string, options?: { ex?: number }) => {
      memoryStore.set(key, value);
      return "OK";
    },
    del: async (key: string) => {
      const existed = memoryStore.has(key);
      memoryStore.delete(key);
      return existed ? 1 : 0;
    },
    rpush: async (key: string, value: string) => {
      // In-memory list emulation is skipped/unnecessary for local stream rendering
      return 1;
    }
  };
}

export const redis = redisClient;

// Cache keys utility helpers
export const cacheKeys = {
  session: (userId: string) => `session:${userId}`,
  workspace: (workspaceId: string) => `workspace:${workspaceId}`,
  rateLimit: (apiKey: string) => `ratelimit:${apiKey}`
};

// Caching service wrappers
export async function getCachedValue<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);
    if (!data) return null;
    return typeof data === "string" ? JSON.parse(data) : (data as T);
  } catch (error) {
    console.error(`[Redis Cache GET Error]: Failed to retrieve key ${key}`, error);
    return null;
  }
}

export async function setCachedValue<T>(key: string, value: T, ttlSeconds: number = 3600): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(value), { ex: ttlSeconds });
  } catch (error) {
    console.error(`[Redis Cache SET Error]: Failed to set key ${key}`, error);
  }
}

export async function invalidateCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.error(`[Redis Cache DEL Error]: Failed to delete key ${key}`, error);
  }
}
