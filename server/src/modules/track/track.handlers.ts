import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import { HttpStatusCode } from "shared/dist/http-status-code";
import { HttpStatusCodeMessage } from "shared/dist/http-status-messages";
import type { ApiSuccessResponse } from "shared/dist/types/response.types";
import { trackingPayloadSchema } from "./track.schema";

const factory = createFactory();

export const trackEventHandler = factory.createHandlers(
  zValidator("json", trackingPayloadSchema),
  (c) => {
    const validatedData = c.req.valid("json");

    return c.json<ApiSuccessResponse>(
      {
        success: true,
        message: HttpStatusCodeMessage.OK,
        data: validatedData,
      },
      HttpStatusCode.OK
    );
  }
);
