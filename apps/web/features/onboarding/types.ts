/**
 * Onboarding feature types.
 */

export interface SubjectItem {
  id: string;
  name: string;
  slug: string;
  department?: string;
  active: boolean;
}

export interface AcademicProfileData {
  program: string;
  year: number;
  institution?: string;
}

export type { OnboardingFormValues } from "./schemas";
