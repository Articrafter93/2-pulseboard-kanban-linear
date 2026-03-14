import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const nodeEnvSchema = z.enum(["development", "test", "production"]).default("development");
const authProviderSchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : value),
  z.enum(["mock", "clerk"]),
);
const mockDbEnabledSchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : value),
  z.enum(["true", "false"]),
);

const serverSchema = z.object({
  NODE_ENV: nodeEnvSchema,
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("Pulseboard"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_REALTIME_SERVICE_URL: z.string().url(),
  REALTIME_SERVICE_URL: z.string().url(),
  REALTIME_PORT: z.coerce.number().int().positive().default(4001),
  REDIS_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),
  MOCK_DB_ENABLED: mockDbEnabledSchema.default("false"),
  NEXT_PUBLIC_AUTH_PROVIDER: authProviderSchema.default("mock"),
  CLERK_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1).default("/signin"),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().min(1).default("/signup"),
  RATE_LIMIT_API_WINDOW_MS: z.coerce.number().int().positive().default(60000),
  RATE_LIMIT_API_MAX: z.coerce.number().int().positive().default(120),
  RATE_LIMIT_SOCKET_WINDOW_MS: z.coerce.number().int().positive().default(60000),
  RATE_LIMIT_SOCKET_MAX: z.coerce.number().int().positive().default(90),
}).superRefine((value, ctx) => {
  if (value.NEXT_PUBLIC_AUTH_PROVIDER === "clerk") {
    if (!value.CLERK_SECRET_KEY) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Required when NEXT_PUBLIC_AUTH_PROVIDER=clerk",
        path: ["CLERK_SECRET_KEY"],
      });
    }
    if (!value.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Required when NEXT_PUBLIC_AUTH_PROVIDER=clerk",
        path: ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"],
      });
    }
  }
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("Pulseboard"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_REALTIME_SERVICE_URL: z.string().url(),
  NEXT_PUBLIC_AUTH_PROVIDER: authProviderSchema.default("mock"),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1).default("/signin"),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().min(1).default("/signup"),
}).superRefine((value, ctx) => {
  if (value.NEXT_PUBLIC_AUTH_PROVIDER === "clerk" && !value.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Required when NEXT_PUBLIC_AUTH_PROVIDER=clerk",
      path: ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"],
    });
  }
});

const shouldSkipValidation = process.env.SKIP_ENV_VALIDATION === "true";

function formatIssues(issues: z.ZodIssue[]) {
  return issues.map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`).join("\n");
}

function parseServerEnv() {
  if (shouldSkipValidation) {
    return process.env as unknown as z.infer<typeof serverSchema>;
  }

  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid server environment variables:\n${formatIssues(parsed.error.issues)}`);
  }
  return parsed.data;
}

function parseClientEnv() {
  if (shouldSkipValidation) {
    return process.env as unknown as z.infer<typeof clientSchema>;
  }

  const parsed = clientSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid client environment variables:\n${formatIssues(parsed.error.issues)}`);
  }
  return parsed.data;
}

export const env = parseServerEnv();
export const clientEnv = parseClientEnv();
