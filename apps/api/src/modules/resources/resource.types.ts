/**
 * Resource module types and DTOs.
 */

import type { Document, Types } from "mongoose";

export const RESOURCE_TYPES = [
  "pdf",
  "word",
  "ppt",
  "note",
  "link",
] as const;
export type ResourceType = (typeof RESOURCE_TYPES)[number];

export const PROCESSING_STATUSES = [
  "pending",
  "processing",
  "ready",
  "failed",
] as const;
export type ProcessingStatus = (typeof PROCESSING_STATUSES)[number];

export const RESOURCE_VISIBILITIES = ["public", "private"] as const;
export type ResourceVisibility = (typeof RESOURCE_VISIBILITIES)[number];

// ---------------------------------------------------------------------------
// File & Metadata interfaces
// ---------------------------------------------------------------------------

export interface IResourceFile {
  provider?: string;
  publicId?: string;
  url?: string;
  mimeType?: string;
  sizeBytes?: number;
  pageCount?: number;
}

export interface IProcessing {
  status: ProcessingStatus;
  jobId?: string;
  errorCode?: string;
  completedAt?: Date;
}

export interface IAiMetadata {
  summary?: string;
  topics: string[];
  tags: string[];
}

// ---------------------------------------------------------------------------
// Document interfaces
// ---------------------------------------------------------------------------

export interface IResource extends Document {
  _id: Types.ObjectId;
  uploaderId: Types.ObjectId;
  title: string;
  description?: string;
  type: ResourceType;
  file?: IResourceFile;
  processing: IProcessing;
  aiMetadata: IAiMetadata;
  visibility: ResourceVisibility;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICourseResource extends Document {
  _id: Types.ObjectId;
  courseId: Types.ObjectId;
  resourceId: Types.ObjectId;
  addedBy: Types.ObjectId;
  position?: number;
  createdAt: Date;
}

export interface ISavedResource extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  resourceId: Types.ObjectId;
  createdAt: Date;
}

// ---------------------------------------------------------------------------
// DTOs & Responses
// ---------------------------------------------------------------------------

export interface CreateResourceDto {
  title: string;
  description?: string;
  type: ResourceType;
  file?: IResourceFile;
  visibility?: ResourceVisibility;
  courseId?: string;
  aiMetadata?: {
    summary?: string;
    topics?: string[];
    tags?: string[];
  };
}

export interface UpdateResourceDto {
  title?: string;
  description?: string;
  visibility?: ResourceVisibility;
  aiMetadata?: {
    summary?: string;
    topics?: string[];
    tags?: string[];
  };
}

export interface QueryResourcesDto {
  page?: number;
  limit?: number;
  search?: string;
  type?: ResourceType;
  visibility?: ResourceVisibility;
  topic?: string;
  tag?: string;
  uploaderId?: string;
  courseId?: string;
}

export interface ResourceResponse {
  id: string;
  uploaderId: string;
  uploader?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  title: string;
  description?: string;
  type: ResourceType;
  file?: IResourceFile;
  processing: {
    status: ProcessingStatus;
    jobId?: string;
    errorCode?: string;
    completedAt?: string;
  };
  aiMetadata: {
    summary?: string;
    topics: string[];
    tags: string[];
  };
  visibility: ResourceVisibility;
  isSaved?: boolean;
  coursesCount?: number;
  savesCount?: number;
  createdAt: string;
  updatedAt: string;
}
