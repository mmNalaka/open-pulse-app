// Constants
export const API_KEY_RATE_LIMIT_TIME_WINDOW = 60_000; // 1 minute in milliseconds
export const DEFAULT_MAX_DURATION_SECONDS = 3600;
export const NEW_USER_TIME_WINDOW = 60_000; // 1 minute in milliseconds

export const OrganizationStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  ONBOARDING: "onboarding",
  SUSPENDED: "suspended",
} as const;
