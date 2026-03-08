"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env.local" });
const port = Number(process.env.REALTIME_PORT ?? "4001");
const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const httpServer = (0, node_http_1.createServer)();
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: appUrl,
        methods: ["GET", "POST"],
    },
});
const pubClient = new ioredis_1.default(redisUrl);
const subClient = pubClient.duplicate();
io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
console.log(`[realtime] Redis adapter configured at ${redisUrl}`);
io.on("connection", (socket) => {
    socket.on("workspace:join", (workspaceId) => {
        socket.join(workspaceId);
        socket.to(workspaceId).emit("presence:joined", { socketId: socket.id, workspaceId });
    });
    socket.on("task:moved", (payload) => {
        io.to(payload.workspaceId).emit("task:moved", payload);
    });
    socket.on("task:updated", (payload) => {
        io.to(payload.workspaceId).emit("task:updated", payload);
    });
    socket.on("disconnect", () => {
        io.emit("presence:left", { socketId: socket.id });
    });
});
httpServer.listen(port, () => {
    console.log(`[realtime] Socket.IO service listening on ${port}`);
});
