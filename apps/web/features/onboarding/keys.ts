/**
 * Onboarding query keys.
 *
 * Query key factory for the onboarding feature.
 */

export const onboardingKeys = {
  all: ["onboarding"] as const,
  subjects: (search?: string) =>
    [...onboardingKeys.all, "subjects", search ?? ""] as const,
};
