/**
 * Home dashboard feature — API client functions.
 */

import { apiClient } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/lib/api/types";
import type { HomeDashboardData } from "./types";

export async function fetchHomeDashboard(): Promise<HomeDashboardData> {
  const res = await apiClient
    .get("api/v1/home/dashboard")
    .json<ApiSuccessResponse<HomeDashboardData>>();

  return res.data;
}
