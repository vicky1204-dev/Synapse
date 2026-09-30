/**
 * SavedResource model.
 *
 * Tracks bookmarks/saves of resources by individual users.
 * Strictly adheres to docs/engineering/DATABASE-SCHEMA.md.
 */

import { Schema, model } from "mongoose";
import type { ISavedResource } from "./resource.types";

const savedResourceSchema = new Schema<ISavedResource>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    resourceId: {
      type: Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// Prevent duplicate saves
savedResourceSchema.index({ userId: 1, resourceId: 1 }, { unique: true });
savedResourceSchema.index({ userId: 1, createdAt: -1 });

export const SavedResource = model<ISavedResource>(
  "SavedResource",
  savedResourceSchema,
);
