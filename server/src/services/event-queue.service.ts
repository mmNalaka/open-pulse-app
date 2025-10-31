/**
 * Event Queue Service
 * Handles queuing and batch processing of analytics events to ClickHouse
 * Designed to be compatible with both in-memory and Redis queue backends
 */
/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: <explanation> */

import { clickhouse } from "@/db/clickhouse/clickhouse";
import { logger } from "@/libs/logger";
import { serializeEventForClickHouse } from "@/utils/clickhouse.utils";

export type AnalyticsEvent = {
  timestamp: string;
  site_id: string;
  session_id: string;
  user_id: string | null;
  hostname: string;
  pathname: string;
  querystring: string | null;
  page_title: string | null;
  referrer: string | null;
  referrer_hostname: string | null;
  referrer_pathname: string | null;
  browser: string;
  browser_version: string;
  operating_system: string;
  operating_system_version: string;
  device_type: string;
  screen_width: number;
  screen_height: number;
  country: string;
  region: string;
  city: string | null;
  lat: number | null;
  lon: number | null;
  ip: string | null;
  timezone: string;
  channel: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  type: string;
  event_name: string | null;
  lcp: number | null;
  cls: number | null;
  inp: number | null;
  fcp: number | null;
  ttfb: number | null;
  props: string | null;
};

const LOGGER_ID = "event-queue";

/**
 * Queue interface for abstraction
 * Allows switching between in-memory and Redis implementations
 */
export type EventQueue = {
  add(event: AnalyticsEvent): Promise<void>;
  start(): void;
  stop(): void;
};

/**
 * In-memory event queue implementation
 * Simple queue with batch processing
 * TODO: Replace with Redis queue for production
 */
class InMemoryEventQueue implements EventQueue {
  private readonly queue: AnalyticsEvent[] = [];
  private readonly batchSize = 5;
  private readonly flushInterval = 10_000; // 10 seconds
  private processing = false;
  private intervalId: NodeJS.Timeout | null = null;

  async add(event: AnalyticsEvent): Promise<void> {
    this.queue.push(event);

    // Flush if batch size reached
    if (this.queue.length >= this.batchSize) {
      await this.flush();
    }
  }

  start(): void {
    if (this.intervalId) return;

    logger.info(`${LOGGER_ID}: Starting in-memory event queue`);
    this.intervalId = setInterval(() => this.flush(), this.flushInterval);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      logger.info(`${LOGGER_ID}: Stopped in-memory event queue`);
    }
  }

  private async flush(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    try {
      const batch = this.queue.splice(0, this.batchSize);

      logger.info({ count: batch.length }, `${LOGGER_ID}: Flushing batch to ClickHouse`);

      // Log detailed event structure for debugging
      if (batch.length > 0) {
        const firstEvent = batch[0];
        if (firstEvent) {
          const eventTypes: Record<string, string> = {};
          for (const [key, val] of Object.entries(firstEvent)) {
            eventTypes[key] = typeof val;
          }

          logger.debug(
            {
              event_keys: Object.keys(firstEvent),
              event_types: eventTypes,
              sample_event: JSON.stringify(firstEvent),
            },
            `${LOGGER_ID}: Event structure`
          );
        }
      }

      // Serialize all events for ClickHouse
      const serializedBatch = batch.map(serializeEventForClickHouse);

      // Log sample JSON for debugging
      logger.debug(
        { json_line: JSON.stringify(serializedBatch[0]) },
        `${LOGGER_ID}: Sample event JSON`
      );

      // Insert using the properly serialized objects
      await clickhouse.insert({
        table: "analytics_event",
        values: serializedBatch,
        format: "JSONEachRow",
      });

      logger.info({ count: batch.length }, `${LOGGER_ID}: Successfully inserted batch`);
    } catch (error) {
      const err = error as Record<string, unknown>;
      logger.error(
        {
          error,
          queue_length: this.queue.length,
          error_code: err?.code,
          error_type: err?.type,
          error_message: err?.message,
        },
        `${LOGGER_ID}: Error flushing event queue to ClickHouse`
      );
      // Re-add events to queue on failure
      // TODO: Implement retry logic with exponential backoff
    } finally {
      this.processing = false;
    }
  }
}

/**
 * Event queue singleton
 * TODO: Implement RedisEventQueue for production
 * Usage:
 *   const redisQueue = new RedisEventQueue(redis);
 *   export const eventQueue = redisQueue;
 */
const eventQueue: EventQueue = new InMemoryEventQueue();

// Start queue processing on module load
eventQueue.start();

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info(`${LOGGER_ID}: Received SIGTERM, shutting down queue`);
  eventQueue.stop();
});

export { eventQueue };
