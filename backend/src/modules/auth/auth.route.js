import { userSignup, userLogin, refreshAccessToken, logout } from "./auth.controller.js";
import { Router } from "express";

const router = Router()

router.post("/register", userSignup)
router.post("/login", userLogin)
router.post("/refresh-access-token", refreshAccessToken)
router.post("/logout", logout)

export default router