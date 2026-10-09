/**
 * Saved feature mutations.
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveResource, unsaveResource } from "@/features/resources/api";
import { savedKeys } from "./keys";
import { resourceKeys } from "@/features/resources/keys";
import { homeKeys } from "@/features/home/keys";
import { toast } from "@/components/ui/toast";

export function useRemoveSavedResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resourceId: string) => unsaveResource(resourceId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: savedKeys.all });
      void queryClient.invalidateQueries({ queryKey: resourceKeys.all });
      void queryClient.invalidateQueries({ queryKey: homeKeys.all });
      toast.add({
        title: "Bookmark removed",
        description: "Resource removed from your saved items.",
        type: "success",
      });
    },
    onError: (err: Error) => {
      toast.add({
        title: "Action failed",
        description: err.message || "Could not remove saved resource.",
        type: "error",
      });
    },
  });
}

export function useToggleSave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      isSaved,
    }: {
      id: string;
      isSaved?: boolean;
    }) => {
      if (isSaved) {
        return unsaveResource(id);
      }
      return saveResource(id);
    },
    onSuccess: (_, { isSaved }) => {
      void queryClient.invalidateQueries({ queryKey: savedKeys.all });
      void queryClient.invalidateQueries({ queryKey: resourceKeys.all });
      void queryClient.invalidateQueries({ queryKey: homeKeys.all });
      toast.add({
        title: isSaved ? "Bookmark removed" : "Resource saved",
        description: isSaved
          ? "Removed from your saved items."
          : "Saved for quick access.",
        type: "success",
      });
    },
    onError: (err: Error) => {
      toast.add({
        title: "Action failed",
        description: err.message || "Failed to update bookmark.",
        type: "error",
      });
    },
  });
}
