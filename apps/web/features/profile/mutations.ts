/**
 * Profile feature — mutations.
 *
 * TanStack Query mutation hooks for updating the user profile.
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "./api";
import { profileKeys } from "./keys";
import { authKeys } from "@/features/auth/keys";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "@/components/ui/toast";
import type { UpdateProfileRequest } from "./types";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);
  const accessToken = useAuthStore((s) => s.accessToken);

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateProfile(data),
    onSuccess: (updatedUser) => {
      // Sync auth store
      if (accessToken) {
        setSession(accessToken, {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          avatarUrl: updatedUser.avatarUrl,
          onboardingStatus: updatedUser.onboardingStatus,
        });
      }

      // Invalidate relevant queries
      void queryClient.invalidateQueries({ queryKey: profileKeys.all });
      void queryClient.invalidateQueries({ queryKey: authKeys.all });

      toast.add({
        title: "Profile updated",
        description: "Your academic profile changes have been saved.",
        type: "success",
      });
    },
    onError: (err: Error) => {
      toast.add({
        title: "Update failed",
        description: err.message || "Failed to update profile. Please try again.",
        type: "error",
      });
    },
  });
}
