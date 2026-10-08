/**
 * Study feature — queries.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchCourseStudy,
  fetchCourseProgress,
  fetchStudyActivity,
  fetchRecentStudy,
} from "./api";
import { studyKeys } from "./keys";

export function useCourseStudy(courseId: string) {
  return useQuery({
    queryKey: studyKeys.courseStudy(courseId),
    queryFn: () => fetchCourseStudy(courseId),
    enabled: Boolean(courseId),
  });
}

export function useCourseProgress(courseId: string) {
  return useQuery({
    queryKey: studyKeys.courseProgress(courseId),
    queryFn: () => fetchCourseProgress(courseId),
    enabled: Boolean(courseId),
  });
}

export function useStudyActivity(activityId: string) {
  return useQuery({
    queryKey: studyKeys.activity(activityId),
    queryFn: () => fetchStudyActivity(activityId),
    enabled: Boolean(activityId),
  });
}

export function useRecentStudy(limit = 10) {
  return useQuery({
    queryKey: studyKeys.recent(),
    queryFn: () => fetchRecentStudy(limit),
  });
}
