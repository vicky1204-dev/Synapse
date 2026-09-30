/**
 * Subject controller.
 *
 * HTTP handlers for subject catalog endpoints:
 * - GET  /subjects
 * - POST /subjects (authenticated)
 */

import type { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../../utils/response";
import { BadRequestError } from "../../middleware/error-handler";
import {
  createSubjectSchema,
  getSubjectsQuerySchema,
} from "./subject.validation";
import * as subjectService from "./subject.service";

export async function getSubjects(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed = getSubjectsQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      throw new BadRequestError(
        parsed.error.errors[0]?.message || "Invalid query parameters",
        "VALIDATION_ERROR",
      );
    }

    const subjects = await subjectService.getSubjects(parsed.data);
    sendSuccess(res, subjects);
  } catch (error) {
    next(error);
  }
}

export async function createSubject(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed = createSubjectSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestError(
        parsed.error.errors[0]?.message || "Invalid input",
        "VALIDATION_ERROR",
      );
    }

    const subject = await subjectService.findOrCreateSubject(parsed.data);
    sendSuccess(res, subject, 201);
  } catch (error) {
    next(error);
  }
}
