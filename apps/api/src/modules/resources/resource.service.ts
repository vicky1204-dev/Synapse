/**
 * Resource service.
 *
 * Core business logic for resources, course associations, search, filtering, and saving.
 */

import { Types } from "mongoose";
import { Resource } from "./resource.model";
import { CourseResource } from "./course-resource.model";
import { SavedResource } from "./saved-resource.model";
import { Course } from "../courses/course.model";
import type {
  CreateResourceDto,
  UpdateResourceDto,
  QueryResourcesDto,
  ResourceResponse,
  IResource,
} from "./resource.types";
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "../../middleware/error-handler";
import type { Pagination } from "../../utils/response";
import { logger } from "../../lib/logger";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function mapResourceToResponse(
  doc: IResource & {
    uploaderId: Types.ObjectId | { _id: Types.ObjectId; name: string; avatarUrl?: string };
  },
  options?: {
    isSaved?: boolean;
    coursesCount?: number;
    savesCount?: number;
  },
): ResourceResponse {
  let uploader: { id: string; name: string; avatarUrl?: string } | undefined;
  let uploaderIdStr = "";

  if (doc.uploaderId && typeof doc.uploaderId === "object" && "name" in doc.uploaderId) {
    const populated = doc.uploaderId as { _id: Types.ObjectId; name: string; avatarUrl?: string };
    uploaderIdStr = populated._id.toString();
    uploader = {
      id: uploaderIdStr,
      name: populated.name,
      avatarUrl: populated.avatarUrl,
    };
  } else {
    uploaderIdStr = doc.uploaderId ? doc.uploaderId.toString() : "";
  }

  return {
    id: doc._id.toString(),
    uploaderId: uploaderIdStr,
    uploader,
    title: doc.title,
    description: doc.description,
    type: doc.type,
    file: doc.file,
    processing: {
      status: doc.processing?.status ?? "ready",
      jobId: doc.processing?.jobId,
      errorCode: doc.processing?.errorCode,
      completedAt: doc.processing?.completedAt?.toISOString(),
    },
    aiMetadata: {
      summary: doc.aiMetadata?.summary,
      topics: doc.aiMetadata?.topics ?? [],
      tags: doc.aiMetadata?.tags ?? [],
    },
    visibility: doc.visibility,
    isSaved: options?.isSaved,
    coursesCount: options?.coursesCount,
    savesCount: options?.savesCount ?? 0,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Queries & Library
// ---------------------------------------------------------------------------

export async function getResources(
  currentUserId: string | undefined,
  query: QueryResourcesDto,
): Promise<{ data: ResourceResponse[]; pagination: Pagination }> {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const skip = (page - 1) * limit;

  // Build filter object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {};

  // Visibility: Public resources are accessible to all.
  // Private resources are only accessible to their uploader.
  if (currentUserId) {
    const userObjectId = new Types.ObjectId(currentUserId);
    if (query.visibility === "private") {
      filter.visibility = "private";
      filter.uploaderId = userObjectId;
    } else if (query.visibility === "public") {
      filter.visibility = "public";
    } else {
      filter.$or = [{ visibility: "public" }, { uploaderId: userObjectId }];
    }
  } else {
    filter.visibility = "public";
  }

  // Type filter
  if (query.type) {
    filter.type = query.type;
  }

  // Specific uploader filter
  if (query.uploaderId) {
    filter.uploaderId = new Types.ObjectId(query.uploaderId);
  }

  // Topic filter
  if (query.topic) {
    filter["aiMetadata.topics"] = { $regex: new RegExp(`^${query.topic}$`, "i") };
  }

  // Tag filter
  if (query.tag) {
    filter["aiMetadata.tags"] = { $regex: new RegExp(`^${query.tag}$`, "i") };
  }

  // Filter by linked course if courseId provided
  if (query.courseId) {
    const courseResources = await CourseResource.find({
      courseId: new Types.ObjectId(query.courseId),
    }).select("resourceId");
    const resourceIds = courseResources.map((cr) => cr.resourceId);
    filter._id = { $in: resourceIds };
  }

  // Text search
  if (query.search) {
    const searchRegex = new RegExp(query.search.trim(), "i");
    const textConditions = [
      { title: searchRegex },
      { description: searchRegex },
      { "aiMetadata.topics": searchRegex },
      { "aiMetadata.tags": searchRegex },
    ];

    if (filter.$or) {
      filter.$and = [{ $or: filter.$or }, { $or: textConditions }];
      delete filter.$or;
    } else {
      filter.$or = textConditions;
    }
  }

  const [total, docs] = await Promise.all([
    Resource.countDocuments(filter),
    Resource.find(filter)
      .populate("uploaderId", "name avatarUrl")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
  ]);

  // Check saved state for current user & compute total saves count per resource
  let savedSet = new Set<string>();
  let savesCountMap = new Map<string, number>();

  if (docs.length > 0) {
    const docIds = docs.map((d) => d._id);
    const [savedDocs, savesAggregation] = await Promise.all([
      currentUserId
        ? SavedResource.find({
            userId: new Types.ObjectId(currentUserId),
            resourceId: { $in: docIds },
          }).select("resourceId")
        : Promise.resolve([]),
      SavedResource.aggregate([
        { $match: { resourceId: { $in: docIds } } },
        { $group: { _id: "$resourceId", count: { $sum: 1 } } },
      ]),
    ]);

    savedSet = new Set(savedDocs.map((s) => s.resourceId.toString()));
    savesCountMap = new Map(
      savesAggregation.map((s) => [s._id.toString(), s.count as number]),
    );
  }

  const data = docs.map((doc) =>
    mapResourceToResponse(
      doc as unknown as IResource & { uploaderId: Types.ObjectId },
      {
        isSaved: savedSet.has(doc._id.toString()),
        savesCount: savesCountMap.get(doc._id.toString()) ?? 0,
      },
    ),
  );

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      hasNextPage: skip + docs.length < total,
    },
  };
}

