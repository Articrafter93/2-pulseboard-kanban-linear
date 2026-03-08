import { createServer } from "node:http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const port = Number(process.env.REALTIME_PORT ?? "4001");
const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: appUrl,
    methods: ["GET", "POST"],
  },
});

const pubClient = new Redis(redisUrl);
const subClient = pubClient.duplicate();
io.adapter(createAdapter(pubClient, subClient));
console.log(`[realtime] Redis adapter configured at ${redisUrl}`);

io.on("connection", (socket) => {
  socket.on("workspace:join", (workspaceId: string) => {
    socket.join(workspaceId);
    socket.to(workspaceId).emit("presence:joined", { socketId: socket.id, workspaceId });
  });

  socket.on("task:moved", (payload: { workspaceId: string; taskId: string; status: string }) => {
    io.to(payload.workspaceId).emit("task:moved", payload);
  });

  socket.on("task:updated", (payload: { workspaceId: string; taskId: string }) => {
    io.to(payload.workspaceId).emit("task:updated", payload);
  });

  socket.on("disconnect", () => {
    io.emit("presence:left", { socketId: socket.id });
  });
});

httpServer.listen(port, () => {
  console.log(`[realtime] Socket.IO service listening on ${port}`);
});
