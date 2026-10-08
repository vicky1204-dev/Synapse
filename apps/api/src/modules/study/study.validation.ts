/**
 * Study validation schemas.
 */

import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const courseIdParamsSchema = z.object({
  courseId: z
    .string()
    .trim()
    .regex(objectIdRegex, "Invalid course ID format"),
});

export const activityIdParamsSchema = z.object({
  activityId: z
    .string()
    .trim()
    .regex(objectIdRegex, "Invalid activity ID format"),
});

export const startStudySessionSchema = z.object({
  courseId: z
    .string()
    .trim()
    .regex(objectIdRegex, "Invalid course ID format"),
  resourceId: z
    .string()
    .trim()
    .regex(objectIdRegex, "Invalid resource ID format")
    .optional(),
  title: z
    .string()
    .trim()
    .max(200, "Title cannot exceed 200 characters")
    .optional(),
  type: z
    .enum(["resource-study", "concept-review", "flashcard", "quiz"])
    .default("resource-study"),
});

export const heartbeatSessionSchema = z.object({
  durationIncrementSeconds: z.number().int().min(0).max(86400).optional(),
  lastPosition: z.union([z.string(), z.number()]).optional(),
  notes: z.string().max(10000, "Notes cannot exceed 10000 characters").optional(),
});

export const completeActivitySchema = z.object({
  durationIncrementSeconds: z.number().int().min(0).max(86400).optional(),
  notes: z.string().max(10000, "Notes cannot exceed 10000 characters").optional(),
});

export const queryRecentStudySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
