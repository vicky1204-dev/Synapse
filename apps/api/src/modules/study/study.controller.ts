/**
 * Study controller.
 *
 * HTTP request handlers for study activities, focus sessions, and course progress.
 */

import type { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../../utils/response";
import {
  BadRequestError,
  UnauthorizedError,
} from "../../middleware/error-handler";
import {
  courseIdParamsSchema,
  activityIdParamsSchema,
  startStudySessionSchema,
  heartbeatSessionSchema,
  completeActivitySchema,
  queryRecentStudySchema,
} from "./study.validation";
import * as studyService from "./study.service";

function getParam(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] ?? "";
  return param ?? "";
}

export async function getCourseStudy(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError("Authentication required", "UNAUTHORIZED");
    }

    const params = courseIdParamsSchema.safeParse({
      courseId: getParam(req.params.courseId),
    });
    if (!params.success) {
      throw new BadRequestError(
        params.error.errors[0]?.message || "Invalid course ID",
        "VALIDATION_ERROR",
      );
    }

    const result = await studyService.getCourseStudyActivities(
      params.data.courseId,
      userId,
    );

    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getCourseProgress(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError("Authentication required", "UNAUTHORIZED");
    }

    const params = courseIdParamsSchema.safeParse({
      courseId: getParam(req.params.courseId),
    });
    if (!params.success) {
      throw new BadRequestError(
        params.error.errors[0]?.message || "Invalid course ID",
        "VALIDATION_ERROR",
      );
    }

    const progress = await studyService.getCourseProgress(
      params.data.courseId,
      userId,
    );

    sendSuccess(res, progress);
  } catch (error) {
    next(error);
  }
}

export async function startOrGetSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError("Authentication required", "UNAUTHORIZED");
    }

    const parsed = startStudySessionSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestError(
        parsed.error.errors[0]?.message || "Invalid session payload",
        "VALIDATION_ERROR",
      );
    }

    const session = await studyService.startOrGetSession(
      userId,
      parsed.data,
    );

    sendSuccess(res, session, 201);
  } catch (error) {
    next(error);
  }
}

export async function getActivity(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError("Authentication required", "UNAUTHORIZED");
    }

    const params = activityIdParamsSchema.safeParse({
      activityId: getParam(req.params.activityId),
    });
    if (!params.success) {
      throw new BadRequestError(
        params.error.errors[0]?.message || "Invalid activity ID",
        "VALIDATION_ERROR",
      );
    }

    const activity = await studyService.getActivityById(
      params.data.activityId,
      userId,
    );

    sendSuccess(res, activity);
  } catch (error) {
    next(error);
  }
}

export async function startActivity(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError("Authentication required", "UNAUTHORIZED");
    }

    const params = activityIdParamsSchema.safeParse({
      activityId: getParam(req.params.activityId),
    });
    if (!params.success) {
      throw new BadRequestError(
        params.error.errors[0]?.message || "Invalid activity ID",
        "VALIDATION_ERROR",
      );
    }

    const progress = await studyService.startActivity(
      params.data.activityId,
      userId,
    );

    sendSuccess(res, progress);
  } catch (error) {
    next(error);
  }
}

export async function heartbeatActivity(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError("Authentication required", "UNAUTHORIZED");
    }

    const params = activityIdParamsSchema.safeParse({
      activityId: getParam(req.params.activityId),
    });
    if (!params.success) {
      throw new BadRequestError(
        params.error.errors[0]?.message || "Invalid activity ID",
        "VALIDATION_ERROR",
      );
    }

    const parsed = heartbeatSessionSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestError(
        parsed.error.errors[0]?.message || "Invalid heartbeat payload",
        "VALIDATION_ERROR",
      );
    }

    const progress = await studyService.heartbeatActivity(
      params.data.activityId,
      userId,
      parsed.data,
    );

    sendSuccess(res, progress);
  } catch (error) {
    next(error);
  }
}

export async function completeActivity(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError("Authentication required", "UNAUTHORIZED");
    }

    const params = activityIdParamsSchema.safeParse({
      activityId: getParam(req.params.activityId),
    });
    if (!params.success) {
      throw new BadRequestError(
        params.error.errors[0]?.message || "Invalid activity ID",
        "VALIDATION_ERROR",
      );
    }

    const parsed = completeActivitySchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestError(
        parsed.error.errors[0]?.message || "Invalid complete payload",
        "VALIDATION_ERROR",
      );
    }

    const progress = await studyService.completeActivity(
      params.data.activityId,
      userId,
      parsed.data,
    );

    sendSuccess(res, progress);
  } catch (error) {
    next(error);
  }
}

export async function getRecentStudy(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError("Authentication required", "UNAUTHORIZED");
    }

    const query = queryRecentStudySchema.safeParse(req.query);
    const limit = query.success ? query.data.limit : 10;

    const recent = await studyService.getRecentStudy(userId, limit);

    sendSuccess(res, recent);
  } catch (error) {
    next(error);
  }
}
