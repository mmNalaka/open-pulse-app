import type { Context } from "hono";
import type { AppBindings } from "@/app";
import type { AnalyticsEvent } from "@/services/event-queue.service";
import { getIpAddress } from "@/utils/ip.utils";
import type { TrackingPayload } from "./track.schema";

/**
 * Create a base payload for tracking events
 * This is used to create a common payload for all tracking events
 */
export const createBasePayload = (c: Context<AppBindings>, payload: TrackingPayload) => ({
  ...payload,
  timestamp: new Date().toISOString(),
  ip_address: payload.ip_address || getIpAddress(c),
  user_agent: payload.user_agent || c.req.header("user-agent") || "",
});

/**
 * Transform tracking payload to AnalyticsEvent for ClickHouse
 * Handles field name conversion and provides defaults for missing fields
 * Ensures all fields match ClickHouse schema types exactly
 */
export const transformToAnalyticsEvent = (
  payload: ReturnType<typeof createBasePayload>,
  sessionId: string
): AnalyticsEvent => {
  return {
    timestamp: payload.timestamp,
    site_id: payload.site_id,
    session_id: sessionId,
    user_id: payload.user_id || null,
    hostname: payload.hostname || "unknown",
    pathname: payload.pathname || "/",
    querystring: payload.querystring || null,
    page_title: payload.page_title || null,
    referrer: payload.referrer || null,
    referrer_hostname: null, // TODO: Parse from referrer
    referrer_pathname: null, // TODO: Parse from referrer
    browser: "unknown", // TODO: Parse from user_agent
    browser_version: "0", // TODO: Parse from user_agent
    operating_system: "unknown", // TODO: Parse from user_agent
    operating_system_version: "0", // TODO: Parse from user_agent
    device_type: "unknown", // TODO: Detect from user_agent
    screen_width: payload.screenWidth || 0,
    screen_height: payload.screenHeight || 0,
    country: "XX", // FixedString(2) - must be exactly 2 chars. TODO: Geolocate from IP
    region: "unknown", // TODO: Geolocate from IP
    city: null, // TODO: Geolocate from IP
    lat: null, // TODO: Geolocate from IP
    lon: null, // TODO: Geolocate from IP
    ip: payload.ip_address || null,
    timezone: "UTC", // TODO: Detect from user_agent or IP
    channel: "direct", // TODO: Parse from referrer
    utm_source: null, // TODO: Parse from querystring
    utm_medium: null, // TODO: Parse from querystring
    utm_campaign: null, // TODO: Parse from querystring
    utm_content: null, // TODO: Parse from querystring
    utm_term: null, // TODO: Parse from querystring
    type: payload.type,
    event_name: payload.event_name || null,
    lcp: null, // TODO: Extract from properties
    cls: null, // TODO: Extract from properties
    inp: null, // TODO: Extract from properties
    fcp: null, // TODO: Extract from properties
    ttfb: null, // TODO: Extract from properties
    props: payload.properties ? JSON.stringify(payload.properties) : null,
  };
};
