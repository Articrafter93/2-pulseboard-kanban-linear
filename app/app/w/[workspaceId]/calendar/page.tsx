import { tasks } from "@/components/mock-data";

export default function CalendarPage() {
  const grouped = [...tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <section className="rounded-xl border border-line bg-panel p-4">
      <h2 className="mb-4 font-[var(--font-display)] text-xl">Calendar (MVP base)</h2>
      <div className="space-y-2">
        {grouped.map((task) => (
          <article key={task.id} className="rounded-lg border border-line bg-panelAlt p-3">
            <p className="text-xs text-muted">{task.dueDate}</p>
            <p className="font-semibold">{task.title}</p>
            <p className="text-sm text-muted">
              {task.project} · {task.assignee}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

