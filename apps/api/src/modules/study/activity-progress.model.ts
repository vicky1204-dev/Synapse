/**
 * ActivityProgress model.
 *
 * Implements DATABASE-SCHEMA.md Section 9 and study session persistence.
 */

import { Schema, model } from "mongoose";
import type { IActivityProgress } from "./study.types";

const activityProgressSchema = new Schema<IActivityProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    activityId: {
      type: Schema.Types.ObjectId,
      ref: "StudyActivity",
      required: true,
      index: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    resourceId: {
      type: Schema.Types.ObjectId,
      ref: "Resource",
      index: true,
    },
    status: {
      type: String,
      enum: ["not-started", "in-progress", "completed"],
      default: "not-started",
      index: true,
    },
    durationSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastPosition: {
      type: Schema.Types.Mixed,
    },
    notes: {
      type: String,
      maxlength: 10000,
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    lastStudiedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true },
);

// Unique compound index per DATABASE-SCHEMA.md
activityProgressSchema.index({ userId: 1, activityId: 1 }, { unique: true });
activityProgressSchema.index({ userId: 1, courseId: 1, lastStudiedAt: -1 });
activityProgressSchema.index({ userId: 1, lastStudiedAt: -1 });

export const ActivityProgress = model<IActivityProgress>(
  "ActivityProgress",
  activityProgressSchema,
);
