/**
 * 404 Not Found handler.
 *
 * Catches requests that fall through all registered routes and returns a
 * machine-readable NOT_FOUND error consistent with the API error contract.
 */

import type { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";

export function notFound(req: Request, res: Response, _next: NextFunction) {
  sendError(res, 404, "NOT_FOUND", `Cannot ${req.method} ${req.path}`);
}
