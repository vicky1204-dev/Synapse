/**
 * Auth feature — API functions.
 *
 * Plain async functions that call the Synapse auth endpoints.
 * No React hooks here — hooks live in queries.ts / mutations.ts.
 *
 * All functions throw `ApiError` on failure (normalised by the client).
 */

import { apiClient } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/lib/api/types";
import type { AuthData, LoginRequest, RegisterRequest, User } from "./types";

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

export async function fetchCurrentUser(): Promise<User> {
  const res = await apiClient
    .get("api/v1/auth/me")
    .json<ApiSuccessResponse<{ user: User }>>();
  return res.data.user;
}

export async function login(body: LoginRequest): Promise<AuthData> {
  const res = await apiClient
    .post("api/v1/auth/login", { json: body })
    .json<ApiSuccessResponse<AuthData>>();
  return res.data;
}

export async function register(body: RegisterRequest): Promise<AuthData> {
  const res = await apiClient
    .post("api/v1/auth/register", { json: body })
    .json<ApiSuccessResponse<AuthData>>();
  return res.data;
}

export async function logout(): Promise<void> {
  await apiClient.post("api/v1/auth/logout");
}
