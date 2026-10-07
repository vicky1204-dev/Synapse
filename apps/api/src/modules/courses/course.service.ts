/**
 * Course service.
 *
 * Business logic for personal course workspaces and academic relationships.
 */

import { Types } from "mongoose";
import { Course, type ICourse } from "./course.model";
import { Subject } from "../subjects/subject.model";
import { CourseResource } from "../resources/course-resource.model";
import { type IResource } from "../resources/resource.types";
import { mapResourceToResponse } from "../resources/resource.service";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../../middleware/error-handler";
import { logger } from "../../lib/logger";
import type { Pagination } from "../../utils/response";
import type {
  CourseResponse,
  CreateCourseDto,
  UpdateCourseDto,
  QueryCoursesDto,
  CourseResourceItemResponse,
} from "./course.types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function mapCourseToResponse(
  doc: ICourse,
  resourcesCount = 0,
): CourseResponse {
  let subjectInfo:
    | { id: string; name: string; slug: string; department?: string }
    | undefined;

  if (doc.subjectId && typeof doc.subjectId === "object" && "name" in doc.subjectId) {
    const popSubject = doc.subjectId as unknown as {
      _id: Types.ObjectId;
      name: string;
      slug: string;
      department?: string;
    };
    subjectInfo = {
      id: popSubject._id.toString(),
      name: popSubject.name,
      slug: popSubject.slug,
      department: popSubject.department,
    };
  }

  const subjectIdStr = doc.subjectId
    ? doc.subjectId instanceof Types.ObjectId
      ? doc.subjectId.toString()
      : ((doc.subjectId as unknown as { _id?: Types.ObjectId })._id?.toString() ??
        String(doc.subjectId))
    : undefined;

  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    ownerId: doc.ownerId.toString(),
    subjectId: subjectIdStr,
    subject: subjectInfo,
    code: doc.code,
    department: doc.department,
    semester: doc.semester,
    year: doc.year,
    cover: {
      color: doc.cover?.color || "#3072FF",
      icon: doc.cover?.icon,
    },
    deadline: doc.deadline ? doc.deadline.toISOString() : undefined,
    progress:
      doc.progress !== undefined && doc.progress !== null
        ? doc.progress
        : resourcesCount > 0
          ? Math.min(100, resourcesCount * 20)
          : 0,
    studyPacksCount: Math.max(0, Math.ceil(resourcesCount / 3)),
    source: doc.source,
    status: doc.status,
    resourcesCount,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export async function getCourses(
  ownerId: string,
  query: QueryCoursesDto,
): Promise<{ data: CourseResponse[]; pagination: Pagination }> {
  const filter: Record<string, unknown> = {
    ownerId: new Types.ObjectId(ownerId),
  };

  if (query.status && query.status !== "all") {
    filter.status = query.status;
  }

  if (query.subjectId) {
    filter.subjectId = new Types.ObjectId(query.subjectId);
  }

  if (query.search) {
    const term = query.search.trim();
    filter.$or = [
      { title: { $regex: term, $options: "i" } },
      { code: { $regex: term, $options: "i" } },
      { department: { $regex: term, $options: "i" } },
    ];
  }

  const total = await Course.countDocuments(filter);
  const skip = (query.page - 1) * query.limit;

  const courses = await Course.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(query.limit)
    .populate("subjectId", "name slug department");

  // Aggregate resource counts for the returned courses in a single query
  const courseIds = courses.map((c) => c._id);
  const countAggregations = await CourseResource.aggregate<{
    _id: Types.ObjectId;
    count: number;
  }>([
    { $match: { courseId: { $in: courseIds } } },
    { $group: { _id: "$courseId", count: { $sum: 1 } } },
  ]);

  const countMap = new Map<string, number>();
  for (const item of countAggregations) {
    countMap.set(item._id.toString(), item.count);
  }

  const data = courses.map((course) =>
    mapCourseToResponse(course, countMap.get(course._id.toString()) ?? 0),
  );

  return {
    data,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      hasNextPage: skip + courses.length < total,
    },
  };
}

