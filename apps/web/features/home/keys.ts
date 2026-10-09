/**
 * Home dashboard feature — Query key factory.
 */

export const homeKeys = {
  all: ["home"] as const,
  dashboard: () => [...homeKeys.all, "dashboard"] as const,
};
