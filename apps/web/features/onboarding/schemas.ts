/**
 * Onboarding validation schemas (Zod).
 *
 * Single source of truth for onboarding form validation used with react-hook-form.
 */

import { z } from "zod";

export const academicProfileStepSchema = z.object({
  program: z
    .string()
    .trim()
    .min(1, "Please enter what you are studying")
    .max(100, "Program name must be 100 characters or fewer"),
  year: z.coerce
    .number()
    .int("Year must be an integer")
    .min(1, "Please select a valid academic year")
    .max(10, "Year must be 10 or fewer"),
  institution: z
    .string()
    .trim()
    .max(150, "Institution name must be 150 characters or fewer")
    .optional(),
});

export const onboardingSchema = academicProfileStepSchema.extend({
  onboardingGoals: z
    .array(z.string())
    .min(1, "Please select at least one study goal")
    .max(10, "Cannot select more than 10 goals"),
  subjectIds: z
    .array(z.string())
    .min(1, "Please select at least one subject to seed your workspace")
    .max(3, "Cannot select more than 3 subjects"),
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
