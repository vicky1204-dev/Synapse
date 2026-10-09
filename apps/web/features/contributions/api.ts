/**
 * Contributions feature — API client functions.
 */

import { apiClient } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/lib/api/types";
import type { UserContributionsResponse } from "./types";

export async function fetchUserContributions(): Promise<UserContributionsResponse> {
  const res = await apiClient
    .get("api/v1/users/me/contributions")
    .json<ApiSuccessResponse<UserContributionsResponse>>();

  return res.data;
}
