/** biome-ignore-all lint/suspicious/noExplicitAny: false positive */
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
