import { NextResponse } from "next/server";
import { tasks } from "@/components/mock-data";
import { z } from "zod";

const TasksQuerySchema = z.object({
  status: z.enum(["backlog", "to_do", "in_progress", "done"]).optional(),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = TasksQuerySchema.safeParse({
    status: url.searchParams.get("status") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status filter" }, { status: 400 });
  }

  const items = parsed.data.status ? tasks.filter((task) => task.status === parsed.data.status) : tasks;
  return NextResponse.json({ items });
}
