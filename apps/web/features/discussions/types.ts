/**
 * Discussions feature types.
 */

export interface DiscussionAuthorInfo {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface DiscussionContextInfo {
  course?: {
    id: string;
    title: string;
    code?: string;
  };
  resource?: {
    id: string;
    title: string;
    type: string;
  };
}

export interface Discussion {
  id: string;
  authorId: string;
  author?: DiscussionAuthorInfo;
  courseId?: string;
  resourceId?: string;
  context?: DiscussionContextInfo;
  title: string;
  body: string;
  tags: string[];
  status: "published" | "hidden" | "deleted";
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  discussionId: string;
  authorId: string;
  author?: DiscussionAuthorInfo;
  parentCommentId?: string;
  body: string;
  status: "published" | "hidden" | "deleted";
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionFilters {
  courseId?: string;
  resourceId?: string;
  authorId?: string;
  tag?: string;
  search?: string;
  status?: "published" | "hidden" | "deleted" | "all";
  page?: number;
  limit?: number;
}

export interface CreateDiscussionRequest {
  title: string;
  body: string;
  courseId?: string;
  resourceId?: string;
  tags?: string[];
}

export interface UpdateDiscussionRequest {
  title?: string;
  body?: string;
  tags?: string[];
  status?: "published" | "hidden" | "deleted";
}

export interface CreateCommentRequest {
  body: string;
  parentCommentId?: string;
}

export interface UpdateCommentRequest {
  body: string;
}
