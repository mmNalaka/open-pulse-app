import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import { HttpStatusCode } from "shared/dist/http-status-code";
import { getSiteConfig } from "@/repositories/site.repos";
import { errorResponse, successResponse } from "@/utils/http.utils";
import { trackingPayloadSchema } from "./track.schema";

const factory = createFactory();

export const trackEventHandler = factory.createHandlers(
  zValidator("json", trackingPayloadSchema),
  async (c) => {
    const validatedData = c.req.valid("json");
    const { site_id } = validatedData;

    const siteConfig = await getSiteConfig(site_id);

    if (!siteConfig) {
      return errorResponse(c, HttpStatusCode.NOT_FOUND);
    }

    return successResponse(c, validatedData);
  }
);
