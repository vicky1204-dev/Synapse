import { userSignup, userLogin, refreshAccessToken } from "./auth.controller.js";
import { Router } from "express";

const router = Router()

router.post("/register", userSignup)
router.post("/login", userLogin)
router.post("/refresh-access-token", refreshAccessToken)

export default router