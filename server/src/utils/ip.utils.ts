import type { Context } from "hono";

/**
 * Chain of Responsibility pattern for IP address extraction
 * Each handler tries to extract IP from a specific source
 * If it fails, it delegates to the next handler
 */
type IpExtractor = (ctx: Context) => string | null;

const extractors: IpExtractor[] = [
  // Priority 1: Cloudflare header (already validated by CF)
  (ctx) => {
    const cfIp = ctx.req.header("cf-connecting-ip");
    return cfIp ? cfIp.trim() : null;
  },

  // Priority 2: X-Forwarded-For - use the first IP (original client)
  (ctx): string | null => {
    const forwarded = ctx.req.header("x-forwarded-for");
    if (!forwarded) return null;
    const ips = forwarded
      .split(",")
      .map((ip) => ip.trim())
      .filter(Boolean);
    return ips[0] ?? null;
  },

  // Priority 3: X-Real-IP header
  (ctx) => ctx.req.header("x-real-ip") || null,

  // Fallback: empty string
  () => "",
];

export const getIpAddress = (ctx: Context): string => {
  for (const extractor of extractors) {
    const ip = extractor(ctx);
    if (ip) return ip;
  }
  return "";
};
