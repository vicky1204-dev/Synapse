/**
 * User and Onboarding routes.
 *
 * Mounted at /api/v1/users by the main router.
 */

import { Router } from "express";
import * as usersController from "./users.controller";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

// Protected user profile & onboarding endpoints
router.get("/me", authenticate, usersController.getMe);
router.patch("/me", authenticate, usersController.updateProfile);
router.patch("/me/onboarding", authenticate, usersController.updateOnboarding);

export { router as usersRouter };
