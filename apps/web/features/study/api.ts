/**
 * Study feature — API client functions.
 */

import { apiClient } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/lib/api/types";
import type {
  StudyActivity,
  ActivityProgress,
  CourseStudyProgress,
  CourseStudyData,
  StartStudySessionRequest,
  HeartbeatSessionRequest,
  CompleteActivityRequest,
  RecentStudyItem,
} from "./types";

export async function fetchCourseStudy(courseId: string): Promise<CourseStudyData> {
  const res = await apiClient
    .get(`api/v1/courses/${courseId}/study`)
    .json<ApiSuccessResponse<CourseStudyData>>();

  return res.data;
}

export async function fetchCourseProgress(
  courseId: string,
): Promise<CourseStudyProgress> {
  const res = await apiClient
    .get(`api/v1/courses/${courseId}/progress`)
    .json<ApiSuccessResponse<CourseStudyProgress>>();

  return res.data;
}

export async function startOrGetSession(
  data: StartStudySessionRequest,
): Promise<{ activity: StudyActivity; progress: ActivityProgress }> {
  const res = await apiClient
    .post("api/v1/study/session", {
      json: data,
    })
    .json<
      ApiSuccessResponse<{ activity: StudyActivity; progress: ActivityProgress }>
    >();

  return res.data;
}

export async function fetchStudyActivity(
  activityId: string,
): Promise<StudyActivity> {
  const res = await apiClient
    .get(`api/v1/study/activities/${activityId}`)
    .json<ApiSuccessResponse<StudyActivity>>();

  return res.data;
}

export async function startActivity(
  activityId: string,
): Promise<ActivityProgress> {
  const res = await apiClient
    .post(`api/v1/study/activities/${activityId}/start`)
    .json<ApiSuccessResponse<ActivityProgress>>();

  return res.data;
}

export async function heartbeatActivity(
  activityId: string,
  data: HeartbeatSessionRequest,
): Promise<ActivityProgress> {
  const res = await apiClient
    .post(`api/v1/study/activities/${activityId}/heartbeat`, {
      json: data,
    })
    .json<ApiSuccessResponse<ActivityProgress>>();

  return res.data;
}

export async function completeActivity(
  activityId: string,
  data: CompleteActivityRequest = {},
): Promise<ActivityProgress> {
  const res = await apiClient
    .post(`api/v1/study/activities/${activityId}/complete`, {
      json: data,
    })
    .json<ApiSuccessResponse<ActivityProgress>>();

  return res.data;
}

export async function fetchRecentStudy(limit = 10): Promise<RecentStudyItem[]> {
  const searchParams = new URLSearchParams({ limit: String(limit) });
  const res = await apiClient
    .get("api/v1/study/recent", { searchParams })
    .json<ApiSuccessResponse<RecentStudyItem[]>>();

  return res.data;
}
