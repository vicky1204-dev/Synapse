/**
 * Discussions feature query key factory.
 */

import type { DiscussionFilters } from "./types";

export const discussionKeys = {
  all: ["discussions"] as const,
  lists: () => [...discussionKeys.all, "list"] as const,
  list: (filters: DiscussionFilters = {}) =>
    [...discussionKeys.lists(), filters] as const,
  details: () => [...discussionKeys.all, "detail"] as const,
  detail: (id: string) => [...discussionKeys.details(), id] as const,
  comments: (discussionId: string) =>
    [...discussionKeys.detail(discussionId), "comments"] as const,
};
