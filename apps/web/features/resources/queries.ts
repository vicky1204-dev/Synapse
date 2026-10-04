/**
 * Resources feature — queries.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchResources, fetchResource, fetchProcessingStatus } from "./api";
import { resourceKeys } from "./keys";
import type { ResourceFilters } from "./types";

export function useResources(filters: ResourceFilters = {}) {
  return useQuery({
    queryKey: resourceKeys.list(filters),
    queryFn: () => fetchResources(filters),
  });
}

export function useResource(id: string) {
  return useQuery({
    queryKey: resourceKeys.detail(id),
    queryFn: () => fetchResource(id),
    enabled: Boolean(id),
  });
}

export function useProcessingStatus(id: string, enabled = true) {
  return useQuery({
    queryKey: resourceKeys.processing(id),
    queryFn: () => fetchProcessingStatus(id),
    enabled: Boolean(id && enabled),
    refetchInterval: (query) => {
      // Poll every 2 seconds if status is pending or processing
      const status = query.state.data?.status;
      if (status === "pending" || status === "processing") {
        return 2000;
      }
      return false;
    },
  });
}
