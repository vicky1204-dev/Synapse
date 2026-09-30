/**
 * Resources feature types.
 */

export type ResourceType = "pdf" | "word" | "ppt" | "note" | "link";
export type ProcessingStatus = "pending" | "processing" | "ready" | "failed";
export type ResourceVisibility = "public" | "private";

export interface ResourceFile {
  provider?: string;
  publicId?: string;
  url?: string;
  mimeType?: string;
  sizeBytes?: number;
  pageCount?: number;
}

export interface ResourceProcessing {
  status: ProcessingStatus;
  jobId?: string;
  errorCode?: string;
  completedAt?: string;
}

export interface ResourceAiMetadata {
  summary?: string;
  topics: string[];
  tags: string[];
}

export interface Resource {
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
  file?: ResourceFile;
  processing: ResourceProcessing;
  aiMetadata: ResourceAiMetadata;
  visibility: ResourceVisibility;
  isSaved?: boolean;
  coursesCount?: number;
  savesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResourceRequest {
  title: string;
  description?: string;
  type: ResourceType;
  file?: ResourceFile;
  visibility?: ResourceVisibility;
  courseId?: string;
  aiMetadata?: {
    summary?: string;
    topics?: string[];
    tags?: string[];
  };
}

export interface ResourceFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: ResourceType;
  visibility?: ResourceVisibility;
  topic?: string;
  tag?: string;
  courseId?: string;
  uploaderId?: string;
}
