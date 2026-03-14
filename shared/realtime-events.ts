export type RealtimeUser = {
  id: string;
  name: string;
  avatar?: string;
};

export type TaskMovedPayload = {
  workspaceId: string;
  taskId: string;
  status: "backlog" | "to_do" | "in_progress" | "done";
  actorId: string;
};

export type TaskCreatedPayload = {
  workspaceId: string;
  taskId: string;
};

export type PresenceJoinedPayload = {
  workspaceId: string;
  socketId: string;
  user: RealtimeUser;
};

export type PresenceLeftPayload = {
  workspaceId: string;
  socketId: string;
  userId: string;
};

export type PresenceCursorPayload = {
  workspaceId: string;
  userId: string;
  x: number;
  y: number;
  column: "backlog" | "to_do" | "in_progress" | "done" | null;
};

export type PresenceSnapshotPayload = {
  workspaceId: string;
  users: RealtimeUser[];
};

export type RealtimeEvents = {
  "workspace:join": (payload: { workspaceId: string; user: RealtimeUser }) => void;
  "task:moved": (payload: TaskMovedPayload) => void;
  "task:created": (payload: TaskCreatedPayload) => void;
  "presence:cursor": (payload: PresenceCursorPayload) => void;
  "presence:joined": (payload: PresenceJoinedPayload) => void;
  "presence:left": (payload: PresenceLeftPayload) => void;
  "presence:snapshot": (payload: PresenceSnapshotPayload) => void;
};