/**
 * Profile form validation schema.
 */

import { z } from "zod";

export const profileFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  avatarUrl: z
    .string()
    .trim()
    .url("Please enter a valid image URL")
    .optional()
    .or(z.literal("")),
  academicProfile: z.object({
    program: z
      .string()
      .trim()
      .max(100, "Program name is too long")
      .optional()
      .or(z.literal("")),
    year: z
      .union([
        z.coerce
          .number()
          .int("Year must be an integer")
          .min(1, "Year must be at least 1")
          .max(10, "Year must be at most 10"),
        z.literal(""),
      ])
      .optional(),
    institution: z
      .string()
      .trim()
      .max(150, "Institution name is too long")
      .optional()
      .or(z.literal("")),
  }),
  onboardingGoals: z.array(z.string()),
  subjectIds: z.array(z.string()),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
