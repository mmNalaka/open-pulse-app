import type { TrackingConfig } from "./analytics.types";
import { isTruthy } from "./analytics.utils";

/**
 * Parse the script tag to get the config
 *
 * @param scriptTag - The script tag to parse
 * @returns The config object
 */
export function parseScriptConfig(scriptTag: HTMLScriptElement): TrackingConfig | null {
  // Parse the src attribute to get the config
  const src = scriptTag.getAttribute("src");
  if (!src) {
    console.error("OpenPulse script tag must have a src attribute");
    return null;
  }

  const debug = scriptTag.getAttribute("data-debug");
  const disabled = scriptTag.getAttribute("data-disabled");
  const analyticsHost = scriptTag.getAttribute("data-analytics-host");
  const siteId = scriptTag.getAttribute("data-site-id");

  if (!(analyticsHost && siteId)) {
    console.error("OpenPulse script tag must have a analyticsHost and siteId attribute");
    return null;
  }

  return {
    debug: isTruthy(debug),
    disabled: isTruthy(disabled),
    analyticsHost,
    siteId,
  };
}
