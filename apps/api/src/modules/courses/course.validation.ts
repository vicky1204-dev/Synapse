/**
 * Course validation schemas.
 */

import { z } from "zod";
import { COURSE_STATUSES, COURSE_SOURCES } from "./course.types";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const courseCoverSchema = z.object({
  color: z
    .string()
    .trim()
    .regex(
      /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
      "Color must be a valid hex code (e.g. #3072FF)",
    )
    .default("#3072FF"),
  icon: z.string().trim().max(50).optional(),
});

export const createCourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Course title is required")
    .max(150, "Course title cannot exceed 150 characters"),
  description: z
    .string()
    .trim()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),
  subjectId: z
    .string()
    .trim()
    .regex(objectIdRegex, "Invalid subject ID format")
    .optional(),
  code: z
    .string()
    .trim()
    .max(20, "Course code cannot exceed 20 characters")
    .optional(),
  department: z
    .string()
    .trim()
    .max(100, "Department cannot exceed 100 characters")
    .optional(),
  semester: z
    .string()
    .trim()
    .max(50, "Semester cannot exceed 50 characters")
    .optional(),
  year: z
    .number()
    .int()
    .min(1900, "Year must be 1900 or later")
    .max(2100, "Year must be 2100 or earlier")
    .optional(),
  cover: courseCoverSchema.optional(),
  source: z.enum(COURSE_SOURCES).default("user"),
  status: z.enum(COURSE_STATUSES).default("active"),
});

export const updateCourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Course title cannot be empty")
    .max(150, "Course title cannot exceed 150 characters")
    .optional(),
  description: z
    .string()
    .trim()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),
  subjectId: z
    .union([
      z.string().trim().regex(objectIdRegex, "Invalid subject ID format"),
      z.null(),
    ])
    .optional(),
  code: z
    .string()
    .trim()
    .max(20, "Course code cannot exceed 20 characters")
    .optional(),
  department: z
    .string()
    .trim()
    .max(100, "Department cannot exceed 100 characters")
    .optional(),
  semester: z
    .string()
    .trim()
    .max(50, "Semester cannot exceed 50 characters")
    .optional(),
  year: z
    .number()
    .int()
    .min(1900, "Year must be 1900 or later")
    .max(2100, "Year must be 2100 or earlier")
    .optional(),
  cover: courseCoverSchema.partial().optional(),
  status: z.enum(COURSE_STATUSES).optional(),
});

export const queryCoursesSchema = z.object({
  status: z.enum(["active", "archived", "all"]).default("active"),
  subjectId: z
    .string()
    .trim()
    .regex(objectIdRegex, "Invalid subject ID format")
    .optional(),
  search: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const courseParamsSchema = z.object({
  courseId: z
    .string()
    .trim()
    .regex(objectIdRegex, "Invalid course ID format"),
});

export const courseResourcesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
