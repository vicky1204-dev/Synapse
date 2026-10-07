/**
 * Discussion & Comment routers.
 *
 * Implements Reddit-like discussion forum routes and comment threads.
 */

import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as discussionController from "./discussion.controller";

const discussionRouter = Router();
const commentRouter = Router();

// ---------------------------------------------------------------------------
// Discussion Routes (/api/v1/discussions)
// ---------------------------------------------------------------------------

// Discussions listing (public / filterable)
discussionRouter.get("/", discussionController.listDiscussions);

// Create discussion (requires auth)
discussionRouter.post("/", authenticate, discussionController.createDiscussion);

// Get single discussion by ID (public)
discussionRouter.get("/:discussionId", discussionController.getDiscussion);

// Update discussion (requires auth)
discussionRouter.patch("/:discussionId", authenticate, discussionController.updateDiscussion);

// Delete discussion (requires auth)
discussionRouter.delete("/:discussionId", authenticate, discussionController.deleteDiscussion);

// Comments for a discussion (public)
discussionRouter.get("/:discussionId/comments", discussionController.listComments);

// Add comment to discussion (requires auth)
discussionRouter.post("/:discussionId/comments", authenticate, discussionController.createComment);

// Nested comment convenience routes under discussions
discussionRouter.patch("/:discussionId/comments/:commentId", authenticate, discussionController.updateComment);
discussionRouter.delete("/:discussionId/comments/:commentId", authenticate, discussionController.deleteComment);

// ---------------------------------------------------------------------------
// Comment Routes (/api/v1/comments)
// ---------------------------------------------------------------------------

commentRouter.use(authenticate);

// Update comment
commentRouter.patch("/:commentId", discussionController.updateComment);

// Delete comment
commentRouter.delete("/:commentId", discussionController.deleteComment);

export { discussionRouter, commentRouter };
