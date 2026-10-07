/**
 * Discussion & Comment service.
 *
 * Business logic for Reddit-like contextual discussion threads and comments.
 */

import { Types } from "mongoose";
import { Discussion } from "./discussion.model";
import { Comment } from "./comment.model";
import { Course } from "../courses/course.model";
import { Resource } from "../resources/resource.model";
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "../../middleware/error-handler";
import type { Pagination } from "../../utils/response";
import { logger } from "../../lib/logger";
import type {
  IDiscussion,
  IComment,
  DiscussionResponse,
  CommentResponse,
  CreateDiscussionDto,
  UpdateDiscussionDto,
  QueryDiscussionsDto,
  CreateCommentDto,
  UpdateCommentDto,
  QueryCommentsDto,
} from "./discussion.types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function mapDiscussionToResponse(
  doc: IDiscussion & {
    authorId: Types.ObjectId | { _id: Types.ObjectId; name: string; avatarUrl?: string };
    courseId?: Types.ObjectId | { _id: Types.ObjectId; title: string; code?: string };
    resourceId?: Types.ObjectId | { _id: Types.ObjectId; title: string; type: string };
  },
): DiscussionResponse {
  let author: { id: string; name: string; avatarUrl?: string } | undefined;
  let authorIdStr = "";

  if (doc.authorId && typeof doc.authorId === "object" && "name" in doc.authorId) {
    const popAuthor = doc.authorId as {
      _id: Types.ObjectId;
      name: string;
      avatarUrl?: string;
    };
    authorIdStr = popAuthor._id.toString();
    author = {
      id: authorIdStr,
      name: popAuthor.name,
      avatarUrl: popAuthor.avatarUrl,
    };
  } else {
    authorIdStr = doc.authorId ? doc.authorId.toString() : "";
  }

  let courseContext: { id: string; title: string; code?: string } | undefined;
  let courseIdStr: string | undefined;

  if (doc.courseId) {
    if (typeof doc.courseId === "object" && "title" in doc.courseId) {
      const popCourse = doc.courseId as {
        _id: Types.ObjectId;
        title: string;
        code?: string;
      };
      courseIdStr = popCourse._id.toString();
      courseContext = {
        id: courseIdStr,
        title: popCourse.title,
        code: popCourse.code,
      };
    } else {
      courseIdStr = doc.courseId.toString();
    }
  }

  let resourceContext: { id: string; title: string; type: string } | undefined;
  let resourceIdStr: string | undefined;

  if (doc.resourceId) {
    if (typeof doc.resourceId === "object" && "title" in doc.resourceId) {
      const popResource = doc.resourceId as {
        _id: Types.ObjectId;
        title: string;
        type: string;
      };
      resourceIdStr = popResource._id.toString();
      resourceContext = {
        id: resourceIdStr,
        title: popResource.title,
        type: popResource.type,
      };
    } else {
      resourceIdStr = doc.resourceId.toString();
    }
  }

  const context =
    courseContext || resourceContext
      ? { course: courseContext, resource: resourceContext }
      : undefined;

  return {
    id: doc._id.toString(),
    authorId: authorIdStr,
    author,
    courseId: courseIdStr,
    resourceId: resourceIdStr,
    context,
    title: doc.title,
    body: doc.body,
    tags: doc.tags ?? [],
    status: doc.status,
    commentCount: doc.commentCount ?? 0,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export function mapCommentToResponse(
  doc: IComment & {
    authorId: Types.ObjectId | { _id: Types.ObjectId; name: string; avatarUrl?: string };
  },
): CommentResponse {
  let author: { id: string; name: string; avatarUrl?: string } | undefined;
  let authorIdStr = "";

  if (doc.authorId && typeof doc.authorId === "object" && "name" in doc.authorId) {
    const popAuthor = doc.authorId as {
      _id: Types.ObjectId;
      name: string;
      avatarUrl?: string;
    };
    authorIdStr = popAuthor._id.toString();
    author = {
      id: authorIdStr,
      name: popAuthor.name,
      avatarUrl: popAuthor.avatarUrl,
    };
  } else {
    authorIdStr = doc.authorId ? doc.authorId.toString() : "";
  }

  return {
    id: doc._id.toString(),
    discussionId: doc.discussionId.toString(),
    authorId: authorIdStr,
    author,
    parentCommentId: doc.parentCommentId ? doc.parentCommentId.toString() : undefined,
    body: doc.body,
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Discussion Queries & Mutations
// ---------------------------------------------------------------------------

export async function getDiscussions(
  query: QueryDiscussionsDto,
): Promise<{ data: DiscussionResponse[]; pagination: Pagination }> {
  const filter: Record<string, unknown> = {};

  if (query.status && query.status !== "all") {
    filter.status = query.status;
  } else if (!query.status) {
    filter.status = "published";
  }

  if (query.courseId) {
    if (!Types.ObjectId.isValid(query.courseId)) {
      throw new BadRequestError("Invalid course ID format", "INVALID_COURSE_ID");
    }
    filter.courseId = new Types.ObjectId(query.courseId);
  }

  if (query.resourceId) {
    if (!Types.ObjectId.isValid(query.resourceId)) {
      throw new BadRequestError("Invalid resource ID format", "INVALID_RESOURCE_ID");
    }
    filter.resourceId = new Types.ObjectId(query.resourceId);
  }

  if (query.authorId) {
    if (!Types.ObjectId.isValid(query.authorId)) {
      throw new BadRequestError("Invalid author ID format", "INVALID_AUTHOR_ID");
    }
    filter.authorId = new Types.ObjectId(query.authorId);
  }

  if (query.tag) {
    filter.tags = query.tag.trim();
  }

  if (query.search && query.search.trim()) {
    filter.$text = { $search: query.search.trim() };
  }

  const total = await Discussion.countDocuments(filter);
  const skip = (query.page - 1) * query.limit;

  const records = await Discussion.find(filter)
    .sort(query.search ? { score: { $meta: "textScore" }, createdAt: -1 } : { createdAt: -1 })
    .skip(skip)
    .limit(query.limit)
    .populate("authorId", "name avatarUrl")
    .populate("courseId", "title code")
    .populate("resourceId", "title type");

  const data = records.map((doc) =>
    mapDiscussionToResponse(
      doc as unknown as IDiscussion & {
        authorId: { _id: Types.ObjectId; name: string; avatarUrl?: string };
        courseId?: { _id: Types.ObjectId; title: string; code?: string };
        resourceId?: { _id: Types.ObjectId; title: string; type: string };
      },
    ),
  );

  return {
    data,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      hasNextPage: skip + records.length < total,
    },
  };
}

export async function getDiscussionById(
  id: string,
): Promise<DiscussionResponse> {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid discussion ID format", "INVALID_DISCUSSION_ID");
  }

  const discussion = await Discussion.findById(id)
    .populate("authorId", "name avatarUrl")
    .populate("courseId", "title code")
    .populate("resourceId", "title type");

  if (!discussion || discussion.status === "hidden") {
    throw new NotFoundError("Discussion not found", "DISCUSSION_NOT_FOUND");
  }

  return mapDiscussionToResponse(
    discussion as unknown as IDiscussion & {
      authorId: { _id: Types.ObjectId; name: string; avatarUrl?: string };
      courseId?: { _id: Types.ObjectId; title: string; code?: string };
      resourceId?: { _id: Types.ObjectId; title: string; type: string };
    },
  );
}

export async function createDiscussion(
  userId: string,
  dto: CreateDiscussionDto,
): Promise<DiscussionResponse> {
  const authorObjectId = new Types.ObjectId(userId);

  let courseObjectId: Types.ObjectId | undefined;
  if (dto.courseId) {
    if (!Types.ObjectId.isValid(dto.courseId)) {
      throw new BadRequestError("Invalid course ID format", "INVALID_COURSE_ID");
    }
    const courseExists = await Course.exists({ _id: dto.courseId });
    if (!courseExists) {
      throw new NotFoundError("Course not found", "COURSE_NOT_FOUND");
    }
    courseObjectId = new Types.ObjectId(dto.courseId);
  }

  let resourceObjectId: Types.ObjectId | undefined;
  if (dto.resourceId) {
    if (!Types.ObjectId.isValid(dto.resourceId)) {
      throw new BadRequestError("Invalid resource ID format", "INVALID_RESOURCE_ID");
    }
    const resourceExists = await Resource.exists({ _id: dto.resourceId });
    if (!resourceExists) {
      throw new NotFoundError("Resource not found", "RESOURCE_NOT_FOUND");
    }
    resourceObjectId = new Types.ObjectId(dto.resourceId);
  }

  const discussion = await Discussion.create({
    authorId: authorObjectId,
    courseId: courseObjectId,
    resourceId: resourceObjectId,
    title: dto.title.trim(),
    body: dto.body.trim(),
    tags: dto.tags ?? [],
    status: "published",
    commentCount: 0,
  });

  await discussion.populate("authorId", "name avatarUrl");
  if (courseObjectId) {
    await discussion.populate("courseId", "title code");
  }
  if (resourceObjectId) {
    await discussion.populate("resourceId", "title type");
  }

  logger.info({
    message: "Discussion created",
    discussionId: discussion._id.toString(),
    authorId: userId,
    title: discussion.title,
  });

  return mapDiscussionToResponse(
    discussion as unknown as IDiscussion & {
      authorId: { _id: Types.ObjectId; name: string; avatarUrl?: string };
      courseId?: { _id: Types.ObjectId; title: string; code?: string };
      resourceId?: { _id: Types.ObjectId; title: string; type: string };
    },
  );
}

export async function updateDiscussion(
  id: string,
  userId: string,
  dto: UpdateDiscussionDto,
): Promise<DiscussionResponse> {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid discussion ID format", "INVALID_DISCUSSION_ID");
  }

  const discussion = await Discussion.findById(id);
  if (!discussion) {
    throw new NotFoundError("Discussion not found", "DISCUSSION_NOT_FOUND");
  }

  if (discussion.authorId.toString() !== userId) {
    throw new ForbiddenError(
      "Only the discussion author can edit this discussion",
      "FORBIDDEN",
    );
  }

  if (dto.title !== undefined) discussion.title = dto.title.trim();
  if (dto.body !== undefined) discussion.body = dto.body.trim();
  if (dto.tags !== undefined) discussion.tags = dto.tags;
  if (dto.status !== undefined) discussion.status = dto.status;

  await discussion.save();
  await discussion.populate("authorId", "name avatarUrl");
  await discussion.populate("courseId", "title code");
  await discussion.populate("resourceId", "title type");

  logger.info({
    message: "Discussion updated",
    discussionId: discussion._id.toString(),
    userId,
  });

  return mapDiscussionToResponse(
    discussion as unknown as IDiscussion & {
      authorId: { _id: Types.ObjectId; name: string; avatarUrl?: string };
      courseId?: { _id: Types.ObjectId; title: string; code?: string };
      resourceId?: { _id: Types.ObjectId; title: string; type: string };
    },
  );
}

export async function deleteDiscussion(
  id: string,
  userId: string,
): Promise<void> {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid discussion ID format", "INVALID_DISCUSSION_ID");
  }

  const discussion = await Discussion.findById(id);
  if (!discussion) {
    throw new NotFoundError("Discussion not found", "DISCUSSION_NOT_FOUND");
  }

  if (discussion.authorId.toString() !== userId) {
    throw new ForbiddenError(
      "Only the discussion author can delete this discussion",
      "FORBIDDEN",
    );
  }

  // If comments exist, preserve thread structure by marking deleted
  if (discussion.commentCount > 0) {
    discussion.status = "deleted";
    discussion.title = "[deleted]";
    discussion.body = "[deleted]";
    await discussion.save();
  } else {
    await Discussion.deleteOne({ _id: discussion._id });
  }

  logger.info({
    message: "Discussion deleted",
    discussionId: id,
    userId,
  });
}

