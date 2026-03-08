import { tasks, members } from "@/components/mock-data";

export default function ReportsPage() {
  const completed = tasks.filter((task) => task.status === "done").length;
  const blocked = tasks.filter((task) => task.status === "backlog").length;
  const overdue = tasks.filter((task) => task.dueDate < "2026-03-11").length;

  return (
    <section className="space-y-3">
      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard label="Completed" value={String(completed)} />
        <MetricCard label="Blocked" value={String(blocked)} />
        <MetricCard label="Overdue" value={String(overdue)} />
      </div>
      <article className="rounded-xl border border-line bg-panel p-4">
        <h2 className="mb-3 font-[var(--font-display)] text-xl">Workload by member</h2>
        <div className="space-y-2">
          {members.map((member) => (
            <div key={member.id} className="rounded-lg border border-line bg-panelAlt p-3">
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>{member.name}</span>
                <span className="text-muted">{member.workload} active tasks</span>
              </div>
              <div className="h-2 rounded bg-slate-800">
                <div
                  className="h-2 rounded bg-accent"
                  style={{ width: `${Math.min(100, member.workload * 9)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
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

