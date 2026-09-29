/**
 * User and Onboarding service.
 *
 * Handles operations related to user profile and onboarding progress/completion.
 */

import { Types } from "mongoose";
import { User } from "./user.model";
import { Subject } from "../subjects/subject.model";
import { mapUserToResponse } from "../auth/auth.service";
import type { UserResponse } from "../auth/auth.types";
import type { UpdateOnboardingDto, UpdateProfileDto } from "./users.types";
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
