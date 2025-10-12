import { INTERNAL_SERVER_ERROR, OK } from "@shared/http-status-code";
import { INTERNAL_SERVER_ERROR as INTERNAL_SERVER_ERROR_MESSAGE } from "@shared/http-status-messages";
import type { ApiErrorResponse } from "@shared/types/response.types";
import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

const onError: ErrorHandler = (err, c) => {
  const currentStatus = "status" in err ? err.status : c.newResponse(null).status;
  const env = c.env?.NODE_ENV || process.env?.NODE_ENV;
  const statusCode =
    currentStatus !== OK ? (currentStatus as ContentfulStatusCode) : INTERNAL_SERVER_ERROR;

  return c.json<ApiErrorResponse>(
    {
      success: false,
      errorCode: INTERNAL_SERVER_ERROR_MESSAGE,
      message: err.message,
      details: env === "production" ? undefined : err.stack,
    },
    statusCode
  );
};

export default onError;
