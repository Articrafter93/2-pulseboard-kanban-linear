"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useVirtualizer } from "@tanstack/react-virtual";
import { io, Socket } from "socket.io-client";
import Link from "next/link";
import Image from "next/image";
import { PriorityBadge } from "@/components/priority-badge";
import { clientEnv } from "@/lib/client-env";
import { boardStatuses, BoardStatus } from "@/lib/task-status";
import type {
  PresenceCursorPayload,
  PresenceJoinedPayload,
  PresenceLeftPayload,
  PresenceSnapshotPayload,
  RealtimeUser,
  TaskCreatedPayload,
  TaskMovedPayload,
} from "@/shared/realtime-events";
import type { TaskDto } from "@/lib/task-dto";

const columns: { id: BoardStatus; label: string }[] = [
  { id: "backlog", label: "Backlog" },
  { id: "to_do", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "done", label: "Done" },
];

type PaginationState = Record<BoardStatus, { page: number; hasNextPage: boolean; loading: boolean }>;

type TaskState = Record<BoardStatus, TaskDto[]>;

function createEmptyTaskState(): TaskState {
  return {
    backlog: [],
    to_do: [],
    in_progress: [],
    done: [],
  };
}

function createInitialPagination(): PaginationState {
  return {
    backlog: { page: 0, hasNextPage: true, loading: false },
    to_do: { page: 0, hasNextPage: true, loading: false },
    in_progress: { page: 0, hasNextPage: true, loading: false },
    done: { page: 0, hasNextPage: true, loading: false },
  };
}

