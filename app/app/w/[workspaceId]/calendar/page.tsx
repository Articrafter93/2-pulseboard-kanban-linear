import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-runtime";
import { WorkspaceAccessError, getWorkspaceContext } from "@/lib/workspace-access";
import { mapTaskToDto } from "@/lib/workspace-seed";

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const userId = await requireUserId();
  if (!userId) {
    notFound();
  }

  let organizationId = "";
  try {
    const { organization } = await getWorkspaceContext(workspaceId, userId);
    organizationId = organization.id;
  } catch (error) {
    if (error instanceof WorkspaceAccessError) {
      notFound();
    }
    throw error;
  }

  const tasks = await prisma.task.findMany({
    where: {
      organizationId,
      dueDate: { not: null },
    },
    include: { assignee: { select: { displayName: true } } },
    orderBy: [{ dueDate: "asc" }, { updatedAt: "desc" }],
    take: 120,
  });

  const grouped = tasks.map(mapTaskToDto);

  return (
    <section className="rounded-xl border border-line bg-panel p-4">
      <h2 className="mb-4 font-[var(--font-display)] text-xl">Calendar</h2>
      {grouped.length === 0 ? (
        <p className="text-sm text-muted">No hay tareas con fecha límite todavía.</p>
      ) : (
        <div className="space-y-2">
          {grouped.map((task) => (
            <article key={task.id} className="rounded-lg border border-line bg-panelAlt p-3">
              <p className="text-xs text-muted">{task.dueDate}</p>
              <p className="font-semibold">{task.title}</p>
              <p className="text-sm text-muted">{task.assignee}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
