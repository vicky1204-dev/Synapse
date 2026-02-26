import { Router } from "express";
import { verifyJwt } from "../../middlewares/auth.middleware.js";

const router = Router()

router.get("/me", verifyJwt, getMe)

export default router