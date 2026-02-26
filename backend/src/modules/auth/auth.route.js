import { userSignup, userLogin } from "./auth.controller.js";
import { Router } from "express";

const router = Router()

router.post("/register", userSignup)
router.post("/login", userLogin)

export default router