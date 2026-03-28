import { EVENTS } from "../events.js";

// why emitter? Without this: io.emit everywhere, with emitters : Centralized event logic ✔
// Reusable ✔
// Clean ✔

export const emitNewMessage = (io, { message, roomId, receiverId }) => {

  // send to chat room
  io.to(roomId).emit(EVENTS.CHAT_RECEIVE, message);

  // 🔥 send notification to receiver (DM)
  if (receiverId) {
    io.to(receiverId).emit(EVENTS.NOTIFICATION_NEW, {
      type: "message",
      message,
    });
  }
};