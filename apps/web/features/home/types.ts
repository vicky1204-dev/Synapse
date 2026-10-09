/**
 * Home dashboard feature — types.
 */

import type { Course } from "@/features/courses/types";
import type { RecentStudyItem } from "@/features/study/types";
import type { Resource } from "@/features/resources/types";

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  academicProfile?: {
    program?: string;
    year?: number;
    institution?: string;
  };
}

export interface DailyStudyTrend {
  date: string;
  day: string;
  minutes: number;
}

export interface HomeStudyStats {
  totalStudyTimeMinutes: number;
  totalFocusedMinutes: number;
  yesterdayStudyMinutes: number;
  completedActivitiesCount: number;
  dailyAverageMinutes: number;
  weeklyTrend: DailyStudyTrend[];
}

export interface CourseCoverageSummary {
  courseId: string;
  courseTitle: string;
  totalResources: number;
  studiedResources: number;
  totalActivities: number;
  completedActivities: number;
  coveragePercentage: number;
}

export interface HomeTaskItem {
  id: string;
  number: number;
  title: string;
  description: string;
  durationMinutes: number;
  href: string;
}

export interface HomeDashboardData {
  user: UserSummary;
  continueStudying: RecentStudyItem | null;
  currentlyStudying: Course | null;
  courseCoverage: CourseCoverageSummary | null;
  tasks: HomeTaskItem[];
  courses: Course[];
  studyStats: HomeStudyStats;
  recentResources: Resource[];
  savedResources: Resource[];
}
