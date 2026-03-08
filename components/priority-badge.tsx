import { TaskPriority } from "@/components/mock-data";

const colorByPriority: Record<TaskPriority, string> = {
  urgent: "bg-rose-950 text-rose-300 border-rose-700",
  high: "bg-amber-950 text-amber-300 border-amber-700",
  normal: "bg-emerald-950 text-emerald-300 border-emerald-700",
  low: "bg-slate-900 text-slate-300 border-slate-700",
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${colorByPriority[priority]}`}
    >
      {priority}
    </span>
  );
}

