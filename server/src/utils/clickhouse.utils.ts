/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: <explanation> */
import type { AnalyticsEvent } from "@/services/event-queue.service";

/**
 * Format ISO timestamp to ClickHouse DateTime format (yyyy-MM-dd HH:mm:ss)
 * Handles invalid inputs gracefully by returning current timestamp
 *
 * @param isoTimestamp - ISO 8601 timestamp string or Date object
 * @returns Formatted timestamp string in ClickHouse format
 * @throws Never - Returns current time on any error
 */
export function formatTimestamp(isoTimestamp: unknown): string {
  try {
    // Validate input
    if (!isoTimestamp) {
      return formatTimestamp(new Date());
    }

    // Handle Date objects
    let date: Date;
    if (isoTimestamp instanceof Date) {
      date = isoTimestamp;
    } else if (typeof isoTimestamp === "string") {
      date = new Date(isoTimestamp);
    } else {
      // Invalid type, use current time
      date = new Date();
    }

    // Validate date is valid
    if (Number.isNaN(date.getTime())) {
      return formatTimestamp(new Date());
    }

    // Format with zero-padding
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch {
    // Fallback: return current time on any error
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const day = String(now.getUTCDate()).padStart(2, "0");
    const hours = String(now.getUTCHours()).padStart(2, "0");
    const minutes = String(now.getUTCMinutes()).padStart(2, "0");
    const seconds = String(now.getUTCSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}

/**
 * Serialize AnalyticsEvent for ClickHouse JSONEachRow format
 * Ensures all field types match ClickHouse schema exactly
 */
export function serializeEventForClickHouse(event: AnalyticsEvent): Record<string, unknown> {
  return {
    // String fields
    timestamp: formatTimestamp(event.timestamp),
    site_id: String(event.site_id),
    session_id: String(event.session_id),
    user_id: event.user_id ? String(event.user_id) : null,
    hostname: String(event.hostname),
    pathname: String(event.pathname),
    querystring: event.querystring ? String(event.querystring) : null,
    page_title: event.page_title ? String(event.page_title) : null,
    referrer: event.referrer ? String(event.referrer) : null,
    referrer_hostname: event.referrer_hostname ? String(event.referrer_hostname) : null,
    referrer_pathname: event.referrer_pathname ? String(event.referrer_pathname) : null,
    browser: String(event.browser),
    browser_version: String(event.browser_version),
    operating_system: String(event.operating_system),
    operating_system_version: String(event.operating_system_version),
    device_type: String(event.device_type),
    country: String(event.country),
    region: String(event.region),
    city: event.city ? String(event.city) : null,
    ip: event.ip ? String(event.ip) : null,
    timezone: String(event.timezone),
    channel: String(event.channel),
    utm_source: event.utm_source ? String(event.utm_source) : null,
    utm_medium: event.utm_medium ? String(event.utm_medium) : null,
    utm_campaign: event.utm_campaign ? String(event.utm_campaign) : null,
    utm_content: event.utm_content ? String(event.utm_content) : null,
    utm_term: event.utm_term ? String(event.utm_term) : null,
    type: String(event.type),
    event_name: event.event_name ? String(event.event_name) : null,
    props: event.props,
    // Numeric fields
    screen_width: Number(event.screen_width),
    screen_height: Number(event.screen_height),
    lcp: event.lcp !== null ? Number(event.lcp) : null,
    cls: event.cls !== null ? Number(event.cls) : null,
    inp: event.inp !== null ? Number(event.inp) : null,
    fcp: event.fcp !== null ? Number(event.fcp) : null,
    ttfb: event.ttfb !== null ? Number(event.ttfb) : null,
    lat: event.lat !== null ? Number(event.lat) : null,
    lon: event.lon !== null ? Number(event.lon) : null,
  };
}
