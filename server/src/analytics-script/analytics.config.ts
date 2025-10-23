const isTruthy = (value: string | number | boolean | null | undefined): boolean => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value !== 0 && !Number.isNaN(value);
  }

  if (typeof value === "string") {
    const trimmed = value.trim().toLowerCase();
    return (
      trimmed !== "" &&
      trimmed !== "false" &&
      trimmed !== "0" &&
      trimmed !== "null" &&
      trimmed !== "undefined" &&
      trimmed !== "nan"
    );
  }

  return false;
};

/**
 * Parse the script tag to get the config
 *
 * @param scriptTag - The script tag to parse
 * @returns The config object
 */
export function parseScriptConfig(scriptTag: HTMLScriptElement) {
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

  return {
    debug: isTruthy(debug),
    disabled: isTruthy(disabled),
    analyticsHost,
    siteId,
  };
}