export function BoardView({ workspaceId, currentUser }: { workspaceId: string; currentUser: RealtimeUser }) {
  const [itemsByStatus, setItemsByStatus] = useState<TaskState>(createEmptyTaskState);
  const [pagination, setPagination] = useState<PaginationState>(createInitialPagination);
  const [connectionState, setConnectionState] = useState<"connecting" | "connected" | "reconnecting" | "offline" | "demo">("connecting");
  const [pendingTask, setPendingTask] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState<BoardStatus>("backlog");
  const [isCreating, setIsCreating] = useState(false);
  const [presenceUsers, setPresenceUsers] = useState<Record<string, RealtimeUser>>({});
  const [presenceCursors, setPresenceCursors] = useState<Record<string, PresenceCursorPayload>>({});
  const socketRef = useRef<Socket | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const cursorThrottleRef = useRef<number>(0);

  const allItems = useMemo(() => {
    const map: Record<string, TaskDto> = {};
    for (const status of boardStatuses) {
      for (const task of itemsByStatus[status]) {
        map[task.id] = task;
      }
    }
    return map;
  }, [itemsByStatus]);

  const loadStatusPage = useCallback(
    async (status: BoardStatus, nextPage: number) => {
      setPagination((prev) => ({
        ...prev,
        [status]: { ...prev[status], loading: true },
      }));

      const response = await fetch(
        `/api/tasks?workspaceId=${workspaceId}&status=${status}&page=${nextPage}&pageSize=50`,
        { cache: "no-store" },
      );

      if (!response.ok) {
        setPagination((prev) => ({
          ...prev,
          [status]: { ...prev[status], loading: false },
        }));
        return;
      }

      const payload = (await response.json()) as { items: TaskDto[]; pagination: { hasNextPage: boolean } };

      setItemsByStatus((prev) => ({
        ...prev,
        [status]: [...prev[status], ...payload.items],
      }));

      setPagination((prev) => ({
        ...prev,
        [status]: {
          page: nextPage,
          hasNextPage: payload.pagination.hasNextPage,
          loading: false,
        },
      }));
    },
    [workspaceId],
  );

  useEffect(() => {
    setItemsByStatus(createEmptyTaskState());
    setPagination(createInitialPagination());
    void Promise.all(boardStatuses.map((status) => loadStatusPage(status, 1)));
  }, [loadStatusPage]);

  useEffect(() => {
    if (clientEnv.NEXT_PUBLIC_AUTH_PROVIDER === "mock") {
      setConnectionState("demo");
      return;
    }

    const socket = io(clientEnv.NEXT_PUBLIC_REALTIME_SERVICE_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 400,
      reconnectionDelayMax: 5000,
      timeout: 8000,
    });

    socketRef.current = socket;

    const onConnect = () => {
      setConnectionState("connected");
      socket.emit("workspace:join", { workspaceId, user: currentUser });
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", () => setConnectionState("offline"));
    socket.io.on("reconnect_attempt", () => setConnectionState("reconnecting"));
    socket.io.on("reconnect_failed", () => setConnectionState("offline"));

    socket.on("presence:snapshot", (payload: PresenceSnapshotPayload) => {
      if (payload.workspaceId !== workspaceId) return;
      const users = payload.users.reduce<Record<string, RealtimeUser>>((acc, member) => {
        acc[member.id] = member;
        return acc;
      }, {});
      setPresenceUsers(users);
    });

    socket.on("presence:joined", (payload: PresenceJoinedPayload) => {
      if (payload.workspaceId !== workspaceId) return;
      setPresenceUsers((prev) => ({ ...prev, [payload.user.id]: payload.user }));
    });

    socket.on("presence:left", (payload: PresenceLeftPayload) => {
      if (payload.workspaceId !== workspaceId) return;
      setPresenceUsers((prev) => {
        const next = { ...prev };
        delete next[payload.userId];
        return next;
      });
      setPresenceCursors((prev) => {
        const next = { ...prev };
        delete next[payload.userId];
        return next;
      });
    });

    socket.on("presence:cursor", (payload: PresenceCursorPayload) => {
      if (payload.workspaceId !== workspaceId || payload.userId === currentUser.id) return;
      setPresenceCursors((prev) => ({ ...prev, [payload.userId]: payload }));
    });

    socket.on("task:moved", (payload: TaskMovedPayload) => {
      if (payload.workspaceId !== workspaceId || payload.actorId === currentUser.id) return;
      setItemsByStatus((prev) => {
        const task = prev.backlog.find((item) => item.id === payload.taskId)
          ?? prev.to_do.find((item) => item.id === payload.taskId)
          ?? prev.in_progress.find((item) => item.id === payload.taskId)
          ?? prev.done.find((item) => item.id === payload.taskId);
        if (!task) return prev;

        const next: TaskState = {
          backlog: prev.backlog.filter((item) => item.id !== payload.taskId),
          to_do: prev.to_do.filter((item) => item.id !== payload.taskId),
          in_progress: prev.in_progress.filter((item) => item.id !== payload.taskId),
          done: prev.done.filter((item) => item.id !== payload.taskId),
        };
        next[payload.status] = [{ ...task, status: payload.status }, ...next[payload.status]];
        return next;
      });
    });

    socket.on("task:created", (payload: TaskCreatedPayload) => {
      if (payload.workspaceId !== workspaceId) return;
      setItemsByStatus((prev) => ({ ...prev, backlog: [] }));
      setPagination((prev) => ({
        ...prev,
        backlog: { page: 0, hasNextPage: true, loading: false },
      }));
      void loadStatusPage("backlog", 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser, loadStatusPage, workspaceId]);

  async function createTask() {
    if (!newTaskTitle.trim()) {
      return;
    }

    setIsCreating(true);
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspaceId,
        title: newTaskTitle.trim(),
        description: "Created from board quick action.",
        status: newTaskStatus,
        priority: "normal",
        labels: ["new"],
      }),
    });

    setIsCreating(false);

    if (!response.ok) {
      return;
    }

    const payload = (await response.json()) as { item: TaskDto };
    setNewTaskTitle("");
    setItemsByStatus((prev) => ({
      ...prev,
      [payload.item.status]: [payload.item, ...prev[payload.item.status]],
    }));

    socketRef.current?.emit("task:created", {
      workspaceId,
      taskId: payload.item.id,
    } satisfies TaskCreatedPayload);
  }

  async function moveTask(taskId: string, status: BoardStatus) {
    const task = allItems[taskId];
    if (!task || task.status === status) {
      return;
    }

    setPendingTask(taskId);
    setItemsByStatus((prev) => {
      const next: TaskState = {
        backlog: prev.backlog.filter((item) => item.id !== taskId),
        to_do: prev.to_do.filter((item) => item.id !== taskId),
        in_progress: prev.in_progress.filter((item) => item.id !== taskId),
        done: prev.done.filter((item) => item.id !== taskId),
      };
      next[status] = [{ ...task, status }, ...next[status]];
      return next;
    });

    const response = await fetch(`/api/tasks/${taskId}/move`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workspaceId, status }),
    });

    if (!response.ok) {
      setItemsByStatus((prev) => {
        const moved = prev.backlog.find((item) => item.id === taskId)
          ?? prev.to_do.find((item) => item.id === taskId)
          ?? prev.in_progress.find((item) => item.id === taskId)
          ?? prev.done.find((item) => item.id === taskId);

        const next: TaskState = {
          backlog: prev.backlog.filter((item) => item.id !== taskId),
          to_do: prev.to_do.filter((item) => item.id !== taskId),
          in_progress: prev.in_progress.filter((item) => item.id !== taskId),
          done: prev.done.filter((item) => item.id !== taskId),
        };

        if (moved) {
          next[task.status] = [{ ...moved, status: task.status }, ...next[task.status]];
        }

        return next;
      });
      setPendingTask(null);
      return;
    }

    socketRef.current?.emit("task:moved", {
      workspaceId,
      taskId,
      status,
      actorId: currentUser.id,
    } satisfies TaskMovedPayload);

    setPendingTask(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const taskId = String(event.active.id);
    if (!event.over) {
      return;
    }

    const overId = String(event.over.id);

    let targetStatus: BoardStatus | null = null;
    if (overId.startsWith("column-")) {
      const status = overId.replace("column-", "") as BoardStatus;
      if (boardStatuses.includes(status)) {
        targetStatus = status;
      }
    } else {
      for (const status of boardStatuses) {
        if (itemsByStatus[status].some((task) => task.id === overId)) {
          targetStatus = status;
          break;
        }
      }
    }

    if (targetStatus) {
      void moveTask(taskId, targetStatus);
    }
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const now = Date.now();
    if (now - cursorThrottleRef.current < 50) {
      return;
    }
    cursorThrottleRef.current = now;

    const boardNode = boardRef.current;
    if (!boardNode || !socketRef.current) {
      return;
    }

    const rect = boardNode.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    socketRef.current.emit("presence:cursor", {
      workspaceId,
      userId: currentUser.id,
      x: Number(Math.max(0, Math.min(1, x)).toFixed(3)),
      y: Number(Math.max(0, Math.min(1, y)).toFixed(3)),
      column: null,
    } satisfies PresenceCursorPayload);
  }

  const onlineUsers = Object.values(presenceUsers);

  return (
    <section>
      <header className="mb-3 rounded-xl border border-line bg-panel p-3">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="rounded-full border border-line px-2 py-1">Realtime: Socket.IO + Redis</span>
            <span data-testid="connection-state" className="rounded-full border border-line px-2 py-1">
              Estado: {connectionLabel(connectionState)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span>Colaboradores activos:</span>
            {onlineUsers.length === 0 && <span className="rounded-full border border-line px-2 py-1">Solo tú</span>}
            {onlineUsers.map((member) => (
              <span key={member.id} data-testid="presence-user" className="inline-flex items-center gap-2 rounded-full border border-line px-2 py-1">
                {member.avatar ? (
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={16}
                    height={16}
                    unoptimized
                    className="h-4 w-4 rounded-full"
                  />
                ) : (
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-[#101014]">
                    {member.name.slice(0, 1).toUpperCase()}
                  </span>
                )}
                {member.name}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            value={newTaskTitle}
            onChange={(event) => setNewTaskTitle(event.target.value)}
            placeholder="Nueva tarea para el tablero"
            data-testid="create-task-input"
            className="min-w-[240px] flex-1 rounded-lg border border-line bg-panelAlt px-3 py-2 text-sm outline-none ring-accent focus:ring-2"
          />
          <select
            value={newTaskStatus}
            onChange={(event) => setNewTaskStatus(event.target.value as BoardStatus)}
            data-testid="create-task-status"
            className="rounded-lg border border-line bg-panelAlt px-3 py-2 text-sm"
          >
            {columns.map((column) => (
              <option key={column.id} value={column.id}>
                {column.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => void createTask()}
            disabled={isCreating}
            data-testid="create-task-button"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-[#111318] disabled:opacity-60"
          >
            {isCreating ? "Creando..." : "Crear tarjeta"}
          </button>
        </div>
      </header>

      <DndContext onDragEnd={handleDragEnd}>
        <div
          ref={boardRef}
          onPointerMove={handlePointerMove}
          className="relative grid grid-cols-1 gap-3 xl:grid-cols-4"
        >
          {columns.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              workspaceId={workspaceId}
              pendingTask={pendingTask}
              tasks={itemsByStatus[column.id]}
              pagination={pagination[column.id]}
              onLoadMore={() => void loadStatusPage(column.id, pagination[column.id].page + 1)}
            />
          ))}

          {Object.entries(presenceCursors).map(([userId, cursor]) => {
            const userForCursor = presenceUsers[userId];
            if (!userForCursor || cursor.workspaceId !== workspaceId) {
              return null;
            }

            return (
              <div
                key={userId}
                data-testid="presence-cursor"
                className="pointer-events-none absolute z-20"
                style={{ left: `${cursor.x * 100}%`, top: `${cursor.y * 100}%` }}
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_0_4px_rgba(94,106,210,0.25)]" />
                  <span className="rounded bg-panel px-2 py-1 text-[10px] text-slate-200 shadow-soft">{userForCursor.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </DndContext>
    </section>
  );
}

function connectionLabel(state: "connecting" | "connected" | "reconnecting" | "offline" | "demo") {
  switch (state) {
    case "connected":
      return "Conectado";
    case "reconnecting":
      return "Reconectando...";
    case "offline":
      return "Sin conexión";
    case "demo":
      return "Demo (sin realtime)";
    case "connecting":
      return "Conectando...";
    default:
      return "Conectando...";
  }
}

function BoardColumn({
  column,
  workspaceId,
  tasks,
  pendingTask,
  pagination,
  onLoadMore,
}: {
  column: { id: BoardStatus; label: string };
  workspaceId: string;
  tasks: TaskDto[];
  pendingTask: string | null;
  pagination: { page: number; hasNextPage: boolean; loading: boolean };
  onLoadMore: () => void;
}) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const { setNodeRef } = useDroppable({
    id: `column-${column.id}`,
  });

  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 190,
    overscan: 6,
  });

  return (
    <section ref={setNodeRef} data-testid={`column-${column.id}`} className="rounded-xl border border-line bg-panel p-3">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold">{column.label}</h2>
        <span className="text-xs text-muted">{tasks.length}</span>
      </div>
      <div ref={parentRef} className="relative h-[62vh] overflow-auto rounded-lg border border-line/60 bg-panelAlt/50 p-2">
        <div style={{ height: `${virtualizer.getTotalSize()}px`, position: "relative" }}>
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const task = tasks[virtualRow.index];
            if (!task) return null;

            return (
              <div
                key={task.id}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <TaskCard workspaceId={workspaceId} task={task} pending={pendingTask === task.id} />
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-2">
        {pagination.hasNextPage ? (
          <button
            type="button"
            onClick={onLoadMore}
            disabled={pagination.loading}
            className="w-full rounded-lg border border-line bg-panelAlt px-3 py-2 text-xs text-muted hover:text-slate-100 disabled:opacity-60"
          >
            {pagination.loading ? "Cargando..." : "Cargar más"}
          </button>
        ) : (
          <p className="text-center text-xs text-muted">Fin de la columna</p>
        )}
      </div>
    </section>
  );
}

function TaskCard({ workspaceId, task, pending }: { workspaceId: string; task: TaskDto; pending: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <article
      ref={setNodeRef}
      data-testid={`task-card-${task.id}`}
      data-task-title={task.title}
      style={style}
      {...listeners}
      {...attributes}
      className="mb-2 cursor-grab rounded-lg border border-line bg-panel p-3 shadow-soft active:cursor-grabbing"
    >
      <div className="mb-2 flex items-center justify-between">
        <PriorityBadge priority={task.priority} />
        <span className="text-xs text-muted">{task.id.slice(0, 8)}</span>
      </div>
      <Link href={`/app/w/${workspaceId}/task/${task.id}`} className="mb-1 block font-semibold hover:text-accent">
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
        {pending && (
          <span className="ml-2 rounded border border-accent/70 bg-accent/20 px-1 py-0.5 text-accent">syncing...</span>
        )}
      </div>
    </article>
  );
}
