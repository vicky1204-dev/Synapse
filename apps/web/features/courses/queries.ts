/**
 * Courses feature — queries.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCourses, fetchCourse, fetchCourseResources } from "./api";
import { courseKeys } from "./keys";
import type { CourseFilters } from "./types";

export function useCourses(filters: CourseFilters = {}) {
  return useQuery({
    queryKey: courseKeys.list(filters),
    queryFn: () => fetchCourses(filters),
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => fetchCourse(id),
    enabled: Boolean(id),
  });
}

export function useCourseResources(courseId: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: courseKeys.resources(courseId, page),
    queryFn: () => fetchCourseResources(courseId, page, limit),
    enabled: Boolean(courseId),
  });
}
