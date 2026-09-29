/**
 * Authentication types.
 */

import type { Types } from "mongoose";

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------

export const ONBOARDING_STATUS = ["pending", "completed"] as const;
export type OnboardingStatus = (typeof ONBOARDING_STATUS)[number];

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  avatarUrl?: string;

  onboardingStatus: OnboardingStatus;
  academicProfile?: {
    program?: string;
    year?: number;
    institution?: string;
  };

  onboardingGoals: string[];
  subjectIds: Types.ObjectId[];

  preferences: {
    theme?: "light" | "dark" | "system";
  };

  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Refresh Token
// ---------------------------------------------------------------------------

export interface IRefreshToken {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

// ---------------------------------------------------------------------------
// DTOs
// ---------------------------------------------------------------------------

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  onboardingStatus: OnboardingStatus;
  academicProfile?: {
    program?: string;
    year?: number;
    institution?: string;
  };
  createdAt: string;
}
