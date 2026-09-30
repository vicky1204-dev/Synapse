/**
 * Profile feature types.
 */

import type { User, AcademicProfile } from "@/features/auth/types";
export type { ProfileFormValues } from "./schemas";
export type { User, AcademicProfile };

export interface UpdateProfileRequest {
  name?: string;
  avatarUrl?: string;
  academicProfile?: {
    program?: string;
    year?: number;
    institution?: string;
  };
  onboardingGoals?: string[];
  subjectIds?: string[];
}
