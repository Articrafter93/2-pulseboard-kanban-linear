import { PriorityBadge } from "@/components/priority-badge";
import { tasks } from "@/components/mock-data";

export default function ListPage() {
  return (
    <section className="rounded-xl border border-line bg-panel p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-[var(--font-display)] text-xl">Task List</h2>
        <div className="flex gap-2 text-xs">
          <span className="rounded-full border border-line px-2 py-1 text-muted">Filter: All statuses</span>
          <span className="rounded-full border border-line px-2 py-1 text-muted">Sort: Priority</span>
        </div>
      </div>
      <div className="overflow-x-auto">
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
            {tasks.map((task) => (
              <tr key={task.id} className="border-b border-line/70">
                <td className="py-3">
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-muted">{task.project}</p>
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
      </div>
    </section>
  );
}

