/**
 * Subject model.
 *
 * Represents canonical subjects in the catalog.
 * Subjects prevent every onboarding user from inventing slightly different strings.
 */

import { Schema, model } from "mongoose";
import type { ISubject } from "./subject.types";

const subjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Indexes
subjectSchema.index({ slug: 1 }, { unique: true });
subjectSchema.index({ active: 1, name: 1 });

export const Subject = model<ISubject>("Subject", subjectSchema);
