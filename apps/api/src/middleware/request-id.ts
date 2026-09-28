/**
 * Request ID middleware.
 *
 * Attaches a unique request ID to every incoming request so it can be
 * correlated across log lines. The ID is propagated in the X-Request-Id
 * response header so clients can reference it in bug reports.
 */

import type { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

export function requestId(req: Request, res: Response, next: NextFunction) {
  const id = (req.headers["x-request-id"] as string | undefined) ?? uuidv4();
  req.id = id;
  res.setHeader("X-Request-Id", id);
  next();
}
