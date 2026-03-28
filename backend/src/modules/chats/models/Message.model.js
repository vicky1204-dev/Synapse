import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    content: String,

    chatRoomId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom" },

    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
  },
  { timestamps: true },
);

export const Message = mongoose.model("Message", messageSchema);
