/**
 * Study feature types.
 */

export type StudyActivityType =
  | "resource-study"
  | "concept-review"
  | "flashcard"
  | "quiz";

export type ActivityProgressStatus = "not-started" | "in-progress" | "completed";

export interface ActivityProgress {
  id: string;
  userId: string;
  activityId: string;
  courseId: string;
  resourceId?: string;
  status: ActivityProgressStatus;
  durationSeconds: number;
  lastPosition?: string | number;
  notes?: string;
  startedAt?: string;
  completedAt?: string;
  lastStudiedAt: string;
}

export interface StudyActivity {
  id: string;
  courseId: string;
  resourceId?: string;
  studyPackId?: string;
  type: StudyActivityType;
  title: string;
  description?: string;
  order: number;
  content: Record<string, unknown>;
  metadata: Record<string, unknown>;
  course?: {
    id: string;
    title: string;
    code?: string;
  };
  resource?: {
    id: string;
    title: string;
    type: string;
    url?: string;
    pageCount?: number;
  };
  progress?: ActivityProgress;
  createdAt: string;
  updatedAt: string;
}

export interface CourseStudyProgress {
  courseId: string;
  completedActivityCount: number;
  totalActivityCount: number;
  totalStudyTimeMinutes: number;
  completionPercentage: number;
  lastActivity?: {
    id: string;
    title: string;
    type: StudyActivityType;
  };
  lastStudiedAt?: string;
}

export interface CourseStudyData {
  activities: StudyActivity[];
  progress: CourseStudyProgress;
}

export interface StartStudySessionRequest {
  courseId: string;
  resourceId?: string;
  title?: string;
  type?: StudyActivityType;
}

export interface HeartbeatSessionRequest {
  durationIncrementSeconds?: number;
  lastPosition?: string | number;
  notes?: string;
}

export interface CompleteActivityRequest {
  durationIncrementSeconds?: number;
  notes?: string;
}

export interface RecentStudyItem {
  activity: StudyActivity;
  progress: ActivityProgress;
  course: {
    id: string;
    title: string;
    code?: string;
    cover?: {
      color: string;
      icon?: string;
    };
  };
  resource?: {
    id: string;
    title: string;
    type: string;
  };
}
