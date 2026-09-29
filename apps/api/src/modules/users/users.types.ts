/**
 * User module types and DTOs.
 */

import type { OnboardingStatus } from "../auth/auth.types";

export interface AcademicProfileDto {
  program?: string;
  year?: number;
  institution?: string;
}

export interface UpdateOnboardingDto {
  academicProfile?: AcademicProfileDto;
  onboardingGoals?: string[];
  subjectIds?: string[];
  onboardingStatus?: OnboardingStatus;
}

export interface UpdateProfileDto {
  name?: string;
  avatarUrl?: string;
  academicProfile?: AcademicProfileDto;
  preferences?: {
    theme?: "light" | "dark" | "system";
  };
}
