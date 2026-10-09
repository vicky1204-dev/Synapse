/**
 * Saved feature query key factory.
 */

import type { SavedResourceQuery } from "./types";

export const savedKeys = {
  all: ["saved"] as const,
  list: (params?: SavedResourceQuery) =>
    [...savedKeys.all, "list", params ?? {}] as const,
};
