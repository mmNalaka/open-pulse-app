/** biome-ignore-all lint/suspicious/noExplicitAny: false positive */
import type { TrackingPayload } from "@/modules/track/track.schema";

export type OpenPulseAnalytics = {
  event: (event: string, properties?: Record<string, unknown>) => void;
  error: (event: string, properties?: Record<string, unknown>) => void;
  pageView: (event: string, properties?: Record<string, unknown>) => void;
};

export type TrackingConfig = {
  disabled: boolean;
  siteId: string;
  debug: boolean;
  analyticsHost: string;
};

// Event types
export type BaseEventPayload = Pick<
  TrackingPayload,
  | "site_id"
  | "session_id"
  | "hostname"
  | "pathname"
  | "querystring"
  | "screenWidth"
  | "screenHeight"
  | "language"
  | "page_title"
  | "referrer"
  | "user_id"
  | "api_key"
  | "ip_address"
  | "user_agent"
>;

export type PageViewPayload = BaseEventPayload & {
  type: "pageview";
};

export type CustomEventPayload = BaseEventPayload & {
  type: "custom_event";
  event_name: string;
  properties: Record<string, unknown>;
};

export type ErrorPayload = BaseEventPayload & {
  type: "error";
  event_name: string;
  properties: Record<string, unknown>;
};
