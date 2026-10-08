/**
 * Study feature query key factory.
 */

export const studyKeys = {
  all: ["study"] as const,
  courseStudy: (courseId: string) => ["courses", courseId, "study"] as const,
  courseProgress: (courseId: string) =>
    ["courses", courseId, "progress"] as const,
  activity: (activityId: string) =>
    [...studyKeys.all, "activity", activityId] as const,
  recent: () => [...studyKeys.all, "recent"] as const,
};
