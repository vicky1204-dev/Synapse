/**
 * Auth feature — query keys.
 *
 * Centralised key registry for all auth-related TanStack Query keys.
 * Using an object factory ensures cache operations (invalidate, set, remove)
 * are consistent across the codebase.
 *
 * Convention:
 *   authKeys.all        → every auth query
 *   authKeys.me()       → current user
 */

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};
