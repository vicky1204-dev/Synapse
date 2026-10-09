/**
 * Home dashboard router.
 *
 * Mounts routes for the authenticated student dashboard under /api/v1/home.
 */

import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as homeController from "./home.controller";

const homeRouter = Router();

// All home dashboard operations require an authenticated user
homeRouter.use(authenticate);

homeRouter.get("/", homeController.getHomeDashboard);
homeRouter.get("/dashboard", homeController.getHomeDashboard);

export { homeRouter };
