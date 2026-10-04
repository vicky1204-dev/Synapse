/**
 * Courses feature — API client functions.
 */

import { apiClient } from "@/lib/api/client";
import type {
  ApiSuccessResponse,
  ApiPaginatedResponse,
} from "@/lib/api/types";
import type {
  Course,
  CourseResourceItem,
  CourseFilters,
  CreateCourseRequest,
  UpdateCourseRequest,
} from "./types";

export async function fetchCourses(
  filters: CourseFilters = {},
): Promise<ApiPaginatedResponse<Course>> {
  const searchParams = new URLSearchParams();

  if (filters.page) searchParams.set("page", String(filters.page));
  if (filters.limit) searchParams.set("limit", String(filters.limit));
  if (filters.status) searchParams.set("status", filters.status);
  if (filters.subjectId) searchParams.set("subjectId", filters.subjectId);
  if (filters.search) searchParams.set("search", filters.search);

  return apiClient
    .get("api/v1/courses", { searchParams })
    .json<ApiPaginatedResponse<Course>>();
}

export async function fetchCourse(id: string): Promise<Course> {
  const res = await apiClient
    .get(`api/v1/courses/${id}`)
    .json<ApiSuccessResponse<{ course: Course }>>();

  return res.data.course;
}

export async function createCourse(
  data: CreateCourseRequest,
): Promise<Course> {
  const res = await apiClient
    .post("api/v1/courses", {
      json: data,
    })
    .json<ApiSuccessResponse<{ course: Course }>>();

  return res.data.course;
}

export async function updateCourse(
  id: string,
  data: UpdateCourseRequest,
): Promise<Course> {
  const res = await apiClient
    .patch(`api/v1/courses/${id}`, {
      json: data,
    })
    .json<ApiSuccessResponse<{ course: Course }>>();

  return res.data.course;
}

export async function deleteCourse(id: string): Promise<void> {
  await apiClient
    .delete(`api/v1/courses/${id}`)
    .json<ApiSuccessResponse<null>>();
}

export async function fetchCourseResources(
  courseId: string,
  page = 1,
  limit = 20,
): Promise<ApiPaginatedResponse<CourseResourceItem>> {
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return apiClient
    .get(`api/v1/courses/${courseId}/resources`, { searchParams })
    .json<ApiPaginatedResponse<CourseResourceItem>>();
}