export async function getCourseById(
  courseId: string,
  ownerId: string,
): Promise<CourseResponse> {
  if (!Types.ObjectId.isValid(courseId)) {
    throw new BadRequestError("Invalid course ID format", "INVALID_COURSE_ID");
  }

  const course = await Course.findById(courseId).populate(
    "subjectId",
    "name slug department",
  );

  if (!course) {
    throw new NotFoundError("Course not found", "COURSE_NOT_FOUND");
  }

  if (course.ownerId.toString() !== ownerId) {
    throw new ForbiddenError(
      "You do not have permission to view this course",
      "FORBIDDEN",
    );
  }

  const resourcesCount = await CourseResource.countDocuments({
    courseId: course._id,
  });

  return mapCourseToResponse(course, resourcesCount);
}

export async function getCourseResources(
  courseId: string,
  ownerId: string,
  options: { page: number; limit: number },
): Promise<{ data: CourseResourceItemResponse[]; pagination: Pagination }> {
  if (!Types.ObjectId.isValid(courseId)) {
    throw new BadRequestError("Invalid course ID format", "INVALID_COURSE_ID");
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new NotFoundError("Course not found", "COURSE_NOT_FOUND");
  }

  if (course.ownerId.toString() !== ownerId) {
    throw new ForbiddenError(
      "You do not have permission to view this course",
      "FORBIDDEN",
    );
  }

  const filter = { courseId: course._id };
  const total = await CourseResource.countDocuments(filter);
  const skip = (options.page - 1) * options.limit;

  const records = await CourseResource.find(filter)
    .sort({ position: 1, createdAt: -1 })
    .skip(skip)
    .limit(options.limit)
    .populate({
      path: "resourceId",
      populate: {
        path: "uploaderId",
        select: "name avatarUrl",
      },
    });

  const data: CourseResourceItemResponse[] = [];
  for (const record of records) {
    if (record.resourceId && typeof record.resourceId === "object" && "_id" in record.resourceId) {
      const resourceDoc = record.resourceId as unknown as IResource & {
        uploaderId: Types.ObjectId | { _id: Types.ObjectId; name: string; avatarUrl?: string };
      };
      data.push({
        id: record._id.toString(),
        courseId: course._id.toString(),
        resourceId: resourceDoc._id.toString(),
        position: record.position ?? 0,
        addedAt: record.createdAt.toISOString(),
        resource: mapResourceToResponse(resourceDoc),
      });
    }
  }

  return {
    data,
    pagination: {
      page: options.page,
      limit: options.limit,
      total,
      hasNextPage: skip + records.length < total,
    },
  };
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export async function createCourse(
  ownerId: string,
  dto: CreateCourseDto,
): Promise<CourseResponse> {
  const ownerObjectId = new Types.ObjectId(ownerId);

  // Validate subject if provided
  let subjectObjectId: Types.ObjectId | undefined;
  if (dto.subjectId) {
    if (!Types.ObjectId.isValid(dto.subjectId)) {
      throw new BadRequestError("Invalid subject ID format", "INVALID_SUBJECT_ID");
    }
    const subject = await Subject.findById(dto.subjectId);
    if (!subject) {
      throw new BadRequestError("Subject not found", "SUBJECT_NOT_FOUND");
    }
    subjectObjectId = subject._id;
  }

  const course = await Course.create({
    title: dto.title,
    description: dto.description,
    ownerId: ownerObjectId,
    subjectId: subjectObjectId,
    code: dto.code,
    department: dto.department,
    semester: dto.semester,
    year: dto.year,
    deadline: dto.deadline ? new Date(dto.deadline) : undefined,
    progress: dto.progress ?? 0,
    cover: {
      color: dto.cover?.color || "#3072FF",
      icon: dto.cover?.icon,
    },
    source: dto.source || "user",
    status: dto.status || "active",
  });

  if (subjectObjectId) {
    await course.populate("subjectId", "name slug department");
  }

  logger.info({
    message: "Course created",
    courseId: course._id.toString(),
    ownerId,
    title: course.title,
  });

  return mapCourseToResponse(course, 0);
}

export async function updateCourse(
  courseId: string,
  ownerId: string,
  dto: UpdateCourseDto,
): Promise<CourseResponse> {
  if (!Types.ObjectId.isValid(courseId)) {
    throw new BadRequestError("Invalid course ID format", "INVALID_COURSE_ID");
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new NotFoundError("Course not found", "COURSE_NOT_FOUND");
  }

  if (course.ownerId.toString() !== ownerId) {
    throw new ForbiddenError(
      "Only the course owner can modify this course",
      "FORBIDDEN",
    );
  }

  if (dto.title !== undefined) course.title = dto.title;
  if (dto.description !== undefined) course.description = dto.description;
  if (dto.code !== undefined) course.code = dto.code;
  if (dto.department !== undefined) course.department = dto.department;
  if (dto.semester !== undefined) course.semester = dto.semester;
  if (dto.year !== undefined) course.year = dto.year;
  if (dto.status !== undefined) course.status = dto.status;
  if (dto.progress !== undefined) course.progress = dto.progress;

  if (dto.deadline !== undefined) {
    course.deadline = dto.deadline ? new Date(dto.deadline) : undefined;
  }

  if (dto.subjectId !== undefined) {
    if (dto.subjectId === null) {
      course.subjectId = undefined;
    } else {
      if (!Types.ObjectId.isValid(dto.subjectId)) {
        throw new BadRequestError("Invalid subject ID format", "INVALID_SUBJECT_ID");
      }
      const subject = await Subject.findById(dto.subjectId);
      if (!subject) {
        throw new BadRequestError("Subject not found", "SUBJECT_NOT_FOUND");
      }
      course.subjectId = subject._id;
    }
  }

  if (dto.cover) {
    course.cover = {
      color: dto.cover.color ?? course.cover.color,
      icon: dto.cover.icon ?? course.cover.icon,
    };
  }

  await course.save();
  await course.populate("subjectId", "name slug department");

  const resourcesCount = await CourseResource.countDocuments({
    courseId: course._id,
  });

  logger.info({
    message: "Course updated",
    courseId: course._id.toString(),
    ownerId,
  });

  return mapCourseToResponse(course, resourcesCount);
}

export async function deleteCourse(
  courseId: string,
  ownerId: string,
): Promise<void> {
  if (!Types.ObjectId.isValid(courseId)) {
    throw new BadRequestError("Invalid course ID format", "INVALID_COURSE_ID");
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new NotFoundError("Course not found", "COURSE_NOT_FOUND");
  }

  if (course.ownerId.toString() !== ownerId) {
    throw new ForbiddenError(
      "Only the course owner can delete this course",
      "FORBIDDEN",
    );
  }

  // Delete course document and cascade delete join associations
  await Promise.all([
    Course.deleteOne({ _id: course._id }),
    CourseResource.deleteMany({ courseId: course._id }),
  ]);

  logger.info({
    message: "Course deleted and associations cleaned up",
    courseId,
    ownerId,
  });
}

export async function associateResourceToCourse(
  courseId: string,
  resourceId: string,
  userId: string,
  position = 0,
): Promise<{ success: true }> {
  if (!Types.ObjectId.isValid(courseId) || !Types.ObjectId.isValid(resourceId)) {
    throw new BadRequestError("Invalid course or resource ID format", "INVALID_ID");
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new NotFoundError("Course not found", "COURSE_NOT_FOUND");
  }

  if (course.ownerId.toString() !== userId) {
    throw new ForbiddenError(
      "Only the course owner can associate resources with this course",
      "FORBIDDEN",
    );
  }

  await CourseResource.findOneAndUpdate(
    {
      courseId: course._id,
      resourceId: new Types.ObjectId(resourceId),
    },
    {
      $set: {
        addedBy: new Types.ObjectId(userId),
        position,
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true },
  );

  return { success: true };
}

export async function disassociateResourceFromCourse(
  courseId: string,
  resourceId: string,
  userId: string,
): Promise<{ success: true }> {
  if (!Types.ObjectId.isValid(courseId) || !Types.ObjectId.isValid(resourceId)) {
    throw new BadRequestError("Invalid course or resource ID format", "INVALID_ID");
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new NotFoundError("Course not found", "COURSE_NOT_FOUND");
  }

  if (course.ownerId.toString() !== userId) {
    throw new ForbiddenError(
      "Only the course owner can disassociate resources from this course",
      "FORBIDDEN",
    );
  }

  await CourseResource.deleteOne({
    courseId: new Types.ObjectId(courseId),
    resourceId: new Types.ObjectId(resourceId),
  });

  return { success: true };
}
