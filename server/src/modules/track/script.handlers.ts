import { readFileSync } from "node:fs";
import { createFactory } from "hono/factory";

const factory = createFactory();

const analyticsScript = readFileSync("src/analytics-script/analytics.js", "utf8");

export const analyticsScriptHandler = factory.createHandlers(async (c) =>
  c.text(analyticsScript, 200, {
    "Content-Type": "application/javascript",
  })
);
