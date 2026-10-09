/**
 * Saved feature queries.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchSavedResources } from "./api";
import { savedKeys } from "./keys";
import type { SavedResourceQuery } from "./types";

export function useSavedResources(params?: SavedResourceQuery) {
  return useQuery({
    queryKey: savedKeys.list(params),
    queryFn: () => fetchSavedResources(params),
  });
}
