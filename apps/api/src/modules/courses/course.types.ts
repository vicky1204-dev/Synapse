/**
 * Course module types and DTOs.
 *
 * Adheres strictly to docs/engineering/DATABASE-SCHEMA.md and API.md.
 */

import type { Document, Types } from "mongoose";
import type { ResourceResponse } from "../resources/resource.types";

export const COURSE_STATUSES = ["active", "archived"] as const;
export type CourseStatus = (typeof COURSE_STATUSES)[number];

export const COURSE_SOURCES = ["onboarding", "user"] as const;
export type CourseSource = (typeof COURSE_SOURCES)[number];

export interface ICourseCover {
  color: string;
  icon?: string;
}

// ---------------------------------------------------------------------------
// Document interface
// ---------------------------------------------------------------------------

export interface ICourseDocument extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  ownerId: Types.ObjectId;
  subjectId?: Types.ObjectId;
  code?: string;
  department?: string;
  semester?: string;
  year?: number;
  cover: ICourseCover;
  deadline?: Date;
  progress?: number;
  source: CourseSource;
  status: CourseStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// API Response Types
// ---------------------------------------------------------------------------

export interface CourseSubjectInfo {
  id: string;
  name: string;
  slug: string;
  department?: string;
}

export interface CourseResponse {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  subjectId?: string;
  subject?: CourseSubjectInfo;
  code?: string;
  department?: string;
  semester?: string;
  year?: number;
  cover: ICourseCover;
  deadline?: string;
  progress: number;
  studyPacksCount: number;
  source: CourseSource;
  status: CourseStatus;
  resourcesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseResourceItemResponse {
  id: string;
  courseId: string;
  resourceId: string;
  position: number;
  addedAt: string;
  resource: ResourceResponse;
}

// ---------------------------------------------------------------------------
// DTOs
// ---------------------------------------------------------------------------

export interface CreateCourseDto {
  title: string;
  description?: string;
  subjectId?: string;
  code?: string;
  department?: string;
  semester?: string;
  year?: number;
  deadline?: string | Date | null;
  progress?: number;
  cover?: {
    color?: string;
    icon?: string;
  };
  source?: CourseSource;
  status?: CourseStatus;
}

export interface UpdateCourseDto {
  title?: string;
  description?: string;
  subjectId?: string | null;
  code?: string;
  department?: string;
  semester?: string;
  year?: number;
  deadline?: string | Date | null;
  progress?: number;
  cover?: {
    color?: string;
    icon?: string;
  };
  status?: CourseStatus;
}

export interface AssociateCourseResourceDto {
  resourceId: string;
  position?: number;
}

export interface QueryCoursesDto {
  status?: "active" | "archived" | "all";
  subjectId?: string;
  search?: string;
  page: number;
  limit: number;
}
