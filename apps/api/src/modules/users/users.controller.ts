/**
 * User and Onboarding controller.
 *
 * HTTP handlers for user profile and onboarding endpoints:
 * - GET   /users/me
 * - PATCH /users/me
 * - PATCH /users/me/onboarding
 */

import type { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../../utils/response";
import { BadRequestError } from "../../middleware/error-handler";
import {
  updateOnboardingSchema,
  updateProfileSchema,
} from "./users.validation";
import * as usersService from "./users.service";

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new BadRequestError("User not authenticated", "NOT_AUTHENTICATED");
    }

    const user = await usersService.getUserProfile(req.user.userId);
    sendSuccess(res, { user });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new BadRequestError("User not authenticated", "NOT_AUTHENTICATED");
    }

    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestError(
        parsed.error.errors[0]?.message || "Invalid input",
        "VALIDATION_ERROR",
      );
    }

    const user = await usersService.updateProfile(req.user.userId, parsed.data);
    sendSuccess(res, { user });
  } catch (error) {
    next(error);
  }
}

export async function updateOnboarding(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new BadRequestError("User not authenticated", "NOT_AUTHENTICATED");
    }

    const parsed = updateOnboardingSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestError(
        parsed.error.errors[0]?.message || "Invalid input",
        "VALIDATION_ERROR",
      );
    }

    const user = await usersService.updateOnboarding(
      req.user.userId,
      parsed.data,
    );
    sendSuccess(res, { user });
  } catch (error) {
    next(error);
  }
}
