/**
 * CourseResource model.
 *
 * Join collection expressing many-to-many relationships between Courses and Resources.
 * Strictly adheres to docs/engineering/DATABASE-SCHEMA.md.
 */

import { Schema, model } from "mongoose";
import type { ICourseResource } from "./resource.types";

const courseResourceSchema = new Schema<ICourseResource>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    resourceId: {
      type: Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
      index: true,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    position: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// Prevent adding the same resource to a course multiple times
courseResourceSchema.index({ courseId: 1, resourceId: 1 }, { unique: true });
courseResourceSchema.index({ courseId: 1, createdAt: -1 });

export const CourseResource = model<ICourseResource>(
  "CourseResource",
  courseResourceSchema,
);
