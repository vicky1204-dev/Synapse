/**
 * Contributions feature — queries.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUserContributions } from "./api";
import { contributionKeys } from "./keys";

export function useUserContributions() {
  return useQuery({
    queryKey: contributionKeys.me(),
    queryFn: fetchUserContributions,
  });
}
