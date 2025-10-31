import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import type { AppBindings } from "@/app";
import { getSiteConfig } from "@/repositories/site.repo";
import { eventQueue } from "@/services/event-queue.service";
import { createOrUpdateSession } from "@/services/session.service";
import { NotFoundError } from "@/utils/app-error";
import { successResponse } from "@/utils/http.utils";
import { trackingPayloadSchema } from "./track.schema";
import { createBasePayload, transformToAnalyticsEvent } from "./track.utils";

const LOGGER_ID = "track-handlers";
const factory = createFactory<AppBindings>();

/**
 * Track event handler
 * This the main handler for tracking events
 */
export const trackEventHandler = factory.createHandlers(
  // TODO: Add api key validation middleware
  // TODO: Add rate limiting middleware
  // TODO: Add ip blocking middleware
  zValidator("json", trackingPayloadSchema),
  async (c) => {
    const validatedPayload = c.req.valid("json");
    const { site_id, user_id, ip_address, user_agent } = validatedPayload;

    const siteConfig = await getSiteConfig(site_id);

    if (!siteConfig) {
      c.var.logger.debug(
        { site_id, validatedPayload },
        `${LOGGER_ID}:trackEventHandler: Site not found`
      );
      throw new NotFoundError("Site not found");
    }

    const basePayload = createBasePayload(c, validatedPayload);

    // Create or update active session (identified by siteId and userId)
    const session = await createOrUpdateSession(site_id, {
      userId: user_id,
      ipAddress: ip_address,
      userAgent: user_agent,
    });

    // Transform and add to analytics_event queue
    if (session) {
      const analyticsEvent = transformToAnalyticsEvent(basePayload, session.id);
      await eventQueue.add(analyticsEvent);
    }

    return successResponse(c, {
      type: validatedPayload.type,
      site_id,
      session_id: session?.id,
    });
  }
);
