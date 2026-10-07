/**
 * Courses feature query key factory.
 */

import type { CourseFilters } from "./types";

export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: (filters: CourseFilters = {}) =>
    [...courseKeys.lists(), filters] as const,
  details: () => [...courseKeys.all, "detail"] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
  resources: (courseId: string, page = 1) =>
    [...courseKeys.detail(courseId), "resources", { page }] as const,
};
