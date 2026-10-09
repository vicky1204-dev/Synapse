/**
 * Contributions feature — domain types.
 */

import type { Resource } from "@/features/resources/types";
import type { Discussion } from "@/features/discussions/types";

export interface UserContributionsSummary {
  uploadedResourcesCount: number;
  createdDiscussionsCount: number;
  totalCommentsCount: number;
  totalSavesReceived: number;
}

export interface UserContributionsResponse {
  summary: UserContributionsSummary;
  uploadedResources: Resource[];
  createdDiscussions: Discussion[];
}
