/**
 * Study service.
 *
 * Implements business logic for study activities, focus sessions, progress tracking,
 * and academic course study projections.
 */

import { Types } from "mongoose";
import { StudyActivity } from "./study-activity.model";
import { ActivityProgress } from "./activity-progress.model";
import { StudyProgress } from "./study-progress.model";
import { Course } from "../courses/course.model";
import { Resource } from "../resources/resource.model";
import { CourseResource } from "../resources/course-resource.model";
import {
  NotFoundError,
  BadRequestError,
} from "../../middleware/error-handler";
import { logger } from "../../lib/logger";
import type {
  IStudyActivity,
  IActivityProgress,
  StudyActivityResponse,
  ActivityProgressResponse,
  CourseStudyProgressResponse,
  RecentStudyItemResponse,
  StartStudySessionDto,
  HeartbeatSessionDto,
  CompleteActivityDto,
} from "./study.types";

// ---------------------------------------------------------------------------
// Response Mappers
// ---------------------------------------------------------------------------

export function mapProgressToResponse(
  doc: IActivityProgress,
): ActivityProgressResponse {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    activityId: doc.activityId.toString(),
    courseId: doc.courseId.toString(),
    resourceId: doc.resourceId ? doc.resourceId.toString() : undefined,
    status: doc.status,
    durationSeconds: doc.durationSeconds || 0,
    lastPosition: doc.lastPosition,
    notes: doc.notes,
    startedAt: doc.startedAt ? doc.startedAt.toISOString() : undefined,
    completedAt: doc.completedAt ? doc.completedAt.toISOString() : undefined,
    lastStudiedAt: doc.lastStudiedAt.toISOString(),
  };
}