export async function getResourceById(
  resourceId: string,
  currentUserId?: string,
): Promise<ResourceResponse> {
  if (!Types.ObjectId.isValid(resourceId)) {
    throw new BadRequestError("Invalid resource ID format", "INVALID_RESOURCE_ID");
  }

  const resource = await Resource.findById(resourceId).populate(
    "uploaderId",
    "name avatarUrl",
  );

  if (!resource) {
    throw new NotFoundError("Resource not found", "RESOURCE_NOT_FOUND");
  }

  // Check visibility permissions
  const uploaderIdStr =
    resource.uploaderId instanceof Types.ObjectId
      ? resource.uploaderId.toString()
      : ((resource.uploaderId as unknown as { _id?: Types.ObjectId })._id?.toString() ??
        String(resource.uploaderId));

  if (resource.visibility === "private" && uploaderIdStr !== currentUserId) {
    throw new ForbiddenError(
      "You do not have permission to view this resource",
      "FORBIDDEN",
    );
  }

  // Saved status & courses count
  let isSaved = false;
  if (currentUserId) {
    const savedDoc = await SavedResource.findOne({
      userId: new Types.ObjectId(currentUserId),
      resourceId: resource._id,
    });
    isSaved = Boolean(savedDoc);
  }

  const [coursesCount, savesCount] = await Promise.all([
    CourseResource.countDocuments({
      resourceId: resource._id,
    }),
    SavedResource.countDocuments({
      resourceId: resource._id,
    }),
  ]);

  return mapResourceToResponse(
    resource as unknown as IResource & { uploaderId: Types.ObjectId },
    { isSaved, coursesCount, savesCount },
  );
}

// ---------------------------------------------------------------------------
// Mutation Operations
// ---------------------------------------------------------------------------

