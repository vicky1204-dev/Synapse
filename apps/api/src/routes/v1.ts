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
import { authRouter } from "../modules/auth/auth.routes";
import { subjectRouter } from "../modules/subjects/subject.routes";
import { usersRouter } from "../modules/users/users.routes";

import { resourceRouter } from "../modules/resources/resource.routes";
import { savedRouter } from "../modules/resources/saved.routes";
import { courseRouter } from "../modules/courses/course.routes";

import {
  discussionRouter,
  commentRouter,
} from "../modules/discussions/discussion.routes";

import { studyRouter } from "../modules/study/study.routes";
import { homeRouter } from "../modules/home/home.routes";

const v1Router = Router();

v1Router.use("/health", healthRouter);
v1Router.use("/auth", authRouter);
v1Router.use("/subjects", subjectRouter);
v1Router.use("/users", usersRouter);
v1Router.use("/resources", resourceRouter);
v1Router.use("/saved", savedRouter);
v1Router.use("/courses", courseRouter);
v1Router.use("/discussions", discussionRouter);
v1Router.use("/comments", commentRouter);
v1Router.use("/study", studyRouter);
v1Router.use("/home", homeRouter);

export { v1Router };
