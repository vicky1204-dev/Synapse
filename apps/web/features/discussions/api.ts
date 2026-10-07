/**
 * Discussions feature — API client functions.
 */

import { apiClient } from "@/lib/api/client";
import type {
  ApiSuccessResponse,
  ApiPaginatedResponse,
} from "@/lib/api/types";
import type {
  Discussion,
  Comment,
  DiscussionFilters,
  CreateDiscussionRequest,
  UpdateDiscussionRequest,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "./types";

export async function fetchDiscussions(
  filters: DiscussionFilters = {},
): Promise<ApiPaginatedResponse<Discussion>> {
  const searchParams = new URLSearchParams();

  if (filters.page) searchParams.set("page", String(filters.page));
  if (filters.limit) searchParams.set("limit", String(filters.limit));
  if (filters.courseId) searchParams.set("courseId", filters.courseId);
  if (filters.resourceId) searchParams.set("resourceId", filters.resourceId);
  if (filters.authorId) searchParams.set("authorId", filters.authorId);
  if (filters.tag) searchParams.set("tag", filters.tag);
  if (filters.search) searchParams.set("search", filters.search);
  if (filters.status) searchParams.set("status", filters.status);

  return apiClient
    .get("api/v1/discussions", { searchParams })
    .json<ApiPaginatedResponse<Discussion>>();
}

export async function fetchDiscussion(id: string): Promise<Discussion> {
  const res = await apiClient
    .get(`api/v1/discussions/${id}`)
    .json<ApiSuccessResponse<Discussion>>();

  return res.data;
}

export async function createDiscussion(
  data: CreateDiscussionRequest,
): Promise<Discussion> {
  const res = await apiClient
    .post("api/v1/discussions", {
      json: data,
    })
    .json<ApiSuccessResponse<Discussion>>();

  return res.data;
}

export async function updateDiscussion(
  id: string,
  data: UpdateDiscussionRequest,
): Promise<Discussion> {
  const res = await apiClient
    .patch(`api/v1/discussions/${id}`, {
      json: data,
    })
    .json<ApiSuccessResponse<Discussion>>();

  return res.data;
}

export async function deleteDiscussion(id: string): Promise<void> {
  await apiClient.delete(`api/v1/discussions/${id}`).json();
}

export async function fetchComments(
  discussionId: string,
): Promise<Comment[]> {
  const searchParams = new URLSearchParams({ limit: "100" });
  const res = await apiClient
    .get(`api/v1/discussions/${discussionId}/comments`, { searchParams })
    .json<ApiPaginatedResponse<Comment>>();

  return res.data;
}

export async function createComment(
  discussionId: string,
  data: CreateCommentRequest,
): Promise<Comment> {
  const res = await apiClient
    .post(`api/v1/discussions/${discussionId}/comments`, {
      json: data,
    })
    .json<ApiSuccessResponse<Comment>>();

  return res.data;
}

export async function updateComment(
  commentId: string,
  data: UpdateCommentRequest,
): Promise<Comment> {
  const res = await apiClient
    .patch(`api/v1/comments/${commentId}`, {
      json: data,
    })
    .json<ApiSuccessResponse<Comment>>();

  return res.data;
}

export async function deleteComment(commentId: string): Promise<void> {
  await apiClient.delete(`api/v1/comments/${commentId}`).json();
}
