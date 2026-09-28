/**
 * Health module routes.
 *
 * Mounted at /api/v1/health by the main router.
 */

import { Router } from "express";
import { getHealth } from "./health.controller";

const router = Router();

router.get("/", getHealth);

export { router as healthRouter };
