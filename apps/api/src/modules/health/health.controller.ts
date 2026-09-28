/**
 * Health check controller.
 *
 * GET /api/v1/health
 *
 * Returns a lightweight liveness response. Does not check downstream
 * dependencies (DB, external services) — that is intentional for V1 so
 * load balancers can distinguish process health from dependency health.
 */

import type { Request, Response } from "express";
import { sendSuccess } from "../../utils/response";

export function getHealth(_req: Request, res: Response) {
  sendSuccess(res, {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
