/**
 * Onboarding feature — queries.
 *
 * TanStack Query hooks for reading onboarding-related server data.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchSubjects } from "./api";
import { onboardingKeys } from "./keys";

export function useSubjects(search?: string) {
  return useQuery({
    queryKey: onboardingKeys.subjects(search),
    queryFn: () => fetchSubjects(search ? { search } : undefined),
    staleTime: 5 * 60 * 1000,
  });
}
