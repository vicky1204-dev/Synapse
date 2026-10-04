/**
 * Resource model.
 *
 * Represents uploaded documents, notes, videos, audio, and links in the shared knowledge layer.
 * Strictly adheres to docs/engineering/DATABASE-SCHEMA.md.
 */

import { Schema, model } from "mongoose";
import {
  RESOURCE_TYPES,
  PROCESSING_STATUSES,
  RESOURCE_VISIBILITIES,
  type IResource,
} from "./resource.types";

const resourceSchema = new Schema<IResource>(
  {
    uploaderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    type: {
      type: String,
      enum: RESOURCE_TYPES,
      required: true,
      index: true,
    },
    file: {
      provider: { type: String, trim: true },
      publicId: { type: String, trim: true },
      url: { type: String, trim: true },
      mimeType: { type: String, trim: true },
      sizeBytes: { type: Number, min: 0 },
      pageCount: { type: Number, min: 0 },
    },
    processing: {
      status: {
        type: String,
        enum: PROCESSING_STATUSES,
        default: "ready",
        index: true,
      },
      jobId: { type: String, trim: true },
      errorCode: { type: String, trim: true },
      completedAt: { type: Date },
    },
    aiMetadata: {
      summary: { type: String, trim: true },
      topics: {
        type: [String],
        default: [],
      },
      tags: {
        type: [String],
        default: [],
      },
    },
    visibility: {
      type: String,
      enum: RESOURCE_VISIBILITIES,
      default: "public",
      index: true,
    },
  },
  { timestamps: true },
);

// Compound indexes
resourceSchema.index({ visibility: 1, createdAt: -1 });
resourceSchema.index({ uploaderId: 1, createdAt: -1 });
resourceSchema.index({ "aiMetadata.topics": 1 });
resourceSchema.index({ "aiMetadata.tags": 1 });

// Text index for search
resourceSchema.index(
  {
    title: "text",
    description: "text",
    "aiMetadata.topics": "text",
    "aiMetadata.tags": "text",
  },
  {
    weights: {
      title: 10,
      "aiMetadata.topics": 5,
      "aiMetadata.tags": 5,
      description: 2,
    },
    name: "resource_text_search",
  },
);

export const Resource = model<IResource>("Resource", resourceSchema);
