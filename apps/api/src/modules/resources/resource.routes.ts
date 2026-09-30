/**
 * Resource router.
 *
 * Mounted at /api/v1/resources.
 * Strictly adheres to docs/engineering/API.md.
 */

import { Router } from "express";
import {
  authenticate,
  optionalAuthenticate,
} from "../../middleware/authenticate";
import * as resourceController from "./resource.controller";

import { upload } from "../../middleware/upload";

const router = Router();

// Resource browse, search, and detail
router.get("/", optionalAuthenticate, resourceController.listResources);
router.post("/", authenticate, resourceController.createResource);
router.post(
  "/upload",
  authenticate,
  upload.single("file"),
  resourceController.uploadResource,
);

router.get("/:resourceId", optionalAuthenticate, resourceController.getResource);
router.patch("/:resourceId", authenticate, resourceController.updateResource);
router.delete("/:resourceId", authenticate, resourceController.deleteResource);

// Processing status
router.get(
  "/:resourceId/processing",
  optionalAuthenticate,
  resourceController.getProcessingStatus,
);

// Saving / Bookmarking
router.post("/:resourceId/save", authenticate, resourceController.saveResource);
router.delete(
  "/:resourceId/save",
  authenticate,
  resourceController.unsaveResource,
);

// Course association (User -> Course -> CourseResource -> Resource)
router.post(
  "/:resourceId/courses",
  authenticate,
  resourceController.associateCourse,
);
router.delete(
  "/:resourceId/courses/:courseId",
  authenticate,
  resourceController.disassociateCourse,
);

export { router as resourceRouter };
