import { createServer } from "node:http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import { z } from "zod";
import type {
  PresenceCursorPayload,
  PresenceJoinedPayload,
  PresenceLeftPayload,
  PresenceSnapshotPayload,
  RealtimeUser,
  TaskCreatedPayload,
  TaskMovedPayload,
} from "../../shared/realtime-events";
import { env } from "./env";

const joinSchema = z.object({
  workspaceId: z.string().min(1),
  user: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    avatar: z.string().url().optional(),
  }),
});

const moveSchema = z.object({
  workspaceId: z.string().min(1),
  taskId: z.string().min(1),
  status: z.enum(["backlog", "to_do", "in_progress", "done"]),
  actorId: z.string().min(1),
});

const createdSchema = z.object({
  workspaceId: z.string().min(1),
  taskId: z.string().min(1),
});

const cursorSchema = z.object({
  workspaceId: z.string().min(1),
  userId: z.string().min(1),
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  column: z.enum(["backlog", "to_do", "in_progress", "done"]).nullable(),
});

const httpServer = createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ status: "ok", service: "realtime", port: env.REALTIME_PORT }));
    return;
  }

  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

const io = new Server(httpServer, {
  cors: {
    origin: env.NEXT_PUBLIC_APP_URL,
    methods: ["GET", "POST"],
  },
});

const pubClient = new Redis(env.REDIS_URL);
const subClient = pubClient.duplicate();
io.adapter(createAdapter(pubClient, subClient));

const limiterRedis = pubClient.duplicate();
const workspaceUsers = new Map<string, Map<string, RealtimeUser>>();
const socketToWorkspace = new Map<string, string>();
const socketToUser = new Map<string, RealtimeUser>();

async function checkEventRateLimit(key: string) {
  const redisKey = `socket:rl:${key}`;
  const tx = limiterRedis.multi();
  tx.incr(redisKey);
  tx.pttl(redisKey);
  const [countReply, ttlReply] = (await tx.exec()) ?? [];

  const count = Number(countReply?.[1] ?? 0);
  const ttl = Number(ttlReply?.[1] ?? -1);

  if (count === 1 || ttl < 0) {
    await limiterRedis.pexpire(redisKey, env.RATE_LIMIT_SOCKET_WINDOW_MS);
  }

  return count <= env.RATE_LIMIT_SOCKET_MAX;
}

function getWorkspaceUsers(workspaceId: string): RealtimeUser[] {
  return Array.from(workspaceUsers.get(workspaceId)?.values() ?? []);
}

io.on("connection", (socket) => {
  socket.on("workspace:join", async (payload: unknown) => {
    const parsed = joinSchema.safeParse(payload);
    if (!parsed.success) {
      socket.emit("error", { event: "workspace:join", reason: "invalid_payload" });
      return;
    }

    const allowed = await checkEventRateLimit(`${socket.id}:workspace:join`);
    if (!allowed) {
      socket.emit("error", { event: "workspace:join", reason: "rate_limited" });
      return;
    }

    const { workspaceId, user } = parsed.data;
    socket.join(workspaceId);
    socketToWorkspace.set(socket.id, workspaceId);
    socketToUser.set(socket.id, user);

    const roomUsers = workspaceUsers.get(workspaceId) ?? new Map<string, RealtimeUser>();
    roomUsers.set(socket.id, user);
    workspaceUsers.set(workspaceId, roomUsers);

    const joinedPayload: PresenceJoinedPayload = { workspaceId, socketId: socket.id, user };
    socket.to(workspaceId).emit("presence:joined", joinedPayload);

    const snapshot: PresenceSnapshotPayload = { workspaceId, users: getWorkspaceUsers(workspaceId) };
    socket.emit("presence:snapshot", snapshot);
  });

  socket.on("task:moved", async (payload: unknown) => {
    const parsed = moveSchema.safeParse(payload);
    if (!parsed.success) {
      socket.emit("error", { event: "task:moved", reason: "invalid_payload" });
      return;
    }

    const allowed = await checkEventRateLimit(`${socket.id}:task:moved`);
    if (!allowed) {
      socket.emit("error", { event: "task:moved", reason: "rate_limited" });
      return;
    }

    const data: TaskMovedPayload = parsed.data;
    io.to(data.workspaceId).emit("task:moved", data);
  });

  socket.on("task:created", async (payload: unknown) => {
    const parsed = createdSchema.safeParse(payload);
    if (!parsed.success) {
      socket.emit("error", { event: "task:created", reason: "invalid_payload" });
      return;
    }

    const allowed = await checkEventRateLimit(`${socket.id}:task:created`);
    if (!allowed) {
      socket.emit("error", { event: "task:created", reason: "rate_limited" });
      return;
    }

    const data: TaskCreatedPayload = parsed.data;
    io.to(data.workspaceId).emit("task:created", data);
  });

  socket.on("presence:cursor", async (payload: unknown) => {
    const parsed = cursorSchema.safeParse(payload);
    if (!parsed.success) {
      socket.emit("error", { event: "presence:cursor", reason: "invalid_payload" });
      return;
    }

    const allowed = await checkEventRateLimit(`${socket.id}:presence:cursor`);
    if (!allowed) {
      return;
    }

    const data: PresenceCursorPayload = parsed.data;
    socket.to(data.workspaceId).emit("presence:cursor", data);
  });

  socket.on("disconnect", () => {
    const workspaceId = socketToWorkspace.get(socket.id);
    const user = socketToUser.get(socket.id);

    if (workspaceId && user) {
      const roomUsers = workspaceUsers.get(workspaceId);
      roomUsers?.delete(socket.id);
      if (roomUsers && roomUsers.size === 0) {
        workspaceUsers.delete(workspaceId);
      }

      const leftPayload: PresenceLeftPayload = { workspaceId, socketId: socket.id, userId: user.id };
      io.to(workspaceId).emit("presence:left", leftPayload);
    }

    socketToWorkspace.delete(socket.id);
    socketToUser.delete(socket.id);
  });
});

const listenPort = env.PORT ?? env.REALTIME_PORT;

httpServer.listen(listenPort, () => {
  console.log(`[realtime] listening on ${listenPort}`);
  console.log(`[realtime] redis adapter at ${env.REDIS_URL}`);
});
