import mongoose from "mongoose";


const chatRoomSchema = new mongoose.Schema({
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" },

  name: String,
  subject: String,
  tags: [String],

  participants: [{  type: mongoose.Schema.Types.ObjectId,  ref: "User" }],

  aiSummary: String,
  summaryLastMessageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  summaryUpdatedAt: Date,

  isActive: { type: Boolean, default: true },

  expiresAt: Date,

}, { timestamps: true });

chatRoomSchema.index({expiresAt: 1}, {expireAfterSeconds: 0})

export const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema)