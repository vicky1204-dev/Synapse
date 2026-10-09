/**
 * Home dashboard controller.
 *
 * HTTP handler for authenticated student home overview.
 */

import type { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../../utils/response";
import { UnauthorizedError } from "../../middleware/error-handler";
import * as homeService from "./home.service";

export async function getHomeDashboard(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError("Authentication required", "UNAUTHORIZED");
    }

    const dashboard = await homeService.getHomeDashboard(userId);
    sendSuccess(res, dashboard);
  } catch (error) {
    next(error);
  }
}