// ---------------------------------------------------------------------------
// Comment Queries & Mutations
// ---------------------------------------------------------------------------

export async function getComments(
  discussionId: string,
  query: QueryCommentsDto,
): Promise<{ data: CommentResponse[]; pagination: Pagination }> {
  if (!Types.ObjectId.isValid(discussionId)) {
    throw new BadRequestError("Invalid discussion ID format", "INVALID_DISCUSSION_ID");
  }

  const filter: Record<string, unknown> = {
    discussionId: new Types.ObjectId(discussionId),
    status: { $ne: "hidden" },
  };

  if (query.parentCommentId) {
    if (!Types.ObjectId.isValid(query.parentCommentId)) {
      throw new BadRequestError("Invalid parent comment ID format", "INVALID_COMMENT_ID");
    }
    filter.parentCommentId = new Types.ObjectId(query.parentCommentId);
  }

  const total = await Comment.countDocuments(filter);
  const skip = (query.page - 1) * query.limit;

  const records = await Comment.find(filter)
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(query.limit)
    .populate("authorId", "name avatarUrl");

  const data = records.map((doc) =>
    mapCommentToResponse(
      doc as unknown as IComment & {
        authorId: { _id: Types.ObjectId; name: string; avatarUrl?: string };
      },
    ),
  );

  return {
    data,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      hasNextPage: skip + records.length < total,
    },
  };
}

