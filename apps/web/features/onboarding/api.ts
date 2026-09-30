/**
 * Onboarding feature — API client calls.
 */

import { apiClient } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/lib/api/types";
import type { User } from "@/features/auth/types";
import type { SubjectItem, OnboardingFormValues } from "./types";

export async function fetchSubjects(query?: {
  search?: string;
  department?: string;
}): Promise<SubjectItem[]> {
  const searchParams: Record<string, string> = {};
  if (query?.search) searchParams.search = query.search;
  if (query?.department) searchParams.department = query.department;

  const res = await apiClient
    .get("api/v1/subjects", { searchParams })
    .json<ApiSuccessResponse<SubjectItem[]>>();
  return res.data;
}

export async function createSubject(
  name: string,
  department?: string,
): Promise<SubjectItem> {
  const res = await apiClient
    .post("api/v1/subjects", { json: { name, department } })
    .json<ApiSuccessResponse<SubjectItem>>();
  return res.data;
}

export async function updateOnboardingData(
  payload: Partial<OnboardingFormValues> & {
    onboardingStatus?: "pending" | "completed";
  },
): Promise<User> {
  const res = await apiClient
    .patch("api/v1/users/me/onboarding", {
      json: {
        academicProfile: {
          program: payload.program || undefined,
          year: payload.year ? Number(payload.year) : undefined,
          institution: payload.institution || undefined,
        },
        onboardingGoals: payload.onboardingGoals,
        subjectIds: payload.subjectIds,
        onboardingStatus: payload.onboardingStatus,
      },
    })
    .json<ApiSuccessResponse<{ user: User }>>();
  return res.data.user;
}
