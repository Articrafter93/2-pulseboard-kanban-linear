import { notFound } from "next/navigation";
import { PriorityBadge } from "@/components/priority-badge";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-runtime";
import { isDemoWorkspaceId, listDemoTasks } from "@/lib/demo-workspace";
import { WorkspaceAccessError, getWorkspaceContext } from "@/lib/workspace-access";
import { mapTaskToDto } from "@/lib/workspace-seed";

export default async function ListPage({
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
  let isDemoWorkspace = false;
  try {
    const { organization } = await getWorkspaceContext(workspaceId, userId);
    organizationId = organization.id;
    isDemoWorkspace = isDemoWorkspaceId(organization.id);
  } catch (error) {
    if (error instanceof WorkspaceAccessError) {
      notFound();
    }
    throw error;
  }

  const items = isDemoWorkspace
    ? listDemoTasks(workspaceId, undefined, 1, 150).items
    : (await prisma.task.findMany({
        where: { organizationId },
        include: { assignee: { select: { displayName: true } } },
        orderBy: [{ updatedAt: "desc" }],
        take: 150,
      })).map(mapTaskToDto);

  return (
    <section className="rounded-xl border border-line bg-panel p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-[var(--font-display)] text-xl">Task List</h2>
        <div className="flex gap-2 text-xs">
          <span className="rounded-full border border-line px-2 py-1 text-muted">
            Persistencia: {isDemoWorkspace ? "Demo fallback" : "Prisma"}
          </span>
          <span className="rounded-full border border-line px-2 py-1 text-muted">Top 150</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-panelAlt p-6 text-sm text-muted">
            Todavía no hay tareas en este workspace. Crea la primera desde el tablero.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-muted">
              <tr className="border-b border-line">
                <th className="py-2">Task</th>
                <th className="py-2">Priority</th>
                <th className="py-2">Status</th>
                <th className="py-2">Assignee</th>
                <th className="py-2">Due</th>
              </tr>
            </thead>
            <tbody>
              {items.map((task) => (
                <tr key={task.id} className="border-b border-line/70">
                  <td className="py-3">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-muted">{task.id.slice(0, 8)}</p>
                  </td>
                  <td className="py-3">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="py-3 capitalize">{task.status.replace("_", " ")}</td>
                  <td className="py-3">{task.assignee}</td>
                  <td className="py-3">{task.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
