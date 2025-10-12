import { NOT_FOUND } from "@shared/http-status-code";
import { NOT_FOUND as NOT_FOUND_MESSAGE } from "@shared/http-status-messages";
import type { ApiErrorResponse } from "@shared/types/response.types";
import type { NotFoundHandler } from "hono";

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
