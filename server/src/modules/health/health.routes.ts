import { Hono } from "hono";
import { healthHandler, metricsHandler, readyHandler } from "./health.handlers";

const healthRouter = new Hono()
  .get("/health", healthHandler)
  .get("/ready", readyHandler)
  .get("/metrics", metricsHandler);

export default healthRouter;
