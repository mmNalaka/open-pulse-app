import type { NotFoundHandler } from "hono";
import { NOT_FOUND } from "shared/dist/http-status-code";
import { NOT_FOUND as NOT_FOUND_MESSAGE } from "shared/dist/http-status-messages";
import type { ApiErrorResponse } from "shared/dist/types/response.types";

const notFound: NotFoundHandler = (c) =>
  c.json<ApiErrorResponse>(
    {
      success: false,
      message: NOT_FOUND_MESSAGE,
      errorCode: NOT_FOUND_MESSAGE,
    },
    NOT_FOUND
  );

export default notFound;
