import { EVENTS } from "../events.js";

export const emitNotification = (io, userId, payload) => {
  io.to(userId).emit(EVENTS.NOTIFICATION_NEW, payload);
};
