/**
 * TanStack Query client configuration.
 *
 * Global defaults:
 * - staleTime: 1 minute — server data doesn't re-fetch on every focus.
 * - retry: 1 — retry once on network errors; not on 4xx.
 * - throwOnError: false — queries surface errors through the `error` field,
 *   not ErrorBoundaries (opted in per-query where needed).
 *
 * The ApiError class is used to suppress retries on known client errors.
 */

import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./types";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: (failureCount, error) => {
          // Never retry on known API errors (4xx).
          if (error instanceof ApiError && error.status < 500) return false;
          return failureCount < 1;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}
