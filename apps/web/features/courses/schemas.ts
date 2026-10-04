/**
 * Courses feature schemas.
 */

import { z } from "zod";

export const COURSE_COVER_PRESETS = [
  "#3072FF", // Brand Blue
  "#6366F1", // Indigo
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#EF4444", // Red
  "#F97316", // Orange
  "#10B981", // Emerald
  "#06B6D4", // Cyan
  "#525F8C", // Synapse Slate
] as const;

export const courseFormSchema = z.object({
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
  subjectId: z.string().trim().optional(),
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
  year: z.coerce
    .number()
    .int()
    .min(1900, "Year must be 1900 or later")
    .max(2100, "Year must be 2100 or earlier")
    .optional(),
  color: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Valid hex color required")
    .default("#3072FF"),
  status: z.enum(["active", "archived"]).default("active"),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;
