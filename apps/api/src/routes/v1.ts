/**
 * API v1 router.
 *
 * Mounts all domain module routers under /api/v1.
 *
 * Convention for adding a new module:
 *   1. Create src/modules/<name>/
 *   2. Implement <name>.routes.ts (and controller, service, etc.)
 *   3. Import the router here and mount it.
 */

import { Router } from "express";
import { healthRouter } from "../modules/health/health.routes";

const v1Router = Router();

v1Router.use("/health", healthRouter);

// Future module routers are mounted here:
// v1Router.use("/auth", authRouter);
// v1Router.use("/courses", coursesRouter);
// v1Router.use("/resources", resourcesRouter);
// v1Router.use("/discussions", discussionsRouter);
// v1Router.use("/study", studyRouter);

export { v1Router };
