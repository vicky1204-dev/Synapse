/**
 * Auth feature — queries.
 *
 * TanStack Query hooks for reading auth/session state from the server.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchCurrentUser } from "./api";
import { authKeys } from "./keys";
import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/lib/api/types";

// ---------------------------------------------------------------------------
// useCurrentUser
// ---------------------------------------------------------------------------

/**
 * Fetches the current authenticated user from `GET /api/v1/auth/me`.
 *
 * On success: syncs the user snapshot into the Zustand store so that
 * non-query code (e.g. the API client token injector) can read it cheaply.
 *
 * On 401: the API client attempts a silent token refresh automatically.
 * If refresh also fails, the store is cleared and the query returns an error.
 */
export function useCurrentUser() {
  const setSession = useAuthStore((s) => s.setSession);
  const accessToken = useAuthStore((s) => s.accessToken);
  const clearSession = useAuthStore((s) => s.clearSession);

  const query = useQuery({
    queryKey: authKeys.me(),
    queryFn: fetchCurrentUser,
    // Retry once; the API client already handles the 401→refresh cycle.
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 401) return false;
      return failureCount < 1;
    },
    // Only run this query once we have an access token in memory.
    // The token is set after login/register/silent refresh.
    enabled: !!accessToken,
  });

  // Sync successful user data into the Zustand store.
  useEffect(() => {
    if (query.data && accessToken) {
      setSession(accessToken, {
        id: query.data.id,
        email: query.data.email,
        name: query.data.name,
        avatarUrl: query.data.avatarUrl,
        onboardingStatus: query.data.onboardingStatus,
      });
    }
  }, [query.data, accessToken, setSession]);

  // If the query fails with a 401 after refresh, clear the session.
  useEffect(() => {
    if (
      query.error instanceof ApiError &&
      query.error.status === 401
    ) {
      clearSession();
    }
  }, [query.error, clearSession]);

  return query;
}
