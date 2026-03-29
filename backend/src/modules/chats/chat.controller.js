// POST /api/chat/rooms; to create a room
// GET /api/chat/rooms; to get all rooms
// GET /api/chat/messages/:chatId;;  Needed to load history
// POST /api/chat/conversation;  to create/get a particular dm
// GET /api/chat/conversations; to get all conversations list that have been created
// POST /api/chat/rooms/:id/join; to join a room

import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { logger } from "../../utils/logger.util.js";
import { ApiResponse } from "../../utils/apiResponse.util.js";
import { ChatRoom } from "./models/ChatRoom.model.js";
import { Message } from "./models/Message.model.js";
import { Conversation } from "./models/Conversation.model.js";

export const createRoom = asyncHandler(async (req, res) => {
  logger.info("Create room endpoint hit");
  const { name, subject, tags = [] } = req.body;

  const room = await ChatRoom.create({
    name,
    subject,
    tags,
    createdBy: req.user._id,
    participants: [req.user._id],
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
  });

  res.status(201).json(new ApiResponse(201, room, "Room created"));
});

export const getRooms = asyncHandler(async (req, res) => {
  logger.info("Get rooms endpoint hit");
  const rooms = await ChatRoom.find({
    expiresAt: { $gt: new Date() },
  }).populate("createdBy", "username avatar")
    .select("name subject tags createdAt isActive")
    .sort({ createdAt: -1 });

  res.json(new ApiResponse(200, rooms));
});

export const getRoom = asyncHandler(async (req, res) => {
  logger.info("Get room endpoint hit");
  const { roomId } = req.params;

  if (!roomId) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Room Id is required"));
  }
  const roomData = await ChatRoom.findById(roomId)
    .populate("createdBy", "username avatar")
    .select("name subject tags createdBy participants createdAt");

  if (!roomData) {
    return res.status(404).json(new ApiResponse(404, {}, "Room not found"));
  }

  res.status(200).json(new ApiResponse(200, roomData));
});

export const getMessages = asyncHandler(async (req, res) => {
  logger.info("Get messages endpoint hit");
  const { chatId, type, page = 1 } = req.query;
  const limit = 50;
  const skip = (page - 1) * limit;

  if (!chatId || !type) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "chatId and type are required"));
  }

  let filter = {};

  if (type === "room") {
    filter.chatRoomId = chatId;
  } else if (type === "dm") {
    filter.conversationId = chatId;
  } else {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid chat type"));
  }

  const messages = await Message.find(filter)
    .populate("sender", "username avatar")
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit);

  res.json(new ApiResponse(200, messages));
});

export const getOrCreateConversation = asyncHandler(async (req, res) => {
  logger.info("Create conversation endpoint hit");

  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json(new ApiResponse(400, {}, "UserId is required"));
  }

  let convo = await Conversation.findOne({
    participants: { $all: [req.user._id, userId] },
  });

  if (!convo) {
    convo = await Conversation.create({
      participants: [req.user._id, userId],
    });
  }

  res.json(new ApiResponse(200, convo));
});

export const getConversations = asyncHandler(async (req, res) => {
  logger.info("Get conversations endpoint hit");

  const conversations = await Conversation.find({
    participants: req.user._id,
  })
    .populate("participants", "username avatar")
    .sort({ updatedAt: -1 });

  res.status(200).json(new ApiResponse(200, conversations));
});

export const joinRoom = asyncHandler(async (req, res) => {
  logger.info("Join room endpoint hit");
  const { id } = req.params;

  const room = await ChatRoom.findByIdAndUpdate(
    id,
    {
      $addToSet: { participants: req.user._id }, // 🔥 avoids duplicates
    },
    { new: true },
  );

  if (!room) {
    return res.status(404).json(new ApiResponse(404, {}, "Room not found"));
  }

  res.json(new ApiResponse(200, room, "Joined room"));
});
