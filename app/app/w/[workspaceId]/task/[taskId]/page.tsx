import { notFound } from "next/navigation";
import { PriorityBadge } from "@/components/priority-badge";
import { prisma } from "@/lib/prisma";
import { ensureWorkspaceSeed, mapTaskToDto } from "@/lib/workspace-seed";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ workspaceId: string; taskId: string }>;
}) {
  const { workspaceId, taskId } = await params;
  const { organization } = await ensureWorkspaceSeed(workspaceId);

  const task = await prisma.task.findFirst({
    where: { id: taskId, organizationId: organization.id },
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
          <h3 className="mb-2 font-semibold">Subtasks</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
            <li>Definir criterios de aceptación</li>
            <li>Implementar handler de persistencia</li>
            <li>Validar comportamiento optimista</li>
          </ul>
        </div>
        <div className="rounded-xl border border-line bg-panelAlt p-4">
          <h3 className="mb-2 font-semibold">Comments</h3>
          <p className="text-sm text-muted">Timeline integrada en próxima iteración de actividad detallada.</p>
        </div>
      </div>
    </section>
  );
}