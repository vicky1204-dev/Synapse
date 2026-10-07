/**
 * Discussions feature — queries.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchDiscussions,
  fetchDiscussion,
  fetchComments,
} from "./api";
import { discussionKeys } from "./keys";
import type { DiscussionFilters } from "./types";

export function useDiscussions(filters: DiscussionFilters = {}) {
  return useQuery({
    queryKey: discussionKeys.list(filters),
    queryFn: () => fetchDiscussions(filters),
  });
}

export function useDiscussion(id: string) {
  return useQuery({
    queryKey: discussionKeys.detail(id),
    queryFn: () => fetchDiscussion(id),
    enabled: Boolean(id),
  });
}

export function useDiscussionComments(discussionId: string) {
  return useQuery({
    queryKey: discussionKeys.comments(discussionId),
    queryFn: () => fetchComments(discussionId),
    enabled: Boolean(discussionId),
  });
}
