/**
 * Global error handler.
 *
 * Catches all errors forwarded via next(err) and maps them to the API
 * error response contract. Operational errors surface a human-readable
 * message; unexpected errors are logged and masked with a generic 500.
 *
 * Error identification uses error.code (machine-readable string),
 * never string-matched messages.
 */

import type { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";
import { sendError } from "../utils/response";

/**
 * Base class for operational API errors.
 * Throw this (or a subclass) from controllers/services to produce
 * a structured response without triggering the 500 branch.
 */
export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
    Error.captureStackTrace(this);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "Bad request", code = "BAD_REQUEST") {
    super(400, code, message);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized", code = "UNAUTHORIZED") {
    super(401, code, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Forbidden", code = "FORBIDDEN") {
    super(403, code, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Not found", code = "NOT_FOUND") {
    super(404, code, message);
  }
}

export class ConflictError extends ApiError {
  constructor(message = "Conflict", code = "CONFLICT") {
    super(409, code, message);
  }
}


export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ApiError) {
    logger.warn({
      message: err.message,
      code: err.code,
      statusCode: err.statusCode,
      requestId: req.id,
      path: req.path,
    });
    return sendError(res, err.statusCode, err.code, err.message);
  }

  // Unexpected error — log at error level, mask from client.
  logger.error({
    message: err instanceof Error ? err.message : "Unknown error",
    stack: err instanceof Error ? err.stack : undefined,
    requestId: req.id,
    path: req.path,
  });

  return sendError(
    res,
    500,
    "INTERNAL_SERVER_ERROR",
    "An unexpected error occurred.",
  );
}
