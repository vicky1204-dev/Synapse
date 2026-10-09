/**
 * Saved feature types.
 */

import type { ResourceType } from "@/features/resources/types";

export interface SavedResourceQuery {
  page?: number;
  limit?: number;
  search?: string;
  type?: ResourceType | "all";
}
