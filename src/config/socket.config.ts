import { io, Socket } from "socket.io-client";
import { url } from "./config";

const socketInstance: Socket = io(url, {
  withCredentials: true,
  autoConnect: false, // Changed: Manual connection control
  transports: ["websocket", "polling"],
  reconnection: true, // Auto reconnect on disconnect
  reconnectionAttempts: 5, // Limit reconnection attempts
  reconnectionDelay: 1000, // Wait 1s before reconnecting
  reconnectionDelayMax: 5000, // Max 5s between attempts
  timeout: 20000, // Connection timeout (20s)
  forceNew: false, // Reuse existing connection
});

// Global error handler
socketInstance.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
});

socketInstance.on("disconnect", (reason) => {
  console.warn("Socket disconnected:", reason);
  if (reason === "io server disconnect") {
    // Server disconnected, manual reconnect needed
    socketInstance.connect();
  }
});

export default socketInstance;
