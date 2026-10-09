/**
 * Saved feature API client functions.
 */

import { apiClient } from "@/lib/api/client";
import type { ApiPaginatedResponse } from "@/lib/api/types";
import type { Resource } from "@/features/resources/types";
import type { SavedResourceQuery } from "./types";

export async function fetchSavedResources(
  params?: SavedResourceQuery,
): Promise<ApiPaginatedResponse<Resource>> {
  const searchParams: Record<string, string> = {};
  if (params?.page) searchParams.page = String(params.page);
  if (params?.limit) searchParams.limit = String(params.limit);
  if (params?.search) searchParams.search = params.search;
  if (params?.type && params.type !== "all") searchParams.type = params.type;

  return apiClient
    .get("api/v1/saved/resources", { searchParams })
    .json<ApiPaginatedResponse<Resource>>();
}
