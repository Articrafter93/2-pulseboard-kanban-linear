import { auth } from "@clerk/nextjs/server";
import { env } from "@/lib/env";
import type { RealtimeUser } from "@/shared/realtime-events";

export const isClerkAuthEnabled = env.NEXT_PUBLIC_AUTH_PROVIDER === "clerk";

export async function getOptionalUserId(): Promise<string | null> {
  if (!isClerkAuthEnabled) {
    return null;
  }

  const { userId } = await auth();
  return userId;
}

export async function requireUserId(): Promise<string | null> {
  const userId = await getOptionalUserId();
  return userId;
}

export async function getRealtimeUser(): Promise<RealtimeUser> {
  if (!isClerkAuthEnabled) {
    return {
      id: "anonymous",
      name: "Guest",
    };
  }

  const { userId } = await auth();
  if (!userId) {
    return {
      id: "anonymous",
      name: "Guest",
    };
  }

  return {
    id: userId,
    name: `User ${userId.slice(0, 8)}`,
  };
}
