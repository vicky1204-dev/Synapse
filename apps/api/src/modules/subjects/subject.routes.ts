/**
 * Subject routes.
 *
 * Mounted at /api/v1/subjects by the main router.
 */

import { Router } from "express";
import * as subjectController from "./subject.controller";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

// GET /api/v1/subjects — Catalog access
router.get("/", subjectController.getSubjects);

// POST /api/v1/subjects — Add/ensure subject in catalog (e.g., custom user subject)
router.post("/", authenticate, subjectController.createSubject);

export { router as subjectRouter };
