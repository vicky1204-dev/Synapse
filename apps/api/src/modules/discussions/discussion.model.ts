/**
 * Discussion model.
 *
 * Reddit-like contextual threads associated with Courses, Resources, or general topics.
 * Strictly adheres to docs/engineering/DATABASE-SCHEMA.md.
 */

import { Schema, model } from "mongoose";
import {
  DISCUSSION_STATUSES,
  type IDiscussion,
} from "./discussion.types";

const discussionSchema = new Schema<IDiscussion>(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      index: true,
    },
    resourceId: {
      type: Schema.Types.ObjectId,
      ref: "Resource",
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: DISCUSSION_STATUSES,
      default: "published",
      index: true,
    },
    commentCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

// Compound and query indexes per DATABASE-SCHEMA.md
discussionSchema.index({ courseId: 1, createdAt: -1 });
discussionSchema.index({ resourceId: 1, createdAt: -1 });
discussionSchema.index({ authorId: 1, createdAt: -1 });
discussionSchema.index({ status: 1, createdAt: -1 });
discussionSchema.index({ createdAt: -1 });
discussionSchema.index({ tags: 1 });

// Text index for search
discussionSchema.index(
  {
    title: "text",
    body: "text",
    tags: "text",
  },
  {
    weights: {
      title: 5,
      tags: 3,
      body: 1,
    },
    name: "discussion_text_search",
  },
);

export const Discussion = model<IDiscussion>("Discussion", discussionSchema);
