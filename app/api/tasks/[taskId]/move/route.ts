import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { assertRateLimit } from "@/lib/rate-limit";
import { boardStatuses, boardStatusToDb } from "@/lib/task-status";
import { ensureWorkspaceSeed, mapTaskToDto } from "@/lib/workspace-seed";
import { requireUserId } from "@/lib/auth-runtime";

const MoveTaskSchema = z.object({
  workspaceId: z.string().min(1).default("default"),
  status: z.enum(boardStatuses),
});

function getRequesterIdentity(request: Request, userId: string | null) {
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || "127.0.0.1";
  return userId ?? `ip:${ip}`;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ taskId: string }> }) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rate = await assertRateLimit(`tasks:move:${getRequesterIdentity(request, userId)}`);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = MoveTaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const { taskId } = await params;
  const { workspaceId, status } = parsed.data;

  const { organization } = await ensureWorkspaceSeed(workspaceId);

  const updated = await prisma.task.updateMany({
    where: {
      id: taskId,
      organizationId: organization.id,
    },
    data: {
      status: boardStatusToDb(status),
    },
  });

  if (updated.count === 0) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      labels: true,
      dueDate: true,
      assignee: { select: { displayName: true } },
    },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ item: mapTaskToDto(task) });
}
