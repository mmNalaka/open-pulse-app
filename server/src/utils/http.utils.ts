import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { HttpStatusCode } from "shared/dist/http-status-code";
import {
  HttpStatusCodeMessage,
  HttpStatusCodeMessageMapping,
} from "shared/dist/http-status-messages";
import type { ApiErrorResponse, ApiSuccessResponse } from "shared/dist/types/response.types";

type SuccessResponseOptions = {
  message?: keyof typeof HttpStatusCodeMessage | string;
  statusCode?: ContentfulStatusCode;
};

type ErrorResponseOptions = {
  errorCode?: string;
  details?: string;
  validationErrors?: Array<{
    field: string;
    message: string;
    code?: string;
  }>;
};

/**
 * Sends a standardized success response with optional custom message and status code.
 *
 * @param c - The Hono context object
 * @param data - The response payload data
 * @param options - Optional configuration
 * @param options.message - Custom message or HttpStatusCodeMessage key (defaults to OK)
 * @param options.statusCode - HTTP status code (defaults to 200 OK)
 * @returns JSON response with success flag, message, and data
 *
 * @example
 * ```ts
 * // Using default message and status code
 * return successResponse(c, { id: 1, name: "John" });
 *
 * // Using custom message and status code
 * return successResponse(c, { id: 1 }, {
 *   message: "CREATED",
 *   statusCode: HttpStatusCode.CREATED
 * });
 * ```
 */
export const successResponse = <T>(c: Context, data: T, options: SuccessResponseOptions = {}) => {
  const { message = HttpStatusCodeMessage.OK, statusCode = HttpStatusCode.OK } = options;

  const m =
    message in HttpStatusCodeMessage
      ? HttpStatusCodeMessage[message as keyof typeof HttpStatusCodeMessage]
      : message;
  return c.json<ApiSuccessResponse<T>>(
    {
      success: true,
      message: m,
      data,
    },
    statusCode
  );
};

/**
 * Sends a standardized error response with optional error details.
 * If no message is provided, automatically maps the HTTP status code to a standard message.
 *
 * @param c - The Hono context object
 * @param statusCode - HTTP status code
 * @param message - Optional custom error message or HttpStatusCodeMessage key (auto-resolved from statusCode if not provided)
 * @param options - Optional error details
 * @param options.errorCode - Machine-readable error code
 * @param options.details - Additional error details
 * @param options.validationErrors - Array of validation errors with field information
 * @returns JSON response with success flag set to false and error information
 *
 * @example
 * ```ts
 * // Basic error response with auto-mapped message
 * return errorResponse(c, HttpStatusCode.NOT_FOUND);
 *
 * // With custom message
 * return errorResponse(c, HttpStatusCode.NOT_FOUND, "Resource not found");
 *
 * // With error code and details
 * return errorResponse(c, HttpStatusCode.BAD_REQUEST, "VALIDATION_ERROR", {
 *   errorCode: "VALIDATION_ERROR",
 *   details: "Invalid request payload"
 * });
 *
 * // With validation errors
 * return errorResponse(c, HttpStatusCode.BAD_REQUEST, "VALIDATION_ERROR", {
 *   errorCode: "VALIDATION_ERROR",
 *   validationErrors: [
 *     { field: "email", message: "Invalid email format" },
 *     { field: "age", message: "Must be at least 18" }
 *   ]
 * });
 * ```
 */
export const errorResponse = (
  c: Context,
  statusCode: (typeof HttpStatusCode)[keyof typeof HttpStatusCode],
  message?: string,
  options: ErrorResponseOptions = {}
) => {
  const messageCode = message ?? HttpStatusCodeMessageMapping[statusCode];

  const m =
    messageCode in HttpStatusCodeMessage
      ? HttpStatusCodeMessage[messageCode as keyof typeof HttpStatusCodeMessage]
      : messageCode;

  const response: ApiErrorResponse = {
    success: false,
    message: m,
  };

  if (options.errorCode) {
    response.errorCode = options.errorCode;
  }

  if (options.details) {
    response.details = options.details;
  }

  if (options.validationErrors) {
    response.validationErrors = options.validationErrors;
  }

  return c.json<ApiErrorResponse>(response, statusCode as ContentfulStatusCode);
};