export async function createComment(
  discussionId: string,
  userId: string,
  dto: CreateCommentDto,
): Promise<CommentResponse> {
  if (!Types.ObjectId.isValid(discussionId)) {
    throw new BadRequestError("Invalid discussion ID format", "INVALID_DISCUSSION_ID");
  }

  const discussion = await Discussion.findById(discussionId);
  if (!discussion || discussion.status === "deleted") {
    throw new NotFoundError("Discussion not found", "DISCUSSION_NOT_FOUND");
  }

  let parentCommentObjectId: Types.ObjectId | undefined;
  if (dto.parentCommentId) {
    if (!Types.ObjectId.isValid(dto.parentCommentId)) {
      throw new BadRequestError("Invalid parent comment ID format", "INVALID_COMMENT_ID");
    }
    const parentComment = await Comment.findOne({
      _id: dto.parentCommentId,
      discussionId: discussion._id,
    });
    if (!parentComment) {
      throw new NotFoundError("Parent comment not found", "COMMENT_NOT_FOUND");
    }
    parentCommentObjectId = parentComment._id;
  }

  const comment = await Comment.create({
    discussionId: discussion._id,
    authorId: new Types.ObjectId(userId),
    parentCommentId: parentCommentObjectId,
    body: dto.body.trim(),
    status: "published",
  });

  // Increment discussion comment count atomically
  await Discussion.findByIdAndUpdate(discussion._id, {
    $inc: { commentCount: 1 },
  });

  await comment.populate("authorId", "name avatarUrl");

  logger.info({
    message: "Comment created",
    commentId: comment._id.toString(),
    discussionId,
    authorId: userId,
  });

  return mapCommentToResponse(
    comment as unknown as IComment & {
      authorId: { _id: Types.ObjectId; name: string; avatarUrl?: string };
    },
  );
}