export async function createResource(
  uploaderId: string,
  dto: CreateResourceDto,
): Promise<ResourceResponse> {
  const uploaderObjectId = new Types.ObjectId(uploaderId);

  // If initial file is uploaded, set processing to ready or pending
  const initialProcessingStatus = dto.file ? "ready" : "ready";

  const resource = await Resource.create({
    uploaderId: uploaderObjectId,
    title: dto.title,
    description: dto.description,
    type: dto.type,
    file: dto.file,
    processing: {
      status: initialProcessingStatus,
      completedAt: initialProcessingStatus === "ready" ? new Date() : undefined,
    },
    aiMetadata: {
      summary: dto.aiMetadata?.summary,
      topics: dto.aiMetadata?.topics ?? [],
      tags: dto.aiMetadata?.tags ?? [],
    },
    visibility: dto.visibility ?? "public",
  });

  // If a valid course ID is provided, create the CourseResource association
  if (dto.courseId && Types.ObjectId.isValid(dto.courseId)) {
    const courseObjectId = new Types.ObjectId(dto.courseId);
    const course = await Course.findById(courseObjectId);
    if (course) {
      await CourseResource.create({
        courseId: courseObjectId,
        resourceId: resource._id,
        addedBy: uploaderObjectId,
      });
    }
  }

  logger.info({
    message: "Resource created",
    resourceId: resource._id.toString(),
    uploaderId,
    type: resource.type,
  });

  return getResourceById(resource._id.toString(), uploaderId);
}

export async function updateResource(
  resourceId: string,
  userId: string,
  dto: UpdateResourceDto,
): Promise<ResourceResponse> {
  if (!Types.ObjectId.isValid(resourceId)) {
    throw new BadRequestError("Invalid resource ID format", "INVALID_RESOURCE_ID");
  }

  const resource = await Resource.findById(resourceId);
  if (!resource) {
    throw new NotFoundError("Resource not found", "RESOURCE_NOT_FOUND");
  }

  if (resource.uploaderId.toString() !== userId) {
    throw new ForbiddenError(
      "Only the uploader can edit this resource",
      "FORBIDDEN",
    );
  }

  if (dto.title !== undefined) resource.title = dto.title;
  if (dto.description !== undefined) resource.description = dto.description;
  if (dto.visibility !== undefined) resource.visibility = dto.visibility;
  if (dto.aiMetadata) {
    resource.aiMetadata = {
      summary: dto.aiMetadata.summary ?? resource.aiMetadata?.summary,
      topics: dto.aiMetadata.topics ?? resource.aiMetadata?.topics ?? [],
      tags: dto.aiMetadata.tags ?? resource.aiMetadata?.tags ?? [],
    };
  }

  await resource.save();

  logger.info({
    message: "Resource updated",
    resourceId: resource._id.toString(),
    userId,
  });

  return getResourceById(resourceId, userId);
}

export async function deleteResource(
  resourceId: string,
  userId: string,
): Promise<void> {
  if (!Types.ObjectId.isValid(resourceId)) {
    throw new BadRequestError("Invalid resource ID format", "INVALID_RESOURCE_ID");
  }

  const resource = await Resource.findById(resourceId);
  if (!resource) {
    throw new NotFoundError("Resource not found", "RESOURCE_NOT_FOUND");
  }

  if (resource.uploaderId.toString() !== userId) {
    throw new ForbiddenError(
      "Only the uploader can delete this resource",
      "FORBIDDEN",
    );
  }

  // Delete resource and clean up all associations
  await Promise.all([
    Resource.deleteOne({ _id: resource._id }),
    CourseResource.deleteMany({ resourceId: resource._id }),
    SavedResource.deleteMany({ resourceId: resource._id }),
  ]);

  logger.info({
    message: "Resource deleted",
    resourceId,
    userId,
  });
}

// ---------------------------------------------------------------------------
// Saving & Bookmarking
// ---------------------------------------------------------------------------

