import {Router} from "express"
import {createRoom, getConversations, getOrCreateConversation, getRooms, getMessages, joinRoom, getRoom} from "./chat.controller.js"
import { verifyJwt } from "../../middlewares/auth.middleware.js";

const router = Router()

router.post("/rooms", verifyJwt, createRoom)
router.get("/rooms", getRooms)
router.get("/rooms/:roomId", getRoom)
router.post("/rooms/:id/join", verifyJwt, joinRoom)
router.get("/messages", verifyJwt, getMessages)
router.post("/conversation", verifyJwt, getOrCreateConversation)
router.get("/conversations", verifyJwt, getConversations)

export default router