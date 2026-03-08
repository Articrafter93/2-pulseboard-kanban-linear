import { NextResponse } from "next/server";
import { members, tasks } from "@/components/mock-data";
import { z } from "zod";

const DashboardQuerySchema = z.object({
  includeWorkload: z.enum(["true", "false"]).default("true"),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = DashboardQuerySchema.safeParse({
    includeWorkload: url.searchParams.get("includeWorkload") ?? "true",
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid dashboard query" }, { status: 400 });
  }

  const includeWorkload = parsed.data.includeWorkload === "true";
  const payload = {
    completed: tasks.filter((task) => task.status === "done").length,
    blocked: tasks.filter((task) => task.status === "backlog").length,
    inProgress: tasks.filter((task) => task.status === "in_progress").length,
    workload: includeWorkload
      ? members.map((member) => ({ name: member.name, activeTasks: member.workload }))
      : [],
  };
  return NextResponse.json(payload);
}
