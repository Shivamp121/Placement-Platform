import { Socket } from "socket.io";
import jwt from "jsonwebtoken";

export const socketAuthMiddleware = (socket: Socket, next: (err?: Error) => void) => {
  try {
    const token = 
      socket.handshake.auth?.token || 
      socket.handshake.query?.token || 
      socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    socket.data.user = decoded;
    next();
  } catch (error) {
    next(new Error("Authentication error: Invalid token"));
  }
};