/**
 * Resources feature — mutations.
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createResource,
  uploadResourceFile,
  saveResource,
  unsaveResource,
  deleteResource,
} from "./api";
import { resourceKeys } from "./keys";
import { toast } from "@/components/ui/toast";
import type { CreateResourceRequest } from "./types";

export function useUploadResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => uploadResourceFile(formData),
    onSuccess: (resource) => {
      void queryClient.invalidateQueries({ queryKey: resourceKeys.all });
      void queryClient.invalidateQueries({ queryKey: ["contributions"] });
      toast.add({
        title: "Resource uploaded",
        description: `"${resource.title}" is ready in your library.`,
        type: "success",
      });
    },
    onError: (err: Error) => {
      toast.add({
        title: "Upload failed",
        description: err.message || "Failed to upload file. Please try again.",
        type: "error",
      });
    },
  });
}

export function useCreateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateResourceRequest) => createResource(data),
    onSuccess: (resource) => {
      void queryClient.invalidateQueries({ queryKey: resourceKeys.all });
      void queryClient.invalidateQueries({ queryKey: ["contributions"] });
      toast.add({
        title: "Resource created",
        description: `"${resource.title}" has been added to the library.`,
        type: "success",
      });
    },
    onError: (err: Error) => {
      toast.add({
        title: "Creation failed",
        description: err.message || "Failed to create resource. Please try again.",
        type: "error",
      });
    },
  });
}

export function useSaveResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => saveResource(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resourceKeys.all });
      toast.add({
        title: "Resource saved",
        description: "Added to your saved resources.",
        type: "success",
      });
    },
    onError: (err: Error) => {
      toast.add({
        title: "Action failed",
        description: err.message || "Failed to save resource.",
        type: "error",
      });
    },
  });
}

export function useUnsaveResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => unsaveResource(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resourceKeys.all });
      toast.add({
        title: "Resource removed",
        description: "Removed from your saved resources.",
        type: "success",
      });
    },
    onError: (err: Error) => {
      toast.add({
        title: "Action failed",
        description: err.message || "Failed to remove saved resource.",
        type: "error",
      });
    },
  });
}

export function useDeleteResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteResource(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resourceKeys.all });
      void queryClient.invalidateQueries({ queryKey: ["contributions"] });
      toast.add({
        title: "Resource deleted",
        description: "The resource has been deleted.",
        type: "success",
      });
    },
    onError: (err: Error) => {
      toast.add({
        title: "Delete failed",
        description: err.message || "Failed to delete resource.",
        type: "error",
      });
    },
  });
}

