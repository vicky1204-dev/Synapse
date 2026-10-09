/**
 * Home dashboard feature — React Query hooks.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchHomeDashboard } from "./api";
import { homeKeys } from "./keys";

export function useHomeDashboard() {
  return useQuery({
    queryKey: homeKeys.dashboard(),
    queryFn: fetchHomeDashboard,
    staleTime: 60 * 1000,
  });
}
