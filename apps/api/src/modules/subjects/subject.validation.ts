/**
 * Subject validation schemas.
 */

import { z } from "zod";

export const createSubjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Subject name must be at least 2 characters")
    .max(100, "Subject name cannot exceed 100 characters"),
  department: z
    .string()
    .trim()
    .max(100, "Department cannot exceed 100 characters")
    .optional(),
});

export const getSubjectsQuerySchema = z.object({
  department: z.string().trim().optional(),
  search: z.string().trim().optional(),
  active: z
    .enum(["true", "false"])
    .optional()
    .transform((val) => (val === undefined ? undefined : val === "true")),
});
