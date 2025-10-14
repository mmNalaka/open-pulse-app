import type { cors } from "hono/cors";

// CORS configuration
type CORSOptions = Parameters<typeof cors>[0];
export const CorsConfig: CORSOptions = {
  origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173", "http://localhost:3000"],
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
