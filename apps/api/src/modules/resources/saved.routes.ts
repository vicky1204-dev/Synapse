/**
 * Saved resources router.
 *
 * Mounted at /api/v1/saved.
 * Strictly adheres to docs/engineering/API.md.
 */

import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as resourceController from "./resource.controller";

const router = Router();

router.get("/resources", authenticate, resourceController.getSavedResources);

export { router as savedRouter };
