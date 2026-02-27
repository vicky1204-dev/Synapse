import { Router } from "express";
import { verifyJwt } from "../../middlewares/auth.middleware.js";
import { getCurrentUser } from "./user.controller.js";

const router = Router()

router.get("/get-user", verifyJwt, getCurrentUser)

export default router