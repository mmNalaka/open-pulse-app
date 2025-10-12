import { Hono } from "hono";

const healthRouter = new Hono()
  .get("/health", (c) => c.json({ status: "ok" }))
  .get("/ready", (c) => c.json({ status: "ok" }))
  .get("/metrics", (c) => c.json({ status: "ok" }));

export default healthRouter;
