import type { TrackingConfig } from "./analytics.types";

/**
 * Tracker class to track events
 */
export class Tracker {
  private readonly config: TrackingConfig;
  private userId: string | null = null;

  constructor(config: TrackingConfig) {
    this.config = Object.freeze(config);
    this.setUserId();
  }

  /**
   * Set the user id from local storage
   */
  private setUserId(): void {
    try {
      const localUserId = localStorage?.getItem("open_pulse_user_id");
      if (localUserId) {
        this.userId = localUserId;
        return;
      }
    } catch (error) {
      if (this.config.debug) {
        console.error("Failed to set user id", error);
      }
      this.userId = null;
    }
  }

  pageView() {
    const { siteId, debug, analyticsHost } = this.config;

    const payload = {
      site_id: siteId,
      event: "page_view",
      ...(this.userId && { user_id: this.userId }),
      properties: {
        path: window.location.pathname,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
      },
    };

    if (debug) {
      console.log("Page view event", payload);
    }

    fetch(`${analyticsHost}/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }
}
