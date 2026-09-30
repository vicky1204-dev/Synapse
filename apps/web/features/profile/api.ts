/**
 * Profile feature — API client functions.
 *
 * Plain async functions for fetching and updating user profile data.
 * All requests run through `apiClient` which automatically handles
 * token injection and 401 silent refresh.
 */

import { apiClient } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/lib/api/types";
import type { User, UpdateProfileRequest } from "./types";

export async function fetchProfile(): Promise<User> {
  const res = await apiClient
    .get("api/v1/users/me")
    .json<ApiSuccessResponse<{ user: User }>>();

  return res.data.user;
}

export async function updateProfile(
  payload: UpdateProfileRequest,
): Promise<User> {
  const res = await apiClient
    .patch("api/v1/users/me", {
      json: payload,
    })
    .json<ApiSuccessResponse<{ user: User }>>();

  return res.data.user;
}
