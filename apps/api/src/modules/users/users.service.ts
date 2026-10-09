/**
 * User and Onboarding service.
 *
 * Handles operations related to user profile and onboarding progress/completion.
 */

import { Types } from "mongoose";
import { User } from "./user.model";
import { Subject } from "../subjects/subject.model";
import { Resource } from "../resources/resource.model";
import { SavedResource } from "../resources/saved-resource.model";
import { Discussion } from "../discussions/discussion.model";
import { Comment } from "../discussions/comment.model";
import { mapUserToResponse } from "../auth/auth.service";
import { mapResourceToResponse } from "../resources/resource.service";
import { mapDiscussionToResponse } from "../discussions/discussion.service";
import type { IResource } from "../resources/resource.types";
import type { IDiscussion } from "../discussions/discussion.types";
import type { UserResponse } from "../auth/auth.types";
import type {
  UpdateOnboardingDto,
  UpdateProfileDto,
  UserContributionsResponse,
} from "./users.types";
import { NotFoundError, BadRequestError } from "../../middleware/error-handler";
import { logger } from "../../lib/logger";

export async function getUserProfile(userId: string): Promise<UserResponse> {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found", "USER_NOT_FOUND");
  }

  return mapUserToResponse(user);
}

export async function updateOnboarding(
  userId: string,
  dto: UpdateOnboardingDto,
): Promise<UserResponse> {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found", "USER_NOT_FOUND");
  }

  // Validate subject existence if provided
  if (dto.subjectIds && dto.subjectIds.length > 0) {
    const objectIds = dto.subjectIds.map((id) => new Types.ObjectId(id));
    const count = await Subject.countDocuments({
      _id: { $in: objectIds },
      active: true,
    });

    if (count !== dto.subjectIds.length) {
      throw new BadRequestError(
        "One or more selected subjects do not exist or are inactive",
        "INVALID_SUBJECT",
      );
    }

    user.subjectIds = objectIds;
  } else if (dto.subjectIds !== undefined) {
    user.subjectIds = [];
  }

  // Update academic profile
  if (dto.academicProfile) {
    user.academicProfile = {
      ...user.academicProfile,
      ...dto.academicProfile,
    };
  }

  // Update onboarding goals
  if (dto.onboardingGoals !== undefined) {
    user.onboardingGoals = dto.onboardingGoals;
  }

  // Update onboarding status if provided
  if (dto.onboardingStatus) {
    user.onboardingStatus = dto.onboardingStatus;
  }

  await user.save();

  logger.info({
    message: "User onboarding updated",
    userId: user._id.toString(),
    onboardingStatus: user.onboardingStatus,
  });

  return mapUserToResponse(user);
}

export async function updateProfile(
  userId: string,
  dto: UpdateProfileDto,
): Promise<UserResponse> {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found", "USER_NOT_FOUND");
  }

  if (dto.name !== undefined) {
    user.name = dto.name;
  }

  if (dto.avatarUrl !== undefined) {
    user.avatarUrl = dto.avatarUrl || undefined;
  }

  if (dto.academicProfile) {
    user.academicProfile = {
      ...user.academicProfile,
      ...dto.academicProfile,
    };
  }

  if (dto.onboardingGoals !== undefined) {
    user.onboardingGoals = dto.onboardingGoals;
  }

  if (dto.subjectIds && dto.subjectIds.length > 0) {
    const objectIds = dto.subjectIds.map((id) => new Types.ObjectId(id));
    const count = await Subject.countDocuments({
      _id: { $in: objectIds },
      active: true,
    });

    if (count !== dto.subjectIds.length) {
      throw new BadRequestError(
        "One or more selected subjects do not exist or are inactive",
        "INVALID_SUBJECT",
      );
    }

    user.subjectIds = objectIds;
  } else if (dto.subjectIds !== undefined) {
    user.subjectIds = [];
  }

  if (dto.preferences) {
    user.preferences = {
      ...user.preferences,
      ...dto.preferences,
    };
  }

  await user.save();

  logger.info({
    message: "User profile updated",
    userId: user._id.toString(),
  });

  return mapUserToResponse(user);
}

export async function getUserContributions(
  userId: string,
): Promise<UserContributionsResponse> {
  const userObjectId = new Types.ObjectId(userId);

  // 1. Fetch user's uploaded resources
  const resourceDocs = await Resource.find({ uploaderId: userObjectId })
    .populate("uploaderId", "name avatarUrl")
    .sort({ createdAt: -1 });

  const resourceIds = resourceDocs.map((r) => r._id);

  // 2. Fetch saves info:
  // - total saves received across all user's uploaded resources
  // - whether current user saved their own resources
  // - individual savesCount per uploaded resource
  const [totalSavesReceived, savedByUserDocs, savesAggregation] = await Promise.all([
    resourceIds.length > 0
      ? SavedResource.countDocuments({ resourceId: { $in: resourceIds } })
      : 0,
    resourceIds.length > 0
      ? SavedResource.find({
          userId: userObjectId,
          resourceId: { $in: resourceIds },
        })
      : [],
    resourceIds.length > 0
      ? SavedResource.aggregate<{ _id: Types.ObjectId; count: number }>([
          { $match: { resourceId: { $in: resourceIds } } },
          { $group: { _id: "$resourceId", count: { $sum: 1 } } },
        ])
      : [],
  ]);

  const savedSet = new Set(savedByUserDocs.map((s) => s.resourceId.toString()));
  const savesCountMap = new Map(
    savesAggregation.map((a) => [a._id.toString(), a.count]),
  );

  const uploadedResources = resourceDocs.map((doc) =>
    mapResourceToResponse(
      doc as unknown as IResource & {
        uploaderId: { _id: Types.ObjectId; name: string; avatarUrl?: string };
      },
      {
        isSaved: savedSet.has(doc._id.toString()),
        savesCount: savesCountMap.get(doc._id.toString()) ?? 0,
      },
    ),
  );

  // 3. Fetch discussions created by user
  const [discussionDocs, createdDiscussionsCount, totalCommentsCount] =
    await Promise.all([
      Discussion.find({
        authorId: userObjectId,
        status: { $in: ["published", "pinned"] },
      })
        .populate("authorId", "name avatarUrl")
        .populate("courseId", "title code")
        .populate("resourceId", "title type")
        .sort({ createdAt: -1 }),
      Discussion.countDocuments({
        authorId: userObjectId,
        status: { $in: ["published", "pinned"] },
      }),
      Comment.countDocuments({
        authorId: userObjectId,
        status: "published",
      }),
    ]);

  const createdDiscussions = discussionDocs.map((doc) =>
    mapDiscussionToResponse(
      doc as unknown as IDiscussion & {
        authorId: { _id: Types.ObjectId; name: string; avatarUrl?: string };
        courseId?: { _id: Types.ObjectId; title: string; code?: string };
        resourceId?: { _id: Types.ObjectId; title: string; type: string };
      },
    ),
  );

  return {
    summary: {
      uploadedResourcesCount: resourceDocs.length,
      createdDiscussionsCount,
      totalCommentsCount,
      totalSavesReceived,
    },
    uploadedResources,
    createdDiscussions,
  };
}
