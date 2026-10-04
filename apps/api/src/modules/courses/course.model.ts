/**
 * Course model.
 *
 * Container for personal academic courses as specified in DATABASE-SCHEMA.md.
 */

import { Schema, model, type Document, type Types } from "mongoose";

export interface ICourse extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  ownerId: Types.ObjectId;
  subjectId?: Types.ObjectId;
  code?: string;
  department?: string;
  semester?: string;
  year?: number;
  cover: {
    color: string;
    icon?: string;
  };
  source: "onboarding" | "user";
  status: "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
    },
    code: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    department: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    semester: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    year: {
      type: Number,
      min: 1900,
      max: 2100,
    },
    cover: {
      color: {
        type: String,
        required: true,
        default: "#3072FF",
      },
      icon: {
        type: String,
      },
    },
    source: {
      type: String,
      enum: ["onboarding", "user"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true },
);

// Compound indexes
courseSchema.index({ ownerId: 1, status: 1 });
courseSchema.index({ ownerId: 1, subjectId: 1 });
courseSchema.index({ ownerId: 1, createdAt: -1 });

export const Course = model<ICourse>("Course", courseSchema);
