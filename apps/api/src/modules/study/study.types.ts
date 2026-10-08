/**
 * Study & Activity tracking types.
 *
 * Implements models specified in docs/engineering/DATABASE-SCHEMA.md (Sections 7, 8, 9).
 */

import type { Types, Document } from "mongoose";

export type StudyActivityType =
  | "resource-study"
  | "concept-review"
  | "flashcard"
  | "quiz";

export type ActivityProgressStatus = "not-started" | "in-progress" | "completed";

// ---------------------------------------------------------------------------
// Document Interfaces
// ---------------------------------------------------------------------------

export interface IStudyActivity extends Document {
  _id: Types.ObjectId;
  userId?: Types.ObjectId;
  courseId: Types.ObjectId;
  resourceId?: Types.ObjectId;
  studyPackId?: Types.ObjectId;
  type: StudyActivityType;
  title: string;
  description?: string;
  order: number;
  content: Record<string, unknown>;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IActivityProgress extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  activityId: Types.ObjectId;
  courseId: Types.ObjectId;
  resourceId?: Types.ObjectId;
  status: ActivityProgressStatus;
  durationSeconds: number;
  lastPosition?: string | number;
  notes?: string;
  startedAt?: Date;
  completedAt?: Date;
  lastStudiedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStudyProgress extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  completedActivityCount: number;
  totalActivityCount: number;
  totalStudyTimeMinutes: number;
  lastActivityId?: Types.ObjectId;
  lastStudiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// DTOs
// ---------------------------------------------------------------------------

export interface StartStudySessionDto {
  courseId: string;
  resourceId?: string;
  title?: string;
  type?: StudyActivityType;
}

export interface HeartbeatSessionDto {
  durationIncrementSeconds?: number;
  lastPosition?: string | number;
  notes?: string;
}

export interface CompleteActivityDto {
  durationIncrementSeconds?: number;
  notes?: string;
}

export interface QueryRecentStudyDto {
  limit?: number;
}

// ---------------------------------------------------------------------------
// API Response Models
// ---------------------------------------------------------------------------

export interface ActivityProgressResponse {
  id: string;
  userId: string;
  activityId: string;
  courseId: string;
  resourceId?: string;
  status: ActivityProgressStatus;
  durationSeconds: number;
  lastPosition?: string | number;
  notes?: string;
  startedAt?: string;
  completedAt?: string;
  lastStudiedAt: string;
}

export interface StudyActivityResponse {
  id: string;
  courseId: string;
  resourceId?: string;
  studyPackId?: string;
  type: StudyActivityType;
  title: string;
  description?: string;
  order: number;
  content: Record<string, unknown>;
  metadata: Record<string, unknown>;
  course?: {
    id: string;
    title: string;
    code?: string;
  };
  resource?: {
    id: string;
    title: string;
    type: string;
    url?: string;
    pageCount?: number;
  };
  progress?: ActivityProgressResponse;
  createdAt: string;
  updatedAt: string;
}

export interface CourseStudyProgressResponse {
  courseId: string;
  completedActivityCount: number;
  totalActivityCount: number;
  totalStudyTimeMinutes: number;
  completionPercentage: number;
  lastActivity?: {
    id: string;
    title: string;
    type: StudyActivityType;
  };
  lastStudiedAt?: string;
}

export interface RecentStudyItemResponse {
  activity: StudyActivityResponse;
  progress: ActivityProgressResponse;
  course: {
    id: string;
    title: string;
    code?: string;
    cover?: {
      color: string;
      icon?: string;
    };
  };
  resource?: {
    id: string;
    title: string;
    type: string;
  };
}
