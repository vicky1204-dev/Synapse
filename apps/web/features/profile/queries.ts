/**
 * Profile feature — queries.
 *
 * TanStack Query hooks for reading user profile state.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchProfile } from "./api";
import { profileKeys } from "./keys";
import { useAuthStore } from "@/stores/auth.store";

export function useProfile() {
  const setSession = useAuthStore((s) => s.setSession);
  const accessToken = useAuthStore((s) => s.accessToken);

  const query = useQuery({
    queryKey: profileKeys.me(),
    queryFn: fetchProfile,
  });

  // Keep Zustand session store in sync when profile is loaded
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

  return query;
}
