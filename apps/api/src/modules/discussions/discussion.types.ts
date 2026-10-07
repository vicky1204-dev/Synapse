/**
 * Discussion & Comment types and DTOs.
 *
 * Adheres strictly to docs/engineering/DATABASE-SCHEMA.md and API.md.
 */

import type { Document, Types } from "mongoose";

export const DISCUSSION_STATUSES = ["published", "hidden", "deleted"] as const;
export type DiscussionStatus = (typeof DISCUSSION_STATUSES)[number];

export const COMMENT_STATUSES = ["published", "hidden", "deleted"] as const;
export type CommentStatus = (typeof COMMENT_STATUSES)[number];

// ---------------------------------------------------------------------------
// Document Interfaces
// ---------------------------------------------------------------------------

export interface IDiscussion extends Document {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  courseId?: Types.ObjectId;
  resourceId?: Types.ObjectId;
  title: string;
  body: string;
  tags: string[];
  status: DiscussionStatus;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment extends Document {
  _id: Types.ObjectId;
  discussionId: Types.ObjectId;
  authorId: Types.ObjectId;
  parentCommentId?: Types.ObjectId;
  body: string;
  status: CommentStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// API Response Types
// ---------------------------------------------------------------------------

export interface DiscussionAuthorInfo {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface DiscussionContextInfo {
  course?: {
    id: string;
    title: string;
    code?: string;
  };
  resource?: {
    id: string;
    title: string;
    type: string;
  };
}

export interface DiscussionResponse {
  id: string;
  authorId: string;
  author?: DiscussionAuthorInfo;
  courseId?: string;
  resourceId?: string;
  context?: DiscussionContextInfo;
  title: string;
  body: string;
  tags: string[];
  status: DiscussionStatus;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommentResponse {
  id: string;
  discussionId: string;
  authorId: string;
  author?: DiscussionAuthorInfo;
  parentCommentId?: string;
  body: string;
  status: CommentStatus;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// DTOs
// ---------------------------------------------------------------------------

export interface CreateDiscussionDto {
  title: string;
  body: string;
  courseId?: string;
  resourceId?: string;
  tags?: string[];
}

export interface UpdateDiscussionDto {
  title?: string;
  body?: string;
  tags?: string[];
  status?: DiscussionStatus;
}

export interface QueryDiscussionsDto {
  courseId?: string;
  resourceId?: string;
  authorId?: string;
  tag?: string;
  search?: string;
  status?: DiscussionStatus | "all";
  page: number;
  limit: number;
}

export interface CreateCommentDto {
  body: string;
  parentCommentId?: string;
}

export interface UpdateCommentDto {
  body?: string;
  status?: CommentStatus;
}

export interface QueryCommentsDto {
  parentCommentId?: string;
  page: number;
  limit: number;
}