export function mapActivityToResponse(
  doc: IStudyActivity & {
    courseId: Types.ObjectId | { _id: Types.ObjectId; title: string; code?: string };
    resourceId?: Types.ObjectId | {
      _id: Types.ObjectId;
      title: string;
      type: string;
      file?: { url?: string; pageCount?: number };
    };
  },
  progress?: IActivityProgress | null,
): StudyActivityResponse {
  let courseInfo: { id: string; title: string; code?: string } | undefined;
  let courseIdStr = "";

  if (doc.courseId && typeof doc.courseId === "object" && "title" in doc.courseId) {
    const popCourse = doc.courseId as {
      _id: Types.ObjectId;
      title: string;
      code?: string;
    };
    courseIdStr = popCourse._id.toString();
    courseInfo = {
      id: courseIdStr,
      title: popCourse.title,
      code: popCourse.code,
    };
  } else {
    courseIdStr = doc.courseId ? doc.courseId.toString() : "";
  }

  let resourceInfo:
    | {
        id: string;
        title: string;
        type: string;
        url?: string;
        pageCount?: number;
      }
    | undefined;
  let resourceIdStr: string | undefined;

  if (doc.resourceId) {
    if (typeof doc.resourceId === "object" && "title" in doc.resourceId) {
      const popResource = doc.resourceId as {
        _id: Types.ObjectId;
        title: string;
        type: string;
        file?: { url?: string; pageCount?: number };
      };
      resourceIdStr = popResource._id.toString();
      resourceInfo = {
        id: resourceIdStr,
        title: popResource.title,
        type: popResource.type,
        url: popResource.file?.url,
        pageCount: popResource.file?.pageCount,
      };
    } else {
      resourceIdStr = doc.resourceId.toString();
    }
  }

  return {
    id: doc._id.toString(),
    courseId: courseIdStr,
    resourceId: resourceIdStr,
    studyPackId: doc.studyPackId ? doc.studyPackId.toString() : undefined,
    type: doc.type,
    title: doc.title,
    description: doc.description,
    order: doc.order,
    content: doc.content || {},
    metadata: doc.metadata || {},
    course: courseInfo,
    resource: resourceInfo,
    progress: progress ? mapProgressToResponse(progress) : undefined,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Auto-provisioning helper
// ---------------------------------------------------------------------------

async function ensureCourseActivities(courseId: Types.ObjectId): Promise<void> {
  const existingCount = await StudyActivity.countDocuments({ courseId });
  if (existingCount > 0) return;

  // Find resources associated with this course
  const associations = await CourseResource.find({ courseId })
    .sort({ position: 1, createdAt: 1 })
    .populate("resourceId", "title type file");

  if (associations.length === 0) return;

  const activitiesToCreate = associations.map((assoc, idx) => {
    const resource = assoc.resourceId as unknown as {
      _id: Types.ObjectId;
      title: string;
      type: string;
      file?: { pageCount?: number };
    };

    return {
      courseId,
      resourceId: resource._id,
      type: "resource-study" as const,
      title: resource.title || `Resource ${idx + 1}`,
      description: `Study ${resource.type.toUpperCase()} resource material for this course.`,
      order: idx + 1,
      content: {
        resourceType: resource.type,
      },
      metadata: {
        pageCount: resource.file?.pageCount,
      },
    };
  });

  await StudyActivity.insertMany(activitiesToCreate);
}

// ---------------------------------------------------------------------------
// Service Methods
// ---------------------------------------------------------------------------

export async function getCourseStudyActivities(
  courseId: string,
  userId: string,
): Promise<{
  activities: StudyActivityResponse[];
  progress: CourseStudyProgressResponse;
}> {
  if (!Types.ObjectId.isValid(courseId)) {
    throw new BadRequestError("Invalid course ID format", "INVALID_COURSE_ID");
  }

  const courseObjectId = new Types.ObjectId(courseId);
  const userObjectId = new Types.ObjectId(userId);

  const courseExists = await Course.exists({ _id: courseObjectId });
  if (!courseExists) {
    throw new NotFoundError("Course not found", "COURSE_NOT_FOUND");
  }

  // Ensure default activities exist if course has resources
  await ensureCourseActivities(courseObjectId);

  const activities = await StudyActivity.find({ courseId: courseObjectId })
    .sort({ order: 1, createdAt: 1 })
    .populate("courseId", "title code")
    .populate("resourceId", "title type file");

  const activityIds = activities.map((a) => a._id);

  const userProgressList = await ActivityProgress.find({
    userId: userObjectId,
    activityId: { $in: activityIds },
  });

  const progressMap = new Map<string, IActivityProgress>();
  for (const prog of userProgressList) {
    progressMap.set(prog.activityId.toString(), prog);
  }

  const mappedActivities = activities.map((act) =>
    mapActivityToResponse(
      act as unknown as IStudyActivity & {
        courseId: { _id: Types.ObjectId; title: string; code?: string };
        resourceId?: {
          _id: Types.ObjectId;
          title: string;
          type: string;
          file?: { url?: string; pageCount?: number };
        };
      },
      progressMap.get(act._id.toString()),
    ),
  );

  const courseProgress = await getCourseProgress(courseId, userId);

  return {
    activities: mappedActivities,
    progress: courseProgress,
  };
}

export async function getCourseProgress(
  courseId: string,
  userId: string,
): Promise<CourseStudyProgressResponse> {
  if (!Types.ObjectId.isValid(courseId)) {
    throw new BadRequestError("Invalid course ID format", "INVALID_COURSE_ID");
  }

  const courseObjectId = new Types.ObjectId(courseId);
  const userObjectId = new Types.ObjectId(userId);

  const totalActivities = await StudyActivity.countDocuments({
    courseId: courseObjectId,
  });

  const completedCount = await ActivityProgress.countDocuments({
    userId: userObjectId,
    courseId: courseObjectId,
    status: "completed",
  });

  // Calculate sum of duration
  const durationAggregate = await ActivityProgress.aggregate([
    {
      $match: {
        userId: userObjectId,
        courseId: courseObjectId,
      },
    },
    {
      $group: {
        _id: null,
        totalSeconds: { $sum: "$durationSeconds" },
      },
    },
  ]);

  const totalSeconds = durationAggregate[0]?.totalSeconds || 0;
  const totalMinutes = Math.round(totalSeconds / 60);

  const completionPercentage =
    totalActivities > 0
      ? Math.min(100, Math.round((completedCount / totalActivities) * 100))
      : 0;

  // Upsert StudyProgress projection
  const studyProgress = await StudyProgress.findOneAndUpdate(
    { userId: userObjectId, courseId: courseObjectId },
    {
      $set: {
        completedActivityCount: completedCount,
        totalActivityCount: totalActivities,
        totalStudyTimeMinutes: totalMinutes,
      },
    },
    { new: true, upsert: true },
  ).populate("lastActivityId", "title type");

  // Keep Course document progress updated
  await Course.findByIdAndUpdate(courseObjectId, {
    progress: completionPercentage,
  });

  let lastActivity:
    | { id: string; title: string; type: "resource-study" | "concept-review" | "flashcard" | "quiz" }
    | undefined;

  if (studyProgress.lastActivityId) {
    const act = studyProgress.lastActivityId as unknown as {
      _id: Types.ObjectId;
      title: string;
      type: "resource-study" | "concept-review" | "flashcard" | "quiz";
    };
    lastActivity = {
      id: act._id.toString(),
      title: act.title,
      type: act.type,
    };
  }

  return {
    courseId,
    completedActivityCount: completedCount,
    totalActivityCount: totalActivities,
    totalStudyTimeMinutes: totalMinutes,
    completionPercentage,
    lastActivity,
    lastStudiedAt: studyProgress.lastStudiedAt
      ? studyProgress.lastStudiedAt.toISOString()
      : undefined,
  };
}

export async function startOrGetSession(
  userId: string,
  dto: StartStudySessionDto,
): Promise<{
  activity: StudyActivityResponse;
  progress: ActivityProgressResponse;
}> {
  if (!Types.ObjectId.isValid(dto.courseId)) {
    throw new BadRequestError("Invalid course ID format", "INVALID_COURSE_ID");
  }

  const courseObjectId = new Types.ObjectId(dto.courseId);
  const userObjectId = new Types.ObjectId(userId);

  const course = await Course.findById(courseObjectId);
  if (!course) {
    throw new NotFoundError("Course not found", "COURSE_NOT_FOUND");
  }

  let resourceObjectId: Types.ObjectId | undefined;
  let resourceDoc: (typeof Resource)["prototype"] | null = null;

  if (dto.resourceId) {
    if (!Types.ObjectId.isValid(dto.resourceId)) {
      throw new BadRequestError("Invalid resource ID format", "INVALID_RESOURCE_ID");
    }
    resourceObjectId = new Types.ObjectId(dto.resourceId);
    resourceDoc = await Resource.findById(resourceObjectId);
    if (!resourceDoc) {
      throw new NotFoundError("Resource not found", "RESOURCE_NOT_FOUND");
    }
  }

  // Find or create activity
  let activity: IStudyActivity | null = null;

  if (resourceObjectId) {
    activity = await StudyActivity.findOne({
      courseId: courseObjectId,
      resourceId: resourceObjectId,
    });
  }

  if (!activity) {
    const orderCount = await StudyActivity.countDocuments({
      courseId: courseObjectId,
    });

    const activityTitle =
      dto.title ||
      resourceDoc?.title ||
      `Study ${course.title}`;

    activity = await StudyActivity.create({
      userId: userObjectId,
      courseId: courseObjectId,
      resourceId: resourceObjectId,
      type: dto.type || "resource-study",
      title: activityTitle,
      order: orderCount + 1,
      content: {
        resourceType: resourceDoc?.type,
      },
      metadata: {
        pageCount: resourceDoc?.file?.pageCount,
      },
    });
  }

  // Upsert ActivityProgress
  let progress = await ActivityProgress.findOne({
    userId: userObjectId,
    activityId: activity._id,
  });

  const now = new Date();

  if (!progress) {
    progress = await ActivityProgress.create({
      userId: userObjectId,
      activityId: activity._id,
      courseId: courseObjectId,
      resourceId: resourceObjectId,
      status: "in-progress",
      durationSeconds: 0,
      startedAt: now,
      lastStudiedAt: now,
    });
  } else {
    if (progress.status === "not-started") {
      progress.status = "in-progress";
      progress.startedAt = progress.startedAt || now;
    }
    progress.lastStudiedAt = now;
    await progress.save();
  }

  // Update StudyProgress projection
  await StudyProgress.findOneAndUpdate(
    { userId: userObjectId, courseId: courseObjectId },
    {
      $set: {
        lastActivityId: activity._id,
        lastStudiedAt: now,
      },
    },
    { upsert: true },
  );

  await activity.populate("courseId", "title code");
  if (activity.resourceId) {
    await activity.populate("resourceId", "title type file");
  }

  logger.info({
    message: "Study session started",
    userId,
    courseId: dto.courseId,
    activityId: activity._id.toString(),
  });

  return {
    activity: mapActivityToResponse(
      activity as unknown as IStudyActivity & {
        courseId: { _id: Types.ObjectId; title: string; code?: string };
        resourceId?: {
          _id: Types.ObjectId;
          title: string;
          type: string;
          file?: { url?: string; pageCount?: number };
        };
      },
      progress,
    ),
    progress: mapProgressToResponse(progress),
  };
}

export async function getActivityById(
  activityId: string,
  userId: string,
): Promise<StudyActivityResponse> {
  if (!Types.ObjectId.isValid(activityId)) {
    throw new BadRequestError("Invalid activity ID format", "INVALID_ACTIVITY_ID");
  }

  const activity = await StudyActivity.findById(activityId)
    .populate("courseId", "title code")
    .populate("resourceId", "title type file");

  if (!activity) {
    throw new NotFoundError("Study activity not found", "ACTIVITY_NOT_FOUND");
  }

  const progress = await ActivityProgress.findOne({
    userId: new Types.ObjectId(userId),
    activityId: activity._id,
  });

  return mapActivityToResponse(
    activity as unknown as IStudyActivity & {
      courseId: { _id: Types.ObjectId; title: string; code?: string };
      resourceId?: {
        _id: Types.ObjectId;
        title: string;
        type: string;
        file?: { url?: string; pageCount?: number };
      };
    },
    progress,
  );
}

export async function startActivity(
  activityId: string,
  userId: string,
): Promise<ActivityProgressResponse> {
  if (!Types.ObjectId.isValid(activityId)) {
    throw new BadRequestError("Invalid activity ID format", "INVALID_ACTIVITY_ID");
  }

  const activity = await StudyActivity.findById(activityId);
  if (!activity) {
    throw new NotFoundError("Study activity not found", "ACTIVITY_NOT_FOUND");
  }

  const userObjectId = new Types.ObjectId(userId);
  const now = new Date();

  let progress = await ActivityProgress.findOne({
    userId: userObjectId,
    activityId: activity._id,
  });

  if (!progress) {
    progress = await ActivityProgress.create({
      userId: userObjectId,
      activityId: activity._id,
      courseId: activity.courseId,
      resourceId: activity.resourceId,
      status: "in-progress",
      startedAt: now,
      lastStudiedAt: now,
      durationSeconds: 0,
    });
  } else {
    if (progress.status === "not-started") {
      progress.status = "in-progress";
      progress.startedAt = progress.startedAt || now;
    }
    progress.lastStudiedAt = now;
    await progress.save();
  }

  await StudyProgress.findOneAndUpdate(
    { userId: userObjectId, courseId: activity.courseId },
    {
      $set: {
        lastActivityId: activity._id,
        lastStudiedAt: now,
      },
    },
    { upsert: true },
  );

  return mapProgressToResponse(progress);
}

export async function heartbeatActivity(
  activityId: string,
  userId: string,
  dto: HeartbeatSessionDto,
): Promise<ActivityProgressResponse> {
  if (!Types.ObjectId.isValid(activityId)) {
    throw new BadRequestError("Invalid activity ID format", "INVALID_ACTIVITY_ID");
  }

  const activity = await StudyActivity.findById(activityId);
  if (!activity) {
    throw new NotFoundError("Study activity not found", "ACTIVITY_NOT_FOUND");
  }

  const userObjectId = new Types.ObjectId(userId);
  const now = new Date();

  let progress = await ActivityProgress.findOne({
    userId: userObjectId,
    activityId: activity._id,
  });

  if (!progress) {
    progress = await ActivityProgress.create({
      userId: userObjectId,
      activityId: activity._id,
      courseId: activity.courseId,
      resourceId: activity.resourceId,
      status: "in-progress",
      startedAt: now,
      lastStudiedAt: now,
      durationSeconds: dto.durationIncrementSeconds || 0,
      lastPosition: dto.lastPosition,
      notes: dto.notes,
    });
  } else {
    if (dto.durationIncrementSeconds && dto.durationIncrementSeconds > 0) {
      progress.durationSeconds += dto.durationIncrementSeconds;
    }
    if (dto.lastPosition !== undefined) {
      progress.lastPosition = dto.lastPosition;
    }
    if (dto.notes !== undefined) {
      progress.notes = dto.notes;
    }
    progress.lastStudiedAt = now;
    await progress.save();
  }

  // Update study progress projection
  await StudyProgress.findOneAndUpdate(
    { userId: userObjectId, courseId: activity.courseId },
    {
      $set: {
        lastActivityId: activity._id,
        lastStudiedAt: now,
      },
      $inc: {
        totalStudyTimeMinutes: Math.round((dto.durationIncrementSeconds || 0) / 60),
      },
    },
    { upsert: true },
  );

  return mapProgressToResponse(progress);
}

export async function completeActivity(
  activityId: string,
  userId: string,
  dto: CompleteActivityDto,
): Promise<ActivityProgressResponse> {
  if (!Types.ObjectId.isValid(activityId)) {
    throw new BadRequestError("Invalid activity ID format", "INVALID_ACTIVITY_ID");
  }

  const activity = await StudyActivity.findById(activityId);
  if (!activity) {
    throw new NotFoundError("Study activity not found", "ACTIVITY_NOT_FOUND");
  }

  const userObjectId = new Types.ObjectId(userId);
  const now = new Date();

  let progress = await ActivityProgress.findOne({
    userId: userObjectId,
    activityId: activity._id,
  });

  if (!progress) {
    progress = await ActivityProgress.create({
      userId: userObjectId,
      activityId: activity._id,
      courseId: activity.courseId,
      resourceId: activity.resourceId,
      status: "completed",
      startedAt: now,
      completedAt: now,
      lastStudiedAt: now,
      durationSeconds: dto.durationIncrementSeconds || 0,
      notes: dto.notes,
    });
  } else {
    progress.status = "completed";
    progress.completedAt = now;
    progress.lastStudiedAt = now;
    if (dto.durationIncrementSeconds && dto.durationIncrementSeconds > 0) {
      progress.durationSeconds += dto.durationIncrementSeconds;
    }
    if (dto.notes !== undefined) {
      progress.notes = dto.notes;
    }
    await progress.save();
  }

  // Recalculate and update course progress
  await getCourseProgress(activity.courseId.toString(), userId);

  logger.info({
    message: "Study activity completed",
    userId,
    activityId,
    courseId: activity.courseId.toString(),
  });

  return mapProgressToResponse(progress);
}

export async function getRecentStudy(
  userId: string,
  limit = 10,
): Promise<RecentStudyItemResponse[]> {
  const userObjectId = new Types.ObjectId(userId);

  const progressRecords = await ActivityProgress.find({
    userId: userObjectId,
    status: { $in: ["in-progress", "completed"] },
  })
    .sort({ lastStudiedAt: -1 })
    .limit(limit)
    .populate({
      path: "activityId",
      populate: [
        { path: "courseId", select: "title code cover" },
        { path: "resourceId", select: "title type file" },
      ],
    })
    .populate("courseId", "title code cover")
    .populate("resourceId", "title type");

  const results: RecentStudyItemResponse[] = [];

  for (const prog of progressRecords) {
    if (!prog.activityId) continue;

    const activity = prog.activityId as unknown as IStudyActivity & {
      courseId: { _id: Types.ObjectId; title: string; code?: string; cover?: { color: string; icon?: string } };
      resourceId?: { _id: Types.ObjectId; title: string; type: string; file?: { url?: string; pageCount?: number } };
    };

    const course = (prog.courseId as unknown as {
      _id: Types.ObjectId;
      title: string;
      code?: string;
      cover?: { color: string; icon?: string };
    }) || activity.courseId;

    const resource = (prog.resourceId as unknown as {
      _id: Types.ObjectId;
      title: string;
      type: string;
    }) || activity.resourceId;

    results.push({
      activity: mapActivityToResponse(activity, prog),
      progress: mapProgressToResponse(prog),
      course: {
        id: course._id ? course._id.toString() : "",
        title: course.title || "Course",
        code: course.code,
        cover: course.cover,
      },
      resource: resource
        ? {
            id: resource._id ? resource._id.toString() : "",
            title: resource.title,
            type: resource.type,
          }
        : undefined,
    });
  }

  return results;
}
