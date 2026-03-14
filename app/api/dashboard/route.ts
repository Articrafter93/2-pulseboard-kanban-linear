import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ensureWorkspaceSeed } from "@/lib/workspace-seed";
import { assertRateLimit } from "@/lib/rate-limit";
import { getOptionalUserId } from "@/lib/auth-runtime";

const DashboardQuerySchema = z.object({
  workspaceId: z.string().min(1).default("default"),
  includeWorkload: z.enum(["true", "false"]).default("true"),
});

export async function GET(request: Request) {
  const userId = await getOptionalUserId();
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || "127.0.0.1";
  const key = userId ?? `ip:${ip}`;

  const rate = await assertRateLimit(`dashboard:get:${key}`);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const url = new URL(request.url);
  const parsed = DashboardQuerySchema.safeParse({
    workspaceId: url.searchParams.get("workspaceId") ?? "default",
    includeWorkload: url.searchParams.get("includeWorkload") ?? "true",
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid dashboard query" }, { status: 400 });
  }

  const { workspaceId, includeWorkload } = parsed.data;
  const { organization } = await ensureWorkspaceSeed(workspaceId);

  const [completed, blocked, inProgress] = await Promise.all([
    prisma.task.count({ where: { organizationId: organization.id, status: "DONE" } }),
    prisma.task.count({ where: { organizationId: organization.id, status: "BACKLOG" } }),
    prisma.task.count({ where: { organizationId: organization.id, status: "IN_PROGRESS" } }),
  ]);

  const workload = includeWorkload === "true"
    ? await prisma.member.findMany({
        where: { organizationId: organization.id },
        select: {
          displayName: true,
          _count: {
            select: {
              assignedTasks: true,
            },
          },
        },
      })
    : [];

  return NextResponse.json({
    completed,
    blocked,
    inProgress,
    workload: workload.map((member) => ({
      name: member.displayName,
      activeTasks: member._count.assignedTasks,
    })),
  });
}
