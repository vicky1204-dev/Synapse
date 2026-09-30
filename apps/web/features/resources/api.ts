/**
 * Resources feature — API client functions.
 */

import { apiClient } from "@/lib/api/client";
import type {
  ApiSuccessResponse,
  ApiPaginatedResponse,
} from "@/lib/api/types";
import type {
  Resource,
  CreateResourceRequest,
  ResourceFilters,
  ResourceProcessing,
} from "./types";

export async function fetchResources(
  filters: ResourceFilters = {},
): Promise<ApiPaginatedResponse<Resource>> {
  const searchParams = new URLSearchParams();

  if (filters.page) searchParams.set("page", String(filters.page));
  if (filters.limit) searchParams.set("limit", String(filters.limit));
  if (filters.search) searchParams.set("search", filters.search);
  if (filters.type) searchParams.set("type", filters.type);
  if (filters.visibility) searchParams.set("visibility", filters.visibility);
  if (filters.topic) searchParams.set("topic", filters.topic);
  if (filters.tag) searchParams.set("tag", filters.tag);
  if (filters.courseId) searchParams.set("courseId", filters.courseId);
  if (filters.uploaderId) searchParams.set("uploaderId", filters.uploaderId);

  const res = await apiClient
    .get("api/v1/resources", { searchParams })
    .json<ApiPaginatedResponse<Resource>>();

  return res;
}

export async function fetchResource(id: string): Promise<Resource> {
  const res = await apiClient
    .get(`api/v1/resources/${id}`)
    .json<ApiSuccessResponse<{ resource: Resource }>>();

  return res.data.resource;
}

export async function createResource(
  data: CreateResourceRequest,
): Promise<Resource> {
  const res = await apiClient
    .post("api/v1/resources", { json: data })
    .json<ApiSuccessResponse<{ resource: Resource }>>();

  return res.data.resource;
}

export async function uploadResourceFile(
  formData: FormData,
): Promise<Resource> {
  const res = await apiClient
    .post("api/v1/resources/upload", {
      body: formData,
    })
    .json<ApiSuccessResponse<{ resource: Resource }>>();

  return res.data.resource;
}

export async function fetchProcessingStatus(
  id: string,
): Promise<ResourceProcessing> {
  const res = await apiClient
    .get(`api/v1/resources/${id}/processing`)
    .json<ApiSuccessResponse<{ processing: ResourceProcessing }>>();

  return res.data.processing;
}

export async function saveResource(
  id: string,
): Promise<{ saved: boolean }> {
  const res = await apiClient
    .post(`api/v1/resources/${id}/save`)
    .json<ApiSuccessResponse<{ saved: boolean }>>();

  return res.data;
}

export async function unsaveResource(
  id: string,
): Promise<{ saved: boolean }> {
  const res = await apiClient
    .delete(`api/v1/resources/${id}/save`)
    .json<ApiSuccessResponse<{ saved: boolean }>>();

  return res.data;
}
