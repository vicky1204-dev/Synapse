/**
 * Discussion & Comment validation schemas.
 */

import { z } from "zod";
import { DISCUSSION_STATUSES, COMMENT_STATUSES } from "./discussion.types";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createDiscussionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Discussion title is required")
    .max(200, "Title cannot exceed 200 characters"),
  body: z
    .string()
    .trim()
    .min(1, "Discussion body cannot be empty")
    .max(10000, "Body cannot exceed 10000 characters"),
  courseId: z
    .string()
    .trim()
    .regex(objectIdRegex, "Invalid course ID format")
    .optional(),
  resourceId: z
    .string()
    .trim()
    .regex(objectIdRegex, "Invalid resource ID format")
    .optional(),
  tags: z
    .array(z.string().trim().min(1).max(50))
    .max(10, "Cannot specify more than 10 tags")
    .default([]),
});

export const updateDiscussionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Discussion title cannot be empty")
    .max(200, "Title cannot exceed 200 characters")
    .optional(),
  body: z
    .string()
    .trim()
    .min(1, "Discussion body cannot be empty")
    .max(10000, "Body cannot exceed 10000 characters")
    .optional(),
  tags: z
    .array(z.string().trim().min(1).max(50))
    .max(10, "Cannot specify more than 10 tags")
    .optional(),
  status: z.enum(DISCUSSION_STATUSES).optional(),
});

export const queryDiscussionsSchema = z.object({
  courseId: z
    .string()
    .trim()
    .regex(objectIdRegex, "Invalid course ID format")
    .optional(),
  resourceId: z
    .string()
    .trim()
    .regex(objectIdRegex, "Invalid resource ID format")
    .optional(),
  authorId: z
    .string()
    .trim()
    .regex(objectIdRegex, "Invalid author ID format")
    .optional(),
  tag: z.string().trim().max(50).optional(),
  search: z.string().trim().max(100).optional(),
  status: z
    .enum(["published", "hidden", "deleted", "all"])
    .default("published"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const discussionParamsSchema = z.object({
  discussionId: z
    .string()
    .trim()
    .regex(objectIdRegex, "Invalid discussion ID format"),
});

export const createCommentSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "Comment body cannot be empty")
    .max(5000, "Comment cannot exceed 5000 characters"),
  parentCommentId: z
    .string()
    .trim()
    .regex(objectIdRegex, "Invalid parent comment ID format")
    .optional(),
});

export const updateCommentSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "Comment body cannot be empty")
    .max(5000, "Comment cannot exceed 5000 characters")
    .optional(),
  status: z.enum(COMMENT_STATUSES).optional(),
});

export const queryCommentsSchema = z.object({
  parentCommentId: z
    .string()
    .trim()
    .regex(objectIdRegex, "Invalid parent comment ID format")
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const commentParamsSchema = z.object({
  commentId: z
    .string()
    .trim()
    .regex(objectIdRegex, "Invalid comment ID format"),
});
