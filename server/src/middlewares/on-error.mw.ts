import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { INTERNAL_SERVER_ERROR } from "shared/dist/http-status-code";
import { HttpStatusCodeMessage } from "shared/dist/http-status-messages";
import type { ApiErrorResponse } from "shared/dist/types/response.types";
import { isAppError } from "@/utils/app-error";

const onError: ErrorHandler = (err, c) => {
  const env = c.env?.NODE_ENV || process.env?.NODE_ENV;
  const isDevelopment = env !== "production";

  if (isAppError(err)) {
    return c.json<ApiErrorResponse>(
      {
        success: false,
        errorCode: err.code,
        message: err.message,
        details: isDevelopment ? err.details : undefined,
      },
      err.statusCode as ContentfulStatusCode
    );
  }

  const statusCode = "status" in err ? (err.status as ContentfulStatusCode) : INTERNAL_SERVER_ERROR;

  return c.json<ApiErrorResponse>(
    {
      success: false,
      errorCode: HttpStatusCodeMessage.INTERNAL_SERVER_ERROR,
      message: err instanceof Error ? err.message : "An unexpected error occurred",
      details: isDevelopment && err instanceof Error ? err.stack : undefined,
    },
    statusCode
  );
};

export default onError;
