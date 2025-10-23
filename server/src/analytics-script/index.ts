/** biome-ignore-all lint/nursery/useConsistentTypeDefinitions: false positive */
/** biome-ignore-all lint/suspicious/noEmptyBlockStatements: false positive */
import { parseScriptConfig } from "./analytics.config";
import type { OpenPulseAnalytics } from "./analytics.types";

declare global {
  interface Window {
    __OPEN_PULSE_DISABLED__: boolean;
    openPulse: OpenPulseAnalytics;
  }
}

/**
 *  Main function to setup OpenPulse
 */
(async () => {
  const scriptTag = document.currentScript as HTMLScriptElement;

  // Check if script tag is present
  if (!scriptTag) {
    console.error("OpenPulse script tag not found");
    return;
  }

  //   Check if user has disabled OpenPulse analytics
  if (window.__OPEN_PULSE_DISABLED__) {
    console.log("OpenPulse analytics disabled by user");

    // Crete a mock object for openPulse, this will prevent any errors
    window.openPulse = {
      event: () => {},
      error: () => {},
      pageView: () => {},
    };

    return;
  }

  const config = parseScriptConfig(scriptTag);
  console.log("OpenPulse config", config);

  await Promise.resolve();
})();
