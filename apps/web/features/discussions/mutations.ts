/**
 * Discussions feature — mutations.
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  createComment,
  updateComment,
  deleteComment,
} from "./api";
import { discussionKeys } from "./keys";
import { toast } from "@/components/ui/toast";
import type {
  CreateDiscussionRequest,
  UpdateDiscussionRequest,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "./types";

export function useCreateDiscussion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDiscussionRequest) => createDiscussion(data),
    onSuccess: (discussion) => {
      void queryClient.invalidateQueries({ queryKey: discussionKeys.all });
      void queryClient.invalidateQueries({ queryKey: ["contributions"] });
      toast.add({
        title: "Discussion started",
        description: `"${discussion.title}" has been published.`,
        type: "success",
      });
    },
    onError: (err: Error) => {
      toast.add({
        title: "Failed to create discussion",
        description: err.message || "Something went wrong. Please try again.",
        type: "error",
      });
    },
  });
}

export function useUpdateDiscussion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateDiscussionRequest;
    }) => updateDiscussion(id, data),
    onSuccess: (discussion) => {
      void queryClient.invalidateQueries({ queryKey: discussionKeys.all });
      toast.add({
        title: "Discussion updated",
        description: `"${discussion.title}" has been updated.`,
        type: "success",
      });
    },
    onError: (err: Error) => {
      toast.add({
        title: "Failed to update discussion",
        description: err.message || "Something went wrong. Please try again.",
        type: "error",
      });
    },
  });
}

export function useDeleteDiscussion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDiscussion(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: discussionKeys.all });
      void queryClient.invalidateQueries({ queryKey: ["contributions"] });
      toast.add({
        title: "Discussion deleted",
        description: "The discussion has been removed.",
        type: "success",
      });
    },
    onError: (err: Error) => {
      toast.add({
        title: "Failed to delete discussion",
        description: err.message || "Something went wrong. Please try again.",
        type: "error",
      });
    },
  });
}

export function useCreateComment(discussionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentRequest) =>
      createComment(discussionId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: discussionKeys.comments(discussionId),
      });
      void queryClient.invalidateQueries({
        queryKey: discussionKeys.detail(discussionId),
      });
      void queryClient.invalidateQueries({ queryKey: ["contributions"] });
      toast.add({
        title: "Reply posted",
        description: "Your reply has been added to the discussion.",
        type: "success",
      });
    },
    onError: (err: Error) => {
      toast.add({
        title: "Failed to post reply",
        description: err.message || "Something went wrong. Please try again.",
        type: "error",
      });
    },
  });
}

export function useUpdateComment(discussionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      data,
    }: {
      commentId: string;
      data: UpdateCommentRequest;
    }) => updateComment(commentId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: discussionKeys.comments(discussionId),
      });
      toast.add({
        title: "Comment updated",
        description: "Your comment has been edited.",
        type: "success",
      });
    },
    onError: (err: Error) => {
      toast.add({
        title: "Failed to update comment",
        description: err.message || "Something went wrong. Please try again.",
        type: "error",
      });
    },
  });
}

export function useDeleteComment(discussionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: discussionKeys.comments(discussionId),
      });
      void queryClient.invalidateQueries({
        queryKey: discussionKeys.detail(discussionId),
      });
      toast.add({
        title: "Comment removed",
        description: "The comment has been removed.",
        type: "success",
      });
    },
    onError: (err: Error) => {
      toast.add({
        title: "Failed to remove comment",
        description: err.message || "Something went wrong. Please try again.",
        type: "error",
      });
    },
  });
}