export async function updateComment(
  commentId: string,
  userId: string,
  dto: UpdateCommentDto,
): Promise<CommentResponse> {
  if (!Types.ObjectId.isValid(commentId)) {
    throw new BadRequestError("Invalid comment ID format", "INVALID_COMMENT_ID");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new NotFoundError("Comment not found", "COMMENT_NOT_FOUND");
  }

  if (comment.authorId.toString() !== userId) {
    throw new ForbiddenError(
      "Only the comment author can edit this comment",
      "FORBIDDEN",
    );
  }

  if (dto.body !== undefined) comment.body = dto.body.trim();
  if (dto.status !== undefined) comment.status = dto.status;

  await comment.save();
  await comment.populate("authorId", "name avatarUrl");

  logger.info({
    message: "Comment updated",
    commentId,
    userId,
  });

  return mapCommentToResponse(
    comment as unknown as IComment & {
      authorId: { _id: Types.ObjectId; name: string; avatarUrl?: string };
    },
  );
}

export async function deleteComment(
  commentId: string,
  userId: string,
): Promise<void> {
  if (!Types.ObjectId.isValid(commentId)) {
    throw new BadRequestError("Invalid comment ID format", "INVALID_COMMENT_ID");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new NotFoundError("Comment not found", "COMMENT_NOT_FOUND");
  }

  if (comment.authorId.toString() !== userId) {
    throw new ForbiddenError(
      "Only the comment author can delete this comment",
      "FORBIDDEN",
    );
  }

  // Check if child replies exist to maintain thread integrity
  const repliesCount = await Comment.countDocuments({
    parentCommentId: comment._id,
  });

  if (repliesCount > 0) {
    comment.status = "deleted";
    comment.body = "[deleted]";
    await comment.save();
  } else {
    await Comment.deleteOne({ _id: comment._id });
  }

  // Decrement discussion comment count atomically
  await Discussion.findByIdAndUpdate(comment.discussionId, {
    $inc: { commentCount: -1 },
  });

  logger.info({
    message: "Comment deleted",
    commentId,
    userId,
  });
}
