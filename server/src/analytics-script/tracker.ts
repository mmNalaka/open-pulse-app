import type { EventType, TrackingPayload } from "@/modules/track/track.schema";
import type { BaseEventPayload, TrackingConfig } from "./analytics.types";

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
   * Internal logger - only logs if debug mode is enabled
   */
  private readonly logger = {
    log: (...args: unknown[]) => {
      if (this.config.debug) console.log(...args);
    },
    error: (...args: unknown[]) => {
      if (this.config.debug) console.error(...args);
    },
    warn: (...args: unknown[]) => {
      if (this.config.debug) console.warn(...args);
    },
    debug: (...args: unknown[]) => {
      if (this.config.debug) console.debug(...args);
    },
  };

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
      this.logger.error("Failed to set user id", error);
      this.userId = null;
    }
  }

  private createBasePayload(): BaseEventPayload {
    const url = new URL(window.location.href);
    let pathname = url.pathname;
    const querystring = url.search;

    // For hash bases SPA we need to extract the path from the hash
    if (url?.hash?.startsWith("#/")) {
      pathname = url.hash.replace("#", "");
    }

    return {
      site_id: this.config.siteId,
      pathname,
      querystring,
      hostname: url.hostname,
      referrer: document.referrer,
      language: navigator.language,
      page_title: document.title,
      screenWidth: screen.width,
      screenHeight: screen.height,
      ...(this.userId ? { user_id: this.userId } : {}),
    };
  }

  /**
   * Dispatch an event to the server
   *
   * @param payload - The payload to dispatch
   */
  async dispatchEvent(payload: TrackingPayload) {
    try {
      const response = await fetch(`${this.config.analyticsHost}/track`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        this.logger.error("Failed to dispatch event", response);
      }
    } catch (error) {
      this.logger.error("Failed to dispatch event", error);
    }
  }

  /**
   * Track an event
   *
   * @param eventType - The type of event to track
   * @event_name - The name of the event for custom events
   * @param properties - The properties of the event
   *
   * @returns {Promise<void>}
   */
  async track(
    eventType: EventType,
    event_name?: string,
    properties?: Record<string, unknown>
  ): Promise<void> {
    const isCustomEvent = eventType === "custom_event";
    const hasEventName = !event_name;
    if (isCustomEvent && !hasEventName) {
      this.logger.error('Event name is required for type "custom_event"');
      return;
    }

    const payload = {
      ...this.createBasePayload(),
      type: eventType,
      event_name,
      properties,
    } as TrackingPayload;

    await this.dispatchEvent(payload);
  }
}
