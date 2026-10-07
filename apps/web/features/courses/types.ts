/**
 * Courses feature types and contracts.
 */

import type { Resource } from "@/features/resources/types";

export type CourseStatus = "active" | "archived";
export type CourseSource = "onboarding" | "user";

export interface CourseCover {
  color: string;
  icon?: string;
}

export interface CourseSubject {
  id: string;
  name: string;
  slug: string;
  department?: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  subjectId?: string;
  subject?: CourseSubject;
  code?: string;
  department?: string;
  semester?: string;
  year?: number;
  cover: CourseCover;
  deadline?: string;
  progress: number;
  studyPacksCount: number;
  source: CourseSource;
  status: CourseStatus;
  resourcesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseResourceItem {
  id: string;
  courseId: string;
  resourceId: string;
  position: number;
  addedAt: string;
  resource: Resource;
}

export interface CourseFilters {
  status?: "active" | "archived" | "all";
  subjectId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateCourseRequest {
  title: string;
  description?: string;
  subjectId?: string;
  code?: string;
  department?: string;
  semester?: string;
  year?: number;
  deadline?: string | null;
  progress?: number;
  cover?: {
    color?: string;
    icon?: string;
  };
  source?: CourseSource;
  status?: CourseStatus;
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  subjectId?: string | null;
  code?: string;
  department?: string;
  semester?: string;
  year?: number;
  deadline?: string | null;
  progress?: number;
  cover?: {
    color?: string;
    icon?: string;
  };
  status?: CourseStatus;
}
