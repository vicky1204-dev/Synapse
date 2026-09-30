/**
 * Resources feature — query key factory.
 */

import type { ResourceFilters } from "./types";

export const resourceKeys = {
  all: ["resources"] as const,
  lists: () => [...resourceKeys.all, "list"] as const,
  list: (filters: ResourceFilters) => [...resourceKeys.lists(), filters] as const,
  details: () => [...resourceKeys.all, "detail"] as const,
  detail: (id: string) => [...resourceKeys.details(), id] as const,
  processing: (id: string) => [...resourceKeys.all, "processing", id] as const,
  saved: (page?: number) => [...resourceKeys.all, "saved", page ?? 1] as const,
};
