// src/utils/socket.ts
import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL;

let socket: Socket; 

export const initSocket = (): Socket => {
  if (!SOCKET_URL) {
    throw new Error(
      "VITE_API_URL is not set. Make sure .env has VITE_API_URL and restart the dev server."
    );
  }

  if (!socket) {
    socket = io(SOCKET_URL,{
  transports: ["websocket"],
   withCredentials: true,
});

    socket.on("connect", () => {
      console.log("🔌 Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.warn("🔌 Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("🔌 Socket connect_error:", err.message);
    });
  }

  return socket;
};

export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initSocket() first.");
  }
  return socket;
};
