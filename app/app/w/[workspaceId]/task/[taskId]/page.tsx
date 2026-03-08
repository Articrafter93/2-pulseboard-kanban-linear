import { notFound } from "next/navigation";
import { tasks } from "@/components/mock-data";
import { PriorityBadge } from "@/components/priority-badge";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  const task = tasks.find((item) => item.id === taskId);
  if (!task) {
    notFound();
  }

  return (
    <section className="space-y-3">
      <div className="rounded-xl border border-line bg-panel p-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-[var(--font-display)] text-xl">{task.title}</h2>
          <PriorityBadge priority={task.priority} />
        </div>
        <p className="text-sm text-muted">{task.description}</p>
        <p className="mt-2 text-xs text-slate-300">
          {task.id} · {task.project} · {task.assignee} · due {task.dueDate}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-line bg-panelAlt p-4">
          <h3 className="mb-2 font-semibold">Subtasks</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
            <li>Define acceptance criteria</li>
            <li>Implement server handler</li>
            <li>Validate optimistic behavior</li>
          </ul>
        </div>
        <div className="rounded-xl border border-line bg-panelAlt p-4">
          <h3 className="mb-2 font-semibold">Comments</h3>
          <p className="text-sm text-muted">Ana: Keep this under 150ms perceived interaction latency.</p>
        </div>
      </div>
    </section>
  );
}

