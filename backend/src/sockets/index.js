import { registerChatHandlers } from "./handlers/chat.handler.js";

export const initSockets = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    const userId = socket.handshake.auth?.userId;

    if (userId) {
      socket.join(userId); // 🔥 personal room, allows Backend → send notification to specific user
    }

    registerChatHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};