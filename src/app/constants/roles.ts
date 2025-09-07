
export const ROLES = {
  USER: "USER",
  AGENT: "AGENT",
  ADMIN: "ADMIN",
} as const;

export const ALL_ROLES = [ROLES.USER, ROLES.AGENT, ROLES.ADMIN] as const;
export type UserRole = (typeof ALL_ROLES)[number];
