import { userSignup } from "./auth.controller.js";
import { Router } from "express";

const router = Router()

router.post("/register", userSignup)

export default router