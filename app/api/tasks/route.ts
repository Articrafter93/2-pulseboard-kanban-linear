import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { assertRateLimit } from "@/lib/rate-limit";
import { boardStatuses, boardStatusToDb } from "@/lib/task-status";
import { mapTaskToDto, priorityFromUi } from "@/lib/workspace-seed";
import { requireUserId } from "@/lib/auth-runtime";
import { WorkspaceAccessError, getWorkspaceContext } from "@/lib/workspace-access";

const TasksQuerySchema = z.object({
  workspaceId: z.string().min(1).default("default"),
  status: z.enum(boardStatuses).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(50),
});

const CreateTaskSchema = z.object({
  workspaceId: z.string().min(1).default("default"),
  title: z.string().min(3).max(140),
  description: z.string().min(3).max(1200),
  priority: z.enum(["urgent", "high", "normal", "low"]).default("normal"),
  status: z.enum(boardStatuses).default("backlog"),
  labels: z.array(z.string().min(1).max(24)).max(8).default([]),
  dueDate: z.string().date().optional(),
});

function getRequesterIdentity(request: Request, userId: string) {
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || "127.0.0.1";
  return userId ?? `ip:${ip}`;
}

export async function GET(request: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rate = await assertRateLimit(`tasks:get:${getRequesterIdentity(request, userId)}`);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const url = new URL(request.url);
  const parsed = TasksQuerySchema.safeParse({
    workspaceId: url.searchParams.get("workspaceId") ?? "default",
    status: url.searchParams.get("status") ?? undefined,
    page: url.searchParams.get("page") ?? "1",
    pageSize: url.searchParams.get("pageSize") ?? "50",
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query", details: parsed.error.flatten() }, { status: 400 });
  }

  const { workspaceId, status, page, pageSize } = parsed.data;
  try {
    const { organization } = await getWorkspaceContext(workspaceId, userId);

    const where = {
      organizationId: organization.id,
      ...(status ? { status: boardStatusToDb(status) } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: { assignee: { select: { displayName: true } } },
        orderBy: [{ updatedAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.task.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json(
      {
        items: items.map(mapTaskToDto),
        pagination: {
          page,
          pageSize,
          total,
          totalPages,
          hasNextPage: page < totalPages,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    if (error instanceof WorkspaceAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }
}

export async function POST(request: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rate = await assertRateLimit(`tasks:create:${getRequesterIdentity(request, userId)}`);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = CreateTaskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const { workspaceId, title, description, status, labels, priority, dueDate } = parsed.data;
  try {
    const { organization, project, member } = await getWorkspaceContext(workspaceId, userId);

    const task = await prisma.task.create({
      data: {
        organizationId: organization.id,
        projectId: project.id,
        assigneeId: member.id,
        title,
        description,
        status: boardStatusToDb(status),
        labels,
        priority: priorityFromUi(priority),
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: { assignee: { select: { displayName: true } } },
    });

    await prisma.activity.create({
      data: {
        organizationId: organization.id,
        taskId: task.id,
        actor: member.displayName,
        eventType: "task.created",
        payload: {
          taskId: task.id,
          status,
          priority,
        },
      },
    });

    return NextResponse.json({ item: mapTaskToDto(task) }, { status: 201 });
  } catch (error) {
    if (error instanceof WorkspaceAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }
}
