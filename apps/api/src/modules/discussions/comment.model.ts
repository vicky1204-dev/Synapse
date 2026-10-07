/**
 * Comment model.
 *
 * Reddit-like threaded comments supporting 1-level or multi-level nested replies on Discussions.
 * Strictly adheres to docs/engineering/DATABASE-SCHEMA.md.
 */

import { Schema, model } from "mongoose";
import {
  COMMENT_STATUSES,
  type IComment,
} from "./discussion.types";

const commentSchema = new Schema<IComment>(
  {
    discussionId: {
      type: Schema.Types.ObjectId,
      ref: "Discussion",
      required: true,
      index: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      index: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    status: {
      type: String,
      enum: COMMENT_STATUSES,
      default: "published",
      index: true,
    },
  },
  { timestamps: true },
);

// Indexes per DATABASE-SCHEMA.md
commentSchema.index({ discussionId: 1, createdAt: 1 });
commentSchema.index({ discussionId: 1, parentCommentId: 1, createdAt: 1 });
commentSchema.index({ authorId: 1, createdAt: -1 });

export const Comment = model<IComment>("Comment", commentSchema);
