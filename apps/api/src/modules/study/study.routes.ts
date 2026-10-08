/**
 * Study routes.
 *
 * Mounts endpoints for study sessions, activity tracking, and course progress.
 */

import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as studyController from "./study.controller";

const studyRouter = Router();

// All study operations require authentication
studyRouter.use(authenticate);

// Recently studied activities across courses (for "Continue studying")
studyRouter.get("/recent", studyController.getRecentStudy);

// Start or get active study session
studyRouter.post("/session", studyController.startOrGetSession);

// Single activity details
studyRouter.get("/activities/:activityId", studyController.getActivity);

// Activity lifecycle
studyRouter.post("/activities/:activityId/start", studyController.startActivity);
studyRouter.post(
  "/activities/:activityId/heartbeat",
  studyController.heartbeatActivity,
);
studyRouter.post(
  "/activities/:activityId/complete",
  studyController.completeActivity,
);

// Course-scoped study endpoints
studyRouter.get("/courses/:courseId/study", studyController.getCourseStudy);
studyRouter.get(
  "/courses/:courseId/progress",
  studyController.getCourseProgress,
);

export { studyRouter };
