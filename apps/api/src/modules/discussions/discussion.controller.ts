/**
 * Discussion & Comment controller.
 *
 * HTTP request handlers for the Discussion and Comment modules.
 */

import type { Request, Response, NextFunction } from "express";
import { sendSuccess, sendPaginated } from "../../utils/response";
import { BadRequestError, UnauthorizedError } from "../../middleware/error-handler";
import {
  createDiscussionSchema,
  updateDiscussionSchema,
  queryDiscussionsSchema,
  discussionParamsSchema,
  createCommentSchema,
  updateCommentSchema,
  queryCommentsSchema,
  commentParamsSchema,
} from "./discussion.validation";
import * as discussionService from "./discussion.service";

function getParam(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] ?? "";
  return param ?? "";
}

// ---------------------------------------------------------------------------
// Discussion Handlers
// ---------------------------------------------------------------------------

export async function listDiscussions(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed = queryDiscussionsSchema.safeParse(req.query);
    if (!parsed.success) {
      throw new BadRequestError(
        parsed.error.errors[0]?.message || "Invalid query parameters",
        "VALIDATION_ERROR",
      );
    }

    const { data, pagination } = await discussionService.getDiscussions(
      parsed.data,
    );

    sendPaginated(res, data, pagination);
  } catch (error) {
    next(error);
  }
}

export async function getDiscussion(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = discussionParamsSchema.safeParse({
      discussionId: getParam(req.params.discussionId),
    });
    if (!params.success) {
      throw new BadRequestError(
        params.error.errors[0]?.message || "Invalid discussion ID format",
        "VALIDATION_ERROR",
      );
    }

    const discussion = await discussionService.getDiscussionById(
      params.data.discussionId,
    );

    sendSuccess(res, discussion);
  } catch (error) {
    next(error);
  }
}

export async function createDiscussion(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError("Authentication required", "UNAUTHORIZED");
    }

    const parsed = createDiscussionSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestError(
        parsed.error.errors[0]?.message || "Invalid discussion payload",
        "VALIDATION_ERROR",
      );
    }

    const discussion = await discussionService.createDiscussion(
      userId,
      parsed.data,
    );

    sendSuccess(res, discussion, 201);
  } catch (error) {
    next(error);
  }
}

export async function updateDiscussion(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError("Authentication required", "UNAUTHORIZED");
    }

    const params = discussionParamsSchema.safeParse({
      discussionId: getParam(req.params.discussionId),
    });
    if (!params.success) {
      throw new BadRequestError(
        params.error.errors[0]?.message || "Invalid discussion ID format",
        "VALIDATION_ERROR",
      );
    }

    const parsed = updateDiscussionSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestError(
        parsed.error.errors[0]?.message || "Invalid discussion update payload",
        "VALIDATION_ERROR",
      );
    }

    const discussion = await discussionService.updateDiscussion(
      params.data.discussionId,
      userId,
      parsed.data,
    );

    sendSuccess(res, discussion);
  } catch (error) {
    next(error);
  }
}

export async function deleteDiscussion(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError("Authentication required", "UNAUTHORIZED");
    }

    const params = discussionParamsSchema.safeParse({
      discussionId: getParam(req.params.discussionId),
    });
    if (!params.success) {
      throw new BadRequestError(
        params.error.errors[0]?.message || "Invalid discussion ID format",
        "VALIDATION_ERROR",
      );
    }

    await discussionService.deleteDiscussion(
      params.data.discussionId,
      userId,
    );

    sendSuccess(res, { deleted: true });
  } catch (error) {
    next(error);
  }
}

// ---------------------------------------------------------------------------
// Comment Handlers
// ---------------------------------------------------------------------------

export async function listComments(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = discussionParamsSchema.safeParse({
      discussionId: getParam(req.params.discussionId),
    });
    if (!params.success) {
      throw new BadRequestError(
        params.error.errors[0]?.message || "Invalid discussion ID format",
        "VALIDATION_ERROR",
      );
    }

    const parsed = queryCommentsSchema.safeParse(req.query);
    if (!parsed.success) {
      throw new BadRequestError(
        parsed.error.errors[0]?.message || "Invalid query parameters",
        "VALIDATION_ERROR",
      );
    }

    const { data, pagination } = await discussionService.getComments(
      params.data.discussionId,
      parsed.data,
    );

    sendPaginated(res, data, pagination);
  } catch (error) {
    next(error);
  }
}

export async function createComment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError("Authentication required", "UNAUTHORIZED");
    }

    const params = discussionParamsSchema.safeParse({
      discussionId: getParam(req.params.discussionId),
    });
    if (!params.success) {
      throw new BadRequestError(
        params.error.errors[0]?.message || "Invalid discussion ID format",
        "VALIDATION_ERROR",
      );
    }

    const parsed = createCommentSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestError(
        parsed.error.errors[0]?.message || "Invalid comment payload",
        "VALIDATION_ERROR",
      );
    }

    const comment = await discussionService.createComment(
      params.data.discussionId,
      userId,
      parsed.data,
    );

    sendSuccess(res, comment, 201);
  } catch (error) {
    next(error);
  }
}

export async function updateComment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError("Authentication required", "UNAUTHORIZED");
    }

    const params = commentParamsSchema.safeParse({
      commentId: getParam(req.params.commentId),
    });
    if (!params.success) {
      throw new BadRequestError(
        params.error.errors[0]?.message || "Invalid comment ID format",
        "VALIDATION_ERROR",
      );
    }

    const parsed = updateCommentSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestError(
        parsed.error.errors[0]?.message || "Invalid comment update payload",
        "VALIDATION_ERROR",
      );
    }

    const comment = await discussionService.updateComment(
      params.data.commentId,
      userId,
      parsed.data,
    );

    sendSuccess(res, comment);
  } catch (error) {
    next(error);
  }
}

export async function deleteComment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError("Authentication required", "UNAUTHORIZED");
    }

    const params = commentParamsSchema.safeParse({
      commentId: getParam(req.params.commentId),
    });
    if (!params.success) {
      throw new BadRequestError(
        params.error.errors[0]?.message || "Invalid comment ID format",
        "VALIDATION_ERROR",
      );
    }

    await discussionService.deleteComment(
      params.data.commentId,
      userId,
    );

    sendSuccess(res, { deleted: true });
  } catch (error) {
    next(error);
  }
}

// ---------------------------------------------------------------------------
// Course-scoped Discussions Handler
// ---------------------------------------------------------------------------

export async function getCourseDiscussions(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const courseId = getParam(req.params.courseId);
    if (!courseId) {
      throw new BadRequestError("Course ID is required", "VALIDATION_ERROR");
    }

    const parsed = queryDiscussionsSchema.safeParse({
      ...req.query,
      courseId,
    });
    if (!parsed.success) {
      throw new BadRequestError(
        parsed.error.errors[0]?.message || "Invalid query parameters",
        "VALIDATION_ERROR",
      );
    }

    const { data, pagination } = await discussionService.getDiscussions(
      parsed.data,
    );

    sendPaginated(res, data, pagination);
  } catch (error) {
    next(error);
  }
}
