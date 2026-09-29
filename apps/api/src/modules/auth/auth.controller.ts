/**
 * Authentication controller.
 *
 * HTTP handlers for authentication endpoints:
 * - POST /auth/register
 * - POST /auth/login
 * - POST /auth/logout
 * - POST /auth/refresh
 * - GET  /auth/me
 */

import type { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../../utils/response";
import { BadRequestError } from "../../middleware/error-handler";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
} from "./auth.validation";
import * as authService from "./auth.service";
import { env } from "../../config/env";

// ---------------------------------------------------------------------------
// Cookie options
// ---------------------------------------------------------------------------

const REFRESH_TOKEN_COOKIE = "refreshToken";

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Validate request body
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestError(
        parsed.error.errors[0]?.message || "Invalid input",
        "VALIDATION_ERROR"
      );
    }

    // Register user
    const result = await authService.register(parsed.data);

    // Set refresh token in HTTP-only cookie
    res.cookie(REFRESH_TOKEN_COOKIE, result.refreshToken, cookieOptions);

    sendSuccess(
      res,
      {
        user: result.user,
        accessToken: result.accessToken,
      },
      201
    );
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Validate request body
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestError(
        parsed.error.errors[0]?.message || "Invalid input",
        "VALIDATION_ERROR"
      );
    }

    // Login user
    const result = await authService.login(parsed.data);

    // Set refresh token in HTTP-only cookie
    res.cookie(REFRESH_TOKEN_COOKIE, result.refreshToken, cookieOptions);

    sendSuccess(res, {
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];
    if (!refreshToken) {
      throw new BadRequestError(
        "No refresh token found",
        "NO_REFRESH_TOKEN"
      );
    }

    // Logout user (delete refresh token)
    await authService.logout(refreshToken);

    // Clear cookie
    res.clearCookie(REFRESH_TOKEN_COOKIE, cookieOptions);

    sendSuccess(res, { message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
}

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Get refresh token from cookie or body
    let refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];

    // Fallback to body if cookie not present (for clients that can't use cookies)
    if (!refreshToken) {
      const parsed = refreshSchema.safeParse(req.body);
      if (parsed.success) {
        refreshToken = parsed.data.refreshToken;
      }
    }

    if (!refreshToken) {
      throw new BadRequestError(
        "No refresh token found",
        "NO_REFRESH_TOKEN"
      );
    }

    // Refresh tokens
    const result = await authService.refresh(refreshToken);

    // Set new refresh token in cookie
    res.cookie(REFRESH_TOKEN_COOKIE, result.refreshToken, cookieOptions);

    sendSuccess(res, {
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new BadRequestError("User not authenticated", "NOT_AUTHENTICATED");
    }

    // Get full user data
    const user = await authService.getAuthenticatedUser(req.user.userId);

    sendSuccess(res, { user });
  } catch (error) {
    next(error);
  }
}
