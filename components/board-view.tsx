"use client";

import { useMemo, useState } from "react";
import { PriorityBadge } from "@/components/priority-badge";
import { TaskItem, TaskStatus } from "@/components/mock-data";
import Link from "next/link";

const columns: { id: TaskStatus; label: string }[] = [
  { id: "backlog", label: "Backlog" },
  { id: "to_do", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "done", label: "Done" },
];

export function BoardView({
  workspaceId,
  initialTasks,
}: {
  workspaceId: string;
  initialTasks: TaskItem[];
}) {
  const [items, setItems] = useState(initialTasks);
  const [pendingTask, setPendingTask] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  const grouped = useMemo(() => {
    return columns.map((col) => ({
      ...col,
      tasks: items.filter((task) => task.status === col.id),
    }));
  }, [items]);

  function moveTask(taskId: string, status: TaskStatus) {
    setPendingTask(taskId);
    setItems((prev) => prev.map((item) => (item.id === taskId ? { ...item, status } : item)));
    setTimeout(() => setPendingTask(null), 250);
  }

  return (
    <section>
      <div className="mb-3 flex flex-wrap gap-2 text-xs text-muted">
        <span className="rounded-full border border-line px-2 py-1">Realtime service: Socket.IO</span>
        <span className="rounded-full border border-line px-2 py-1">Pub/Sub: Redis</span>
        <span className="rounded-full border border-line px-2 py-1">Mode: mock-first</span>
      </div>
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-4">
        {grouped.map((column) => (
          <div
            key={column.id}
            className="rounded-xl border border-line bg-panel p-3"
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (dragging) moveTask(dragging, column.id);
              setDragging(null);
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">{column.label}</h2>
              <span className="text-xs text-muted">{column.tasks.length}</span>
            </div>
            <div className="space-y-2">
              {column.tasks.map((task) => (
                <article
                  key={task.id}
                  draggable
                  onDragStart={() => setDragging(task.id)}
                  className="rounded-lg border border-line bg-panelAlt p-3 shadow-soft"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <PriorityBadge priority={task.priority} />
                    <span className="text-xs text-muted">{task.id}</span>
                  </div>
                  <Link
                    href={`/app/w/${workspaceId}/task/${task.id}`}
                    className="mb-1 block font-semibold hover:text-accent"
                  >
                    {task.title}
                  </Link>
                  <p className="mb-2 text-xs text-muted">{task.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {task.labels.map((label) => (
                      <span key={label} className="rounded-full border border-line px-2 py-0.5 text-[10px] text-muted">
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-300">
                    {task.assignee} · due {task.dueDate}
                    {pendingTask === task.id && (
                      <span className="ml-2 rounded border border-amber-800 bg-amber-950 px-1 py-0.5 text-amber-300">
                        syncing...
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
