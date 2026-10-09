/**
 * User module types and DTOs.
 */

import type { OnboardingStatus } from "../auth/auth.types";
import type { ResourceResponse } from "../resources/resource.types";
import type { DiscussionResponse } from "../discussions/discussion.types";

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
  onboardingGoals?: string[];
  subjectIds?: string[];
  preferences?: {
    theme?: "light" | "dark" | "system";
  };
}

export interface UserContributionsSummary {
  uploadedResourcesCount: number;
  createdDiscussionsCount: number;
  totalCommentsCount: number;
  totalSavesReceived: number;
}

export interface UserContributionsResponse {
  summary: UserContributionsSummary;
  uploadedResources: ResourceResponse[];
  createdDiscussions: DiscussionResponse[];
}
