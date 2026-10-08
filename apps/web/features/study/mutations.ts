/**
 * Study feature — mutations.
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  startOrGetSession,
  startActivity,
  heartbeatActivity,
  completeActivity,
} from "./api";
import { studyKeys } from "./keys";
import { toast } from "@/components/ui/toast";
import type {
  StartStudySessionRequest,
  HeartbeatSessionRequest,
  CompleteActivityRequest,
} from "./types";

export function useStartOrGetSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StartStudySessionRequest) => startOrGetSession(data),
    onSuccess: (res) => {
      void queryClient.invalidateQueries({
        queryKey: studyKeys.courseStudy(res.activity.courseId),
      });
      void queryClient.invalidateQueries({
        queryKey: studyKeys.courseProgress(res.activity.courseId),
      });
      void queryClient.invalidateQueries({
        queryKey: studyKeys.recent(),
      });
    },
    onError: (err: Error) => {
      toast.add({
        title: "Session error",
        description: err.message || "Failed to start study session.",
        type: "error",
      });
    },
  });
}

export function useStartActivity(activityId: string, courseId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => startActivity(activityId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: studyKeys.activity(activityId),
      });
      if (courseId) {
        void queryClient.invalidateQueries({
          queryKey: studyKeys.courseStudy(courseId),
        });
      }
    },
  });
}

export function useHeartbeatActivity(activityId: string, courseId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: HeartbeatSessionRequest) =>
      heartbeatActivity(activityId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: studyKeys.activity(activityId),
      });
      if (courseId) {
        void queryClient.invalidateQueries({
          queryKey: studyKeys.courseProgress(courseId),
        });
      }
    },
  });
}

export function useCompleteActivity(activityId: string, courseId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompleteActivityRequest = {}) =>
      completeActivity(activityId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: studyKeys.activity(activityId),
      });
      if (courseId) {
        void queryClient.invalidateQueries({
          queryKey: studyKeys.courseStudy(courseId),
        });
        void queryClient.invalidateQueries({
          queryKey: studyKeys.courseProgress(courseId),
        });
        void queryClient.invalidateQueries({
          queryKey: ["courses", courseId],
        });
      }
      void queryClient.invalidateQueries({
        queryKey: studyKeys.recent(),
      });
      toast.add({
        title: "Activity completed!",
        description: "Great job! Your study progress has been saved.",
        type: "success",
      });
    },
    onError: (err: Error) => {
      toast.add({
        title: "Failed to complete",
        description: err.message || "Could not complete activity.",
        type: "error",
      });
    },
  });
}
