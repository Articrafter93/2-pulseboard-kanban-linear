import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: process.env.REALTIME_ENV_PATH ?? path.resolve(process.cwd(), "../.env.local") });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  REALTIME_PORT: z.coerce.number().int().positive().default(4001),
  PORT: z.coerce.number().int().positive().optional(),
  REDIS_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  RATE_LIMIT_SOCKET_WINDOW_MS: z.coerce.number().int().positive().default(60000),
  RATE_LIMIT_SOCKET_MAX: z.coerce.number().int().positive().default(90),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  const details = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("\n");
  throw new Error(`Invalid realtime environment variables:\n${details}`);
}

export const env = parsed.data;
