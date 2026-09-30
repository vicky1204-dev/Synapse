/**
 * Onboarding feature — mutations.
 *
 * TanStack Query mutation hooks for onboarding updates and custom subject creation.
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubject, updateOnboardingData } from "./api";
import { onboardingKeys } from "./keys";
import { authKeys } from "@/features/auth/keys";
import { useAuthStore } from "@/stores/auth.store";
import type { OnboardingFormValues } from "./types";

export function useUpdateOnboarding() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);
  const accessToken = useAuthStore((s) => s.accessToken);

  return useMutation({
    mutationFn: (
      data: Partial<OnboardingFormValues> & {
        onboardingStatus?: "pending" | "completed";
      },
    ) => updateOnboardingData(data),
    onSuccess: (updatedUser) => {
      if (accessToken) {
        setSession(accessToken, {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          avatarUrl: updatedUser.avatarUrl,
          onboardingStatus: updatedUser.onboardingStatus,
        });
      }
      queryClient.setQueryData(authKeys.me(), updatedUser);
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, department }: { name: string; department?: string }) =>
      createSubject(name, department),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.all });
    },
  });
}
