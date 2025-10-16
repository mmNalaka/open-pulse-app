import { z } from "zod";

export const pageViewSchema = z.object({
  type: z.literal("pageview"),
  site_id: z.string().min(1),
  hostname: z.string().max(253).optional(),
  pathname: z.string().max(2048).optional(),
  querystring: z.string().max(2048).optional(),
  screenWidth: z.number().int().positive().optional(),
  screenHeight: z.number().int().positive().optional(),
  language: z.string().max(35).optional(),
  page_title: z.string().max(512).optional(),
  referrer: z.string().max(2048).optional(),
  event_name: z.string().max(256).optional(),
  properties: z.string().max(2048).optional(),
  user_id: z.string().max(255).optional(),
  api_key: z.string().max(35).optional(), // rb_ prefix + 32 hex chars
  ip_address: z.string().optional(), // Custom IP for geolocation
  user_agent: z.string().max(512).optional(), // Custom user agent
});

export const customEventSchema = z.object({
  type: z.literal("custom_event"),
  site_id: z.string().min(1),
  hostname: z.string().max(253).optional(),
  pathname: z.string().max(2048).optional(),
  querystring: z.string().max(2048).optional(),
  screenWidth: z.number().int().positive().optional(),
  screenHeight: z.number().int().positive().optional(),
  language: z.string().max(35).optional(),
  page_title: z.string().max(512).optional(),
  referrer: z.string().max(2048).optional(),
  event_name: z.string().min(1).max(256),
  properties: z
    .string()
    .max(2048)
    .refine(
      (val) => {
        try {
          JSON.parse(val);
          return true;
        } catch (_) {
          return false;
        }
      },
      { message: "Properties must be a valid JSON string" }
    )
    .optional(), // Optional but must be valid JSON if present
  user_id: z.string().max(255).optional(),
  api_key: z.string().max(35).optional(), // rb_ prefix + 32 hex chars
  ip_address: z.string().optional(), // Custom IP for geolocation
  user_agent: z.string().max(512).optional(), // Custom user agent
});

export const errorSchema = z.object({
  type: z.literal("error"),
  site_id: z.string().min(1),
  hostname: z.string().max(253).optional(),
  pathname: z.string().max(2048).optional(),
  querystring: z.string().max(2048).optional(),
  screenWidth: z.number().int().positive().optional(),
  screenHeight: z.number().int().positive().optional(),
  language: z.string().max(35).optional(),
  page_title: z.string().max(512).optional(),
  referrer: z.string().max(2048).optional(),
  event_name: z.string().min(1).max(256), // Error type (TypeError, ReferenceError, etc.)
  properties: z
    .string()
    .max(4096) // Larger limit for error details
    .refine(
      (val) => {
        try {
          const parsed = JSON.parse(val);
          // Validate error-specific properties
          if (typeof parsed.message !== "string") return false;
          if (parsed.stack && typeof parsed.stack !== "string") return false;

          // Support both camelCase and lowercase for backwards compatibility
          if (parsed.fileName && typeof parsed.fileName !== "string") return false;

          if (parsed.lineNumber && typeof parsed.lineNumber !== "number") return false;

          if (parsed.columnNumber && typeof parsed.columnNumber !== "number") return false;

          // Apply truncation limits
          if (parsed.message && parsed.message.length > 500) {
            parsed.message = parsed.message.substring(0, 500);
          }
          if (parsed.stack && parsed.stack.length > 2000) {
            parsed.stack = parsed.stack.substring(0, 2000);
          }

          return true;
        } catch (_) {
          return false;
        }
      },
      {
        message:
          "Properties must be valid JSON with error fields (message, stack, fileName, lineNumber, columnNumber)",
      }
    ),
  user_id: z.string().max(255).optional(),
  api_key: z.string().max(35).optional(), // rb_ prefix + 32 hex chars
  ip_address: z.string().optional(), // Custom IP for geolocation
  user_agent: z.string().max(512).optional(), // Custom user agent
});

export const trackingPayloadSchema = z.discriminatedUnion("type", [
  pageViewSchema.strict(),
  customEventSchema.strict(),
  errorSchema.strict(),
]);
