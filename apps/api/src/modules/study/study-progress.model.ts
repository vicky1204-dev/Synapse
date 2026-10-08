/**
 * StudyProgress model.
 *
 * Implements DATABASE-SCHEMA.md Section 8 (course study progress projection).
 */

import { Schema, model } from "mongoose";
import type { IStudyProgress } from "./study.types";

const studyProgressSchema = new Schema<IStudyProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    completedActivityCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalActivityCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalStudyTimeMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastActivityId: {
      type: Schema.Types.ObjectId,
      ref: "StudyActivity",
    },
    lastStudiedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Unique compound index per DATABASE-SCHEMA.md
studyProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const StudyProgress = model<IStudyProgress>(
  "StudyProgress",
  studyProgressSchema,
);
