import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";

const HealthQuerySchema = z.object({
  workspaceId: z.string().min(1).optional(),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = HealthQuerySchema.safeParse({
    workspaceId: url.searchParams.get("workspaceId") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  return NextResponse.json({
    status: "ok",
    service: "pulseboard-web",
    authProvider: env.NEXT_PUBLIC_AUTH_PROVIDER,
    envValidated: true,
    workspaceId: parsed.data.workspaceId ?? null,
  });
}
