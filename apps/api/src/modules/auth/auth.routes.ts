/**
 * Authentication routes.
 *
 * Mounted at /api/v1/auth by the main router.
 */

import { Router } from "express";
import * as authController from "./auth.controller";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);

// Protected routes
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.getMe);

export { router as authRouter };
