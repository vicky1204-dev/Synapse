import { EVENTS } from "../events.js";
import { Message } from "../../modules/chat/message.model.js";
import { emitNewMessage } from "../emitters/chat.emitter.js";

export const registerChatHandlers = (io, socket) => {

  socket.on(EVENTS.CHAT_JOIN, (roomId) => {
    socket.join(roomId);
  });

  socket.on(EVENTS.CHAT_LEAVE, (roomId) => {
    socket.leave(roomId);
  });

  socket.on(EVENTS.CHAT_SEND, async (data) => {
    const { roomId, content, userId, type, receiverId } = data;

    let message;

    if (type === "room") {
      message = await Message.create({
        sender: userId,
        content,
        chatRoomId: roomId,
      });
    } else {
      message = await Message.create({
        sender: userId,
        content,
        conversationId: roomId,
      });
    }

    // 🔥 use emitter instead of direct emit
    emitNewMessage(io, { message, roomId, receiverId });
  });
};