/**
 * StudyActivity model.
 *
 * Implements DATABASE-SCHEMA.md Section 7.
 */

import { Schema, model } from "mongoose";
import type { IStudyActivity } from "./study.types";

const studyActivitySchema = new Schema<IStudyActivity>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
    studyPackId: {
      type: Schema.Types.ObjectId,
      ref: "StudyPack",
      index: true,
    },
    type: {
      type: String,
      enum: ["resource-study", "concept-review", "flashcard", "quiz"],
      required: true,
      default: "resource-study",
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    order: {
      type: Number,
      default: 0,
    },
    content: {
      type: Schema.Types.Mixed,
      default: {},
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

studyActivitySchema.index({ courseId: 1, order: 1 });
studyActivitySchema.index({ courseId: 1, resourceId: 1 });
studyActivitySchema.index({ userId: 1, courseId: 1 });

export const StudyActivity = model<IStudyActivity>(
  "StudyActivity",
  studyActivitySchema,
);
