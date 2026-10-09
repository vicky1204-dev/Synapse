/**
 * Home dashboard service.
 *
 * Aggregates personalized learning workspace data for the authenticated student.
 */

import { Types } from "mongoose";
import { User } from "../users/user.model";
import { Course } from "../courses/course.model";
import { mapCourseToResponse } from "../courses/course.service";
import { CourseResource } from "../resources/course-resource.model";
import { Resource } from "../resources/resource.model";
import { SavedResource } from "../resources/saved-resource.model";
import { mapResourceToResponse } from "../resources/resource.service";
import { getRecentStudy } from "../study/study.service";
import { ActivityProgress } from "../study/activity-progress.model";
import { StudyActivity } from "../study/study-activity.model";
import { NotFoundError } from "../../middleware/error-handler";
import type { IResource } from "../resources/resource.types";
import type {
  HomeDashboardResponse,
  DailyStudyTrend,
  CourseCoverageSummary,
  HomeTaskItem,
} from "./home.types";

export async function getHomeDashboard(
  userId: string,
): Promise<HomeDashboardResponse> {
  const userObjectId = new Types.ObjectId(userId);

  // 1. Fetch user profile
  const userDoc = await User.findById(userObjectId);
  if (!userDoc) {
    throw new NotFoundError("User not found", "USER_NOT_FOUND");
  }

  // 2. Fetch active courses with resources count
  const courseDocs = await Course.find({
    ownerId: userObjectId,
    status: "active",
  })
    .sort({ updatedAt: -1 })
    .limit(8)
    .populate("subjectId", "name slug department");

  const courseIds = courseDocs.map((c) => c._id);

  // Count resources for each course
  const resourceCountsAgg = await CourseResource.aggregate([
    { $match: { courseId: { $in: courseIds } } },
    { $group: { _id: "$courseId", count: { $sum: 1 } } },
  ]);

  const resourceCountMap = new Map<string, number>();
  for (const item of resourceCountsAgg) {
    resourceCountMap.set(item._id.toString(), item.count);
  }

  const courses = courseDocs.map((doc) =>
    mapCourseToResponse(doc, resourceCountMap.get(doc._id.toString()) || 0),
  );

  // 3. Fetch recent study sessions
  const recentStudyItems = await getRecentStudy(userId, 5);
  const continueStudying = recentStudyItems[0] || null;

  // Determine currently studying course:
  // Prefer the course from the latest study activity, otherwise first active course
  let currentlyStudying = null;
  if (continueStudying?.course?.id) {
    const matched = courses.find((c) => c.id === continueStudying.course.id);
    if (matched) {
      currentlyStudying = matched;
    }
  }
  if (!currentlyStudying && courses.length > 0) {
    currentlyStudying = courses[0];
  }

  // 4. Calculate real course coverage for currently studying course
  let courseCoverage: CourseCoverageSummary | null = null;
  if (currentlyStudying?.id) {
    const targetCourseObjectId = new Types.ObjectId(currentlyStudying.id);

    const [totalCourseActivities, completedCourseActivities, totalCourseResources, studiedDistinctResources] =
      await Promise.all([
        StudyActivity.countDocuments({ courseId: targetCourseObjectId }),
        ActivityProgress.countDocuments({
          userId: userObjectId,
          courseId: targetCourseObjectId,
          status: "completed",
        }),
        CourseResource.countDocuments({ courseId: targetCourseObjectId }),
        ActivityProgress.distinct("resourceId", {
          userId: userObjectId,
          courseId: targetCourseObjectId,
          resourceId: { $ne: null },
        }),
      ]);

    const studiedCount = studiedDistinctResources.length;
    let coveragePercent = 0;
    if (totalCourseActivities > 0) {
      coveragePercent = Math.min(100, Math.round((completedCourseActivities / totalCourseActivities) * 100));
    } else if (totalCourseResources > 0) {
      coveragePercent = Math.min(100, Math.round((studiedCount / totalCourseResources) * 100));
    }

    courseCoverage = {
      courseId: currentlyStudying.id,
      courseTitle: currentlyStudying.title,
      totalResources: totalCourseResources,
      studiedResources: studiedCount,
      totalActivities: totalCourseActivities,
      completedActivities: completedCourseActivities,
      coveragePercentage: coveragePercent,
    };
  }

  // 5. Build real next study tasks
  const tasks: HomeTaskItem[] = [];

  // Map real recent activities first
  for (let i = 0; i < recentStudyItems.length && tasks.length < 3; i++) {
    const item = recentStudyItems[i];
    const durationMinutes = Math.max(10, Math.round((item.progress.durationSeconds || 0) / 60)) || 25;
    tasks.push({
      id: `task-rec-${item.activity.id}`,
      number: tasks.length + 1,
      title: item.activity.title || item.resource?.title || "Study Session",
      description: `Resume session in ${item.course.title}${item.resource?.title ? ` • ${item.resource.title}` : ""}`,
      durationMinutes,
      href: `/study/${item.activity.id}`,
    });
  }

  // If fewer than 3 tasks, pull available activities from enrolled courses
  if (tasks.length < 3 && courseIds.length > 0) {
    const existingActivityIds = recentStudyItems.map((r) => new Types.ObjectId(r.activity.id));
    const pendingActivities = await StudyActivity.find({
      courseId: { $in: courseIds },
      _id: { $nin: existingActivityIds },
    })
      .limit(3 - tasks.length)
      .populate("courseId", "title");

    for (const act of pendingActivities) {
      const courseTitle = (act.courseId as unknown as { title: string })?.title || "Course";
      tasks.push({
        id: `task-act-${act._id.toString()}`,
        number: tasks.length + 1,
        title: act.title,
        description: `Review topic in ${courseTitle}`,
        durationMinutes: 20,
        href: `/study/${act._id.toString()}`,
      });
    }
  }

  // If still fewer than 3, suggest active courses to study
  if (tasks.length < 3) {
    for (const c of courses) {
      if (tasks.length >= 3) break;
      tasks.push({
        id: `task-course-${c.id}`,
        number: tasks.length + 1,
        title: `Study ${c.title}`,
        description: "Review syllabus notes and study packs",
        durationMinutes: 30,
        href: `/courses/${c.id}`,
      });
    }
  }

  // 6. Study Statistics & 7-Day Weekly Trend
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const yesterdayStart = new Date(today);
  yesterdayStart.setDate(today.getDate() - 1);
  yesterdayStart.setHours(0, 0, 0, 0);

  const yesterdayEnd = new Date(today);
  yesterdayEnd.setDate(today.getDate() - 1);
  yesterdayEnd.setHours(23, 59, 59, 999);

  const [totalStatsAgg, yesterdayStatsAgg, weeklyTrendAgg] = await Promise.all([
    ActivityProgress.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: null,
          totalSeconds: { $sum: "$durationSeconds" },
          focusedSeconds: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$durationSeconds", 0] },
          },
          completedCount: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
        },
      },
    ]),
    ActivityProgress.aggregate([
      {
        $match: {
          userId: userObjectId,
          lastStudiedAt: { $gte: yesterdayStart, $lte: yesterdayEnd },
        },
      },
      {
        $group: {
          _id: null,
          totalSeconds: { $sum: "$durationSeconds" },
        },
      },
    ]),
    ActivityProgress.aggregate([
      {
        $match: {
          userId: userObjectId,
          lastStudiedAt: { $gte: sevenDaysAgo, $lte: today },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$lastStudiedAt" },
          },
          totalSeconds: { $sum: "$durationSeconds" },
        },
      },
    ]),
  ]);

  const totalStudyTimeMinutes = Math.round(
    (totalStatsAgg[0]?.totalSeconds || 0) / 60,
  );
  const totalFocusedMinutes = Math.round(
    (totalStatsAgg[0]?.focusedSeconds || totalStatsAgg[0]?.totalSeconds || 0) / 60,
  );
  const yesterdayStudyMinutes = Math.round(
    (yesterdayStatsAgg[0]?.totalSeconds || 0) / 60,
  );
  const completedActivitiesCount = totalStatsAgg[0]?.completedCount || 0;

  const weeklyTrendMap = new Map<string, number>();
  for (const item of weeklyTrendAgg) {
    weeklyTrendMap.set(item._id, Math.round(item.totalSeconds / 60));
  }

  const daysAbbr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyTrend: DailyStudyTrend[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateKey = d.toISOString().split("T")[0];
    const dayName = daysAbbr[d.getDay()];
    const minutes = weeklyTrendMap.get(dateKey) || 0;
    weeklyTrend.push({ date: dateKey, day: dayName, minutes });
  }

  const totalWeeklyMinutes = weeklyTrend.reduce((acc, cur) => acc + cur.minutes, 0);
  const dailyAverageMinutes = Math.round(totalWeeklyMinutes / 7);

  // 7. Recent community resources
  const recentResourceDocs = await Resource.find({ status: "active" })
    .sort({ createdAt: -1 })
    .limit(6)
    .populate("uploaderId", "name avatarUrl");

  const recentResources = recentResourceDocs.map((r) =>
    mapResourceToResponse(
      r as unknown as IResource & { uploaderId: Types.ObjectId },
      { isSaved: false },
    ),
  );

  // 8. Saved resources for the user
  const savedDocs = await SavedResource.find({ userId: userObjectId })
    .sort({ createdAt: -1 })
    .limit(4)
    .populate({
      path: "resourceId",
      populate: { path: "uploaderId", select: "name avatarUrl" },
    });

  const savedResources = savedDocs
    .filter((s) => Boolean(s.resourceId))
    .map((s) =>
      mapResourceToResponse(
        s.resourceId as unknown as IResource & { uploaderId: Types.ObjectId },
        { isSaved: true },
      ),
    );

  return {
    user: {
      id: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      avatarUrl: userDoc.avatarUrl,
      academicProfile: userDoc.academicProfile,
    },
    continueStudying,
    currentlyStudying,
    courseCoverage,
    tasks,
    courses,
    studyStats: {
      totalStudyTimeMinutes,
      totalFocusedMinutes,
      yesterdayStudyMinutes,
      completedActivitiesCount,
      dailyAverageMinutes,
      weeklyTrend,
    },
    recentResources,
    savedResources,
  };
}
