/**
 * API response helpers.
 *
 * All API responses use the shapes defined in API.md:
 *
 *   Success:    { success: true, data: T }
 *   Paginated:  { success: true, data: T[], pagination: Pagination }
 *   Error:      { success: false, error: { code: string, message: string } }
 *
 * Use these helpers in controllers rather than constructing response objects inline.
 */

import type { Response } from "express";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: Pagination;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function sendSuccess<T>(res: Response, data: T, status = 200): Response {
  const body: SuccessResponse<T> = { success: true, data };
  return res.status(status).json(body);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: Pagination,
): Response {
  const body: PaginatedResponse<T> = { success: true, data, pagination };
  return res.status(200).json(body);
}

export function sendError(
  res: Response,
  status: number,
  code: string,
  message: string,
): Response {
  const body: ErrorResponse = { success: false, error: { code, message } };
  return res.status(status).json(body);
}
