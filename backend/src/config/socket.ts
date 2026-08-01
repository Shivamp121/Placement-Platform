import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { socketAuthMiddleware } from "../middelwares/socket.auth.js";

let io: Server;

export const initializeSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    const userId = socket.data.user.id;
    
    console.log(`User Connected to Socket: ${userId}`);
    socket.join(userId);

    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${userId}`);
    });
    socket.on("join_contest_room", (contestId: string) => {
      const roomName = `contest_${contestId}`;
      socket.join(roomName);
      console.log(`User ${socket.data.user.id} joined live contest room: ${roomName}`);
    });
  });

  return io;
};
export const getIO = () => {
  if (!io) throw new Error("Socket.io is not initialized!");
  return io;
};