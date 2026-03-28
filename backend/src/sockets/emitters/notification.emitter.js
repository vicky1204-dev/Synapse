import { EVENTS } from "../events";

export const emitAiStarted = (io, userId, questionId) => {
    io.to(userId).emit(EVENTS.QUESTION_AI_STARTED, {
        questionId,
    })
}

export const emitAICompleted = (io, userId, data) => {
  io.to(userId).emit(EVENTS.QUESTION_AI_COMPLETED, data);
};

