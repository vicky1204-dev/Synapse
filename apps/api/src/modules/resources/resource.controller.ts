/**
 * Resource controller.
 *
 * HTTP request handlers for the Resource module.
 */

import type { Request, Response, NextFunction } from "express";
import { sendSuccess, sendPaginated } from "../../utils/response";
import { BadRequestError } from "../../middleware/error-handler";
import {
  createResourceSchema,
  updateResourceSchema,
  queryResourcesSchema,
  associateCourseResourceSchema,
} from "./resource.validation";
import * as resourceService from "./resource.service";

function getParam(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] ?? "";
  return param ?? "";
}

export async function listResources(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed = queryResourcesSchema.safeParse(req.query);
    if (!parsed.success) {
      throw new BadRequestError(
        parsed.error.errors[0]?.message || "Invalid query parameters",
        "VALIDATION_ERROR",
      );
    }

    const { data, pagination } = await resourceService.getResources(
      req.user?.userId,
      parsed.data,
    );

    sendPaginated(res, data, pagination);
  } catch (error) {
    next(error);
  }
}

export async function getResource(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const resource = await resourceService.getResourceById(
      getParam(req.params.resourceId),
      req.user?.userId,
    );

    sendSuccess(res, { resource });
  } catch (error) {
    next(error);
  }
}

export async function createResource(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed = createResourceSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestError(
        parsed.error.errors[0]?.message || "Invalid resource data",
        "VALIDATION_ERROR",
      );
    }

    const resource = await resourceService.createResource(
      req.user!.userId,
      parsed.data,
    );

    sendSuccess(res, { resource }, 201);
  } catch (error) {
    next(error);
  }
}

export async function updateResource(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed = updateResourceSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestError(
        parsed.error.errors[0]?.message || "Invalid update data",
        "VALIDATION_ERROR",
      );
    }

    const resource = await resourceService.updateResource(
      getParam(req.params.resourceId),
      req.user!.userId,
      parsed.data,
    );

    sendSuccess(res, { resource });
  } catch (error) {
    next(error);
  }
}

export async function deleteResource(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await resourceService.deleteResource(
      getParam(req.params.resourceId),
      req.user!.userId,
    );

    sendSuccess(res, { message: "Resource deleted successfully" });
  } catch (error) {
    next(error);
  }
}

export async function saveResource(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await resourceService.saveResource(
      getParam(req.params.resourceId),
      req.user!.userId,
    );

    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function unsaveResource(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await resourceService.unsaveResource(
      getParam(req.params.resourceId),
      req.user!.userId,
    );

    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getSavedResources(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const { data, pagination } = await resourceService.getSavedResources(
      req.user!.userId,
      page,
      limit,
    );

    sendPaginated(res, data, pagination);
  } catch (error) {
    next(error);
  }
}

export async function associateCourse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed = associateCourseResourceSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestError(
        parsed.error.errors[0]?.message || "Invalid association data",
        "VALIDATION_ERROR",
      );
    }

    const result = await resourceService.associateResourceWithCourse(
      getParam(req.params.resourceId),
      parsed.data.courseId,
      req.user!.userId,
      parsed.data.position,
    );

    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function disassociateCourse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await resourceService.disassociateResourceFromCourse(
      getParam(req.params.resourceId),
      getParam(req.params.courseId),
      req.user!.userId,
    );

    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getProcessingStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const processing = await resourceService.getProcessingStatus(
      getParam(req.params.resourceId),
      req.user?.userId,
    );

    sendSuccess(res, { processing });
  } catch (error) {
    next(error);
  }
}
