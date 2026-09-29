/**
 * Authentication middleware.
 *
 * Protects routes by verifying the access token from the Authorization header.
 * Attaches the authenticated user ID to req.user for downstream use.
 */

import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "./error-handler";
import { verifyAccessToken } from "../modules/auth/auth.service";

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    // Extract token from Authorization header (Bearer <token>)
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedError(
        "No authorization header",
        "NO_AUTH_HEADER"
      );
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new UnauthorizedError(
        "Invalid authorization header format",
        "INVALID_AUTH_HEADER"
      );
    }

    const token = parts[1];
    const payload = verifyAccessToken(token);

    // Attach user info to request
    req.user = {
      userId: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional authentication middleware.
 *
 * Attaches user info if a valid token is provided, but does not fail
 * if no token is present. Useful for routes that behave differently
 * based on authentication status but don't require it.
 */
export function optionalAuthenticate(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next();
    }

    const parts = authHeader.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      const token = parts[1];
      const payload = verifyAccessToken(token);
      req.user = {
        userId: payload.userId,
        email: payload.email,
      };
    }

    next();
  } catch {
    // Silently fail for optional auth
    next();
  }
}
