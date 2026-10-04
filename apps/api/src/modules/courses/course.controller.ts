/**
 * Course controller.
 *
 * HTTP request handlers for the Course module.
 */

import type { Request, Response, NextFunction } from "express";
import { sendSuccess, sendPaginated } from "../../utils/response";
import { BadRequestError } from "../../middleware/error-handler";
import {
  createCourseSchema,
  updateCourseSchema,
  queryCoursesSchema,
  courseParamsSchema,
  courseResourcesQuerySchema,
} from "./course.validation";
import * as courseService from "./course.service";

function getParam(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] ?? "";
  return param ?? "";
}

export async function listCourses(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed = queryCoursesSchema.safeParse(req.query);
    if (!parsed.success) {
      throw new BadRequestError(
        parsed.error.errors[0]?.message || "Invalid query parameters",
        "VALIDATION_ERROR",
      );
    }

    const userId = req.user?.userId;
    if (!userId) {
      throw new BadRequestError("Unauthorized", "UNAUTHORIZED");
    }

    const { data, pagination } = await courseService.getCourses(
      userId,
      parsed.data,
    );

    sendPaginated(res, data, pagination);
  } catch (error) {
    next(error);
  }
}

export async function getCourse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = courseParamsSchema.safeParse({
      courseId: getParam(req.params.courseId),
    });
    if (!params.success) {
      throw new BadRequestError(
        params.error.errors[0]?.message || "Invalid course ID format",
        "VALIDATION_ERROR",
      );
    }

    const userId = req.user?.userId;
    if (!userId) {
      throw new BadRequestError("Unauthorized", "UNAUTHORIZED");
    }

    const course = await courseService.getCourseById(
      params.data.courseId,
      userId,
    );

    sendSuccess(res, { course });
  } catch (error) {
    next(error);
  }
}

export async function createCourse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed = createCourseSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestError(
        parsed.error.errors[0]?.message || "Validation failed",
        "VALIDATION_ERROR",
      );
    }

    const userId = req.user?.userId;
    if (!userId) {
      throw new BadRequestError("Unauthorized", "UNAUTHORIZED");
    }

    const course = await courseService.createCourse(userId, parsed.data);

    sendSuccess(res, { course }, 201);
  } catch (error) {
    next(error);
  }
}

export async function updateCourse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = courseParamsSchema.safeParse({
      courseId: getParam(req.params.courseId),
    });
    if (!params.success) {
      throw new BadRequestError(
        params.error.errors[0]?.message || "Invalid course ID format",
        "VALIDATION_ERROR",
      );
    }

    const parsed = updateCourseSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestError(
        parsed.error.errors[0]?.message || "Validation failed",
        "VALIDATION_ERROR",
      );
    }

    const userId = req.user?.userId;
    if (!userId) {
      throw new BadRequestError("Unauthorized", "UNAUTHORIZED");
    }

    const course = await courseService.updateCourse(
      params.data.courseId,
      userId,
      parsed.data,
    );

    sendSuccess(res, { course });
  } catch (error) {
    next(error);
  }
}

export async function deleteCourse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = courseParamsSchema.safeParse({
      courseId: getParam(req.params.courseId),
    });
    if (!params.success) {
      throw new BadRequestError(
        params.error.errors[0]?.message || "Invalid course ID format",
        "VALIDATION_ERROR",
      );
    }

    const userId = req.user?.userId;
    if (!userId) {
      throw new BadRequestError("Unauthorized", "UNAUTHORIZED");
    }

    await courseService.deleteCourse(params.data.courseId, userId);

    sendSuccess(res, { deleted: true });
  } catch (error) {
    next(error);
  }
}

export async function getCourseResources(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = courseParamsSchema.safeParse({
      courseId: getParam(req.params.courseId),
    });
    if (!params.success) {
      throw new BadRequestError(
        params.error.errors[0]?.message || "Invalid course ID format",
        "VALIDATION_ERROR",
      );
    }

    const query = courseResourcesQuerySchema.safeParse(req.query);
    if (!query.success) {
      throw new BadRequestError(
        query.error.errors[0]?.message || "Invalid query parameters",
        "VALIDATION_ERROR",
      );
    }

    const userId = req.user?.userId;
    if (!userId) {
      throw new BadRequestError("Unauthorized", "UNAUTHORIZED");
    }

    const { data, pagination } = await courseService.getCourseResources(
      params.data.courseId,
      userId,
      query.data,
    );

    sendPaginated(res, data, pagination);
  } catch (error) {
    next(error);
  }
}
