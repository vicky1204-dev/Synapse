/**
 * Profile feature — query key factory.
 */

export const profileKeys = {
  all: ["profile"] as const,
  me: () => [...profileKeys.all, "me"] as const,
};
