import Redis from "ioredis";
import { env } from "@/lib/env";

const globalForRedis = globalThis as unknown as { redis: Redis | undefined };

export const redis =
  globalForRedis.redis ??
  new Redis(env.REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

export async function assertRateLimit(
  key: string,
  maxRequests = env.RATE_LIMIT_API_MAX,
  windowMs = env.RATE_LIMIT_API_WINDOW_MS,
) {
  if (redis.status === "wait") {
    await redis.connect();
  }

  const redisKey = `api:rl:${key}`;

  const tx = redis.multi();
  tx.incr(redisKey);
  tx.pttl(redisKey);
  const result = await tx.exec();

  const count = Number(result?.[0]?.[1] ?? 0);
  const ttl = Number(result?.[1]?.[1] ?? -1);

  if (count === 1 || ttl < 0) {
    await redis.pexpire(redisKey, windowMs);
  }

  return {
    allowed: count <= maxRequests,
    remaining: Math.max(0, maxRequests - count),
    resetMs: ttl > 0 ? ttl : windowMs,
    limit: maxRequests,
  };
}
