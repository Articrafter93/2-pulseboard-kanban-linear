import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-runtime";
import { WorkspaceAccessError, getWorkspaceContext } from "@/lib/workspace-access";

export default async function ReportsPage({
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

  const [completed, blocked, overdue, members] = await Promise.all([
    prisma.task.count({ where: { organizationId, status: "DONE" } }),
    prisma.task.count({ where: { organizationId, status: "BACKLOG" } }),
    prisma.task.count({ where: { organizationId, dueDate: { lt: new Date() }, status: { not: "DONE" } } }),
    prisma.member.findMany({
      where: { organizationId },
      select: {
        id: true,
        displayName: true,
        _count: {
          select: {
            assignedTasks: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return (
    <section className="space-y-3">
      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard label="Completed" value={String(completed)} />
        <MetricCard label="Blocked" value={String(blocked)} />
        <MetricCard label="Overdue" value={String(overdue)} />
      </div>
      <article className="rounded-xl border border-line bg-panel p-4">
        <h2 className="mb-3 font-[var(--font-display)] text-xl">Workload by member</h2>
        {members.length === 0 ? (
          <p className="text-sm text-muted">No hay miembros todavía en este workspace.</p>
        ) : (
          <div className="space-y-2">
            {members.map((member) => (
              <div key={member.id} className="rounded-lg border border-line bg-panelAlt p-3">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>{member.displayName}</span>
                  <span className="text-muted">{member._count.assignedTasks} active tasks</span>
                </div>
                <div className="h-2 rounded bg-slate-800">
                  <div
                    className="h-2 rounded bg-accent"
                    style={{ width: `${Math.min(100, member._count.assignedTasks * 8)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-line bg-panel p-4">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
    </article>
  );
}
