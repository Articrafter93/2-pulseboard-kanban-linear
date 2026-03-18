import { notFound } from "next/navigation";
import { PriorityBadge } from "@/components/priority-badge";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-runtime";
import { WorkspaceAccessError, getWorkspaceContext } from "@/lib/workspace-access";
import { mapTaskToDto } from "@/lib/workspace-seed";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ workspaceId: string; taskId: string }>;
}) {
  const { workspaceId, taskId } = await params;
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

  const task = await prisma.task.findFirst({
    where: { id: taskId, organizationId },
    include: { assignee: { select: { displayName: true } } },
  });

  if (!task) {
    notFound();
  }

  const item = mapTaskToDto(task);

  return (
    <section className="space-y-3">
      <div className="rounded-xl border border-line bg-panel p-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-[var(--font-display)] text-xl">{item.title}</h2>
          <PriorityBadge priority={item.priority} />
        </div>
        <p className="text-sm text-muted">{item.description}</p>
        <p className="mt-2 text-xs text-slate-300">
          {item.id} · {item.assignee} · due {item.dueDate}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-line bg-panelAlt p-4">
          <h3 className="mb-2 font-semibold">Labels</h3>
          {item.labels.length === 0 ? (
            <p className="text-sm text-muted">Esta tarea no tiene labels todavía.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {item.labels.map((label) => (
                <span key={label} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-xl border border-line bg-panelAlt p-4">
          <h3 className="mb-2 font-semibold">Comments</h3>
          <p className="text-sm text-muted">La siguiente iteración conectará comentarios persistentes por tarea.</p>
        </div>
      </div>
    </section>
  );
}
