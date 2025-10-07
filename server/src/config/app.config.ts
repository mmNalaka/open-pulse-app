import type { cors } from "hono/cors";

// CORS configuration
type CORSOptions = Parameters<typeof cors>[0];
export const CORS_CONFIG: CORSOptions = {
  origin: process.env.CORS_ORIGIN || '',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
