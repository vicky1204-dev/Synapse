/**
 * User model.
 *
 * Represents authenticated users in the system.
 * Passwords are hashed using bcrypt; the passwordHash field is never
 * serialized to API responses.
 */

import { Schema, model } from "mongoose";
import type { IUser } from "../auth/auth.types";
import { ONBOARDING_STATUS } from "../auth/auth.types";

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // Never include in queries by default
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
    },
    onboardingStatus: {
      type: String,
      enum: ONBOARDING_STATUS,
      default: "pending",
    },
    academicProfile: {
      program: String,
      year: Number,
      institution: String,
    },
    onboardingGoals: {
      type: [String],
      default: [],
    },
    subjectIds: {
      type: [Schema.Types.ObjectId],
      ref: "Subject",
      default: [],
    },
    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
      },
    },
  },
  { timestamps: true },
);

// Indexes
userSchema.index({ email: 1 }, { unique: true });

export const User = model<IUser>("User", userSchema);
