/**
 * Contributions feature — query key factory.
 */

export const contributionKeys = {
  all: ["contributions"] as const,
  me: () => [...contributionKeys.all, "me"] as const,
};
