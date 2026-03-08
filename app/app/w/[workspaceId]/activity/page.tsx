import { activityFeed } from "@/components/mock-data";

export default function ActivityPage() {
  return (
    <section className="rounded-xl border border-line bg-panel p-4">
      <h2 className="mb-3 font-[var(--font-display)] text-xl">Activity Log</h2>
      <ul className="space-y-2">
        {activityFeed.map((item, index) => (
          <li key={item} className="rounded-lg border border-line bg-panelAlt p-3 text-sm">
            <p>{item}</p>
            <p className="mt-1 text-xs text-muted">Event #{index + 1} · audit basic</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