export async function saveResource(
  resourceId: string,
  userId: string,
): Promise<{ saved: true }> {
  if (!Types.ObjectId.isValid(resourceId)) {
    throw new BadRequestError("Invalid resource ID format", "INVALID_RESOURCE_ID");
  }

  const resource = await Resource.findById(resourceId);
  if (!resource) {
    throw new NotFoundError("Resource not found", "RESOURCE_NOT_FOUND");
  }

  if (resource.visibility === "private" && resource.uploaderId.toString() !== userId) {
    throw new ForbiddenError(
      "Cannot save a private resource belonging to another user",
      "FORBIDDEN",
    );
  }

  await SavedResource.findOneAndUpdate(
    {
      userId: new Types.ObjectId(userId),
      resourceId: resource._id,
    },
    {
      $setOnInsert: {
        userId: new Types.ObjectId(userId),
        resourceId: resource._id,
        createdAt: new Date(),
      },
    },
    { upsert: true },
  );

  return { saved: true };
}

export async function unsaveResource(
  resourceId: string,
  userId: string,
): Promise<{ saved: false }> {
  if (!Types.ObjectId.isValid(resourceId)) {
    throw new BadRequestError("Invalid resource ID format", "INVALID_RESOURCE_ID");
  }

  await SavedResource.deleteOne({
    userId: new Types.ObjectId(userId),
    resourceId: new Types.ObjectId(resourceId),
  });

  return { saved: false };
}

export async function getSavedResources(
  userId: string,
  page = 1,
  limit = 20,
): Promise<{ data: ResourceResponse[]; pagination: Pagination }> {
  const skip = (page - 1) * limit;
  const userObjectId = new Types.ObjectId(userId);

  const [total, savedEntries] = await Promise.all([
    SavedResource.countDocuments({ userId: userObjectId }),
    SavedResource.find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("resourceId"),
  ]);

  const resourceIds = savedEntries.map((entry) => entry.resourceId);

  const resources = await Resource.find({
    _id: { $in: resourceIds },
  }).populate("uploaderId", "name avatarUrl");

  // Keep saved order
  const resourceMap = new Map(resources.map((r) => [r._id.toString(), r]));
  const orderedResources = resourceIds
    .map((id) => resourceMap.get(id.toString()))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  const data = orderedResources.map((doc) =>
    mapResourceToResponse(doc as unknown as IResource & { uploaderId: Types.ObjectId }, {
      isSaved: true,
    }),
  );

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      hasNextPage: skip + savedEntries.length < total,
    },
  };
}

// ---------------------------------------------------------------------------
// Course-Resource Association
// ---------------------------------------------------------------------------

export async function associateResourceWithCourse(
  resourceId: string,
  courseId: string,
  userId: string,
  position = 0,
): Promise<{ success: true }> {
  if (!Types.ObjectId.isValid(resourceId) || !Types.ObjectId.isValid(courseId)) {
    throw new BadRequestError("Invalid resource or course ID format", "INVALID_ID");
  }

  const [resource, course] = await Promise.all([
    Resource.findById(resourceId),
    Course.findById(courseId),
  ]);

  if (!resource) {
    throw new NotFoundError("Resource not found", "RESOURCE_NOT_FOUND");
  }
  if (!course) {
    throw new NotFoundError("Course not found", "COURSE_NOT_FOUND");
  }

  // Ensure user owns course or has rights
  if (course.ownerId.toString() !== userId) {
    throw new ForbiddenError(
      "Only the course owner can associate resources with this course",
      "FORBIDDEN",
    );
  }

  await CourseResource.findOneAndUpdate(
    {
      courseId: course._id,
      resourceId: resource._id,
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
  resourceId: string,
  courseId: string,
  userId: string,
): Promise<{ success: true }> {
  if (!Types.ObjectId.isValid(resourceId) || !Types.ObjectId.isValid(courseId)) {
    throw new BadRequestError("Invalid resource or course ID format", "INVALID_ID");
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

export async function getProcessingStatus(
  resourceId: string,
  userId?: string,
): Promise<{
  status: string;
  jobId?: string;
  errorCode?: string;
  completedAt?: string;
}> {
  const resource = await getResourceById(resourceId, userId);
  return resource.processing;
}
