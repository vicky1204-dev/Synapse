/**
 * Home module types.
 */

import type { CourseResponse } from "../courses/course.types";
import type { RecentStudyItemResponse } from "../study/study.types";
import type { ResourceResponse } from "../resources/resource.types";

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

export interface HomeDashboardResponse {
  user: UserSummary;
  continueStudying: RecentStudyItemResponse | null;
  currentlyStudying: CourseResponse | null;
  courseCoverage: CourseCoverageSummary | null;
  tasks: HomeTaskItem[];
  courses: CourseResponse[];
  studyStats: HomeStudyStats;
  recentResources: ResourceResponse[];
  savedResources: ResourceResponse[];
}
