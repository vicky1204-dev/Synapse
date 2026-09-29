/**
 * User validation schemas.
 */

import { z } from "zod";
import { ONBOARDING_STATUS } from "../auth/auth.types";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const academicProfileSchema = z.object({
  program: z
    .string()
    .trim()
    .min(1, "Program cannot be empty")
    .max(100, "Program name is too long")
    .optional(),
  year: z
    .number()
    .int("Year must be an integer")
    .min(1, "Year must be at least 1")
    .max(10, "Year must be at most 10")
    .optional(),
  institution: z
    .string()
    .trim()
    .max(150, "Institution name is too long")
    .optional(),
});

export const updateOnboardingSchema = z.object({
  academicProfile: academicProfileSchema.optional(),
  onboardingGoals: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Goal cannot be empty")
        .max(100, "Goal is too long"),
    )
    .max(10, "Cannot specify more than 10 goals")
    .optional(),
  subjectIds: z
    .array(z.string().regex(objectIdRegex, "Invalid subject ID format"))
    .max(10, "Cannot select more than 10 subjects")
    .optional(),
  onboardingStatus: z.enum(ONBOARDING_STATUS).optional(),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name cannot be empty")
    .max(100, "Name cannot exceed 100 characters")
    .optional(),
  avatarUrl: z
    .string()
    .trim()
    .url("Invalid avatar URL")
    .optional()
    .or(z.literal("")),
  academicProfile: academicProfileSchema.optional(),
  preferences: z
    .object({
      theme: z.enum(["light", "dark", "system"]).optional(),
    })
    .optional(),
});
