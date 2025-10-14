import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { INTERNAL_SERVER_ERROR, OK } from "shared/dist/http-status-code";
import { HttpStatusCodeMessage } from "shared/dist/http-status-messages";
import type { ApiErrorResponse } from "shared/dist/types/response.types";

const onError: ErrorHandler = (err, c) => {
  const currentStatus = "status" in err ? err.status : c.newResponse(null).status;
  const env = c.env?.NODE_ENV || process.env?.NODE_ENV;
  const statusCode =
    currentStatus !== OK ? (currentStatus as ContentfulStatusCode) : INTERNAL_SERVER_ERROR;

  return c.json<ApiErrorResponse>(
    {
      success: false,
      errorCode: HttpStatusCodeMessage.INTERNAL_SERVER_ERROR,
      message: err.message,
      details: env === "production" ? undefined : err.stack,
    },
    statusCode
  );
};

export default onError;
