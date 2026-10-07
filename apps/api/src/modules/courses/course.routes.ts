/**
 * Course router.
 *
 * Mounts routes for the personal course workspace.
 */

import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as courseController from "./course.controller";

const courseRouter = Router();

// All course operations are personal and require an authenticated user
courseRouter.use(authenticate);

courseRouter.get("/", courseController.listCourses);
courseRouter.post("/", courseController.createCourse);
courseRouter.get("/:courseId", courseController.getCourse);
courseRouter.patch("/:courseId", courseController.updateCourse);
courseRouter.delete("/:courseId", courseController.deleteCourse);
courseRouter.get("/:courseId/resources", courseController.getCourseResources);
courseRouter.post("/:courseId/resources", courseController.associateResource);
courseRouter.delete(
  "/:courseId/resources/:resourceId",
  courseController.disassociateResource,
);

export { courseRouter };
