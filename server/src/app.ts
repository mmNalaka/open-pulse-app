/** biome-ignore-all lint/nursery/useConsistentTypeDefinitions: false positive */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import type { PinoLogger } from "hono-pino";
import { pinoLogger } from "hono-pino";
import { CorsConfig } from "./config/app.config";
import notFound from "./middlewares/not-found.mw";
import onError from "./middlewares/on-error.mw";
import authRouter from "./modules/auth/auth.router";
import type { auth } from "./modules/auth/better-auth.config";
import healthRouter from "./modules/health/health.routes";
import siteRouter from "./modules/sites/site.routers";
import { analyticsScriptHandler } from "./modules/track/script.handlers";
import { trackEventHandler } from "./modules/track/track.handlers";

export interface AppBindings {
  Variables: {
    logger: PinoLogger;
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}

/**
 * Create a new app
 *
 * @returns {Hono<AppBindings>}
 */
export function createApp() {
  const app = new Hono<AppBindings>()
    // Middlewares
    .use(requestId())
    .use(cors(CorsConfig))
    .use(pinoLogger())

    // tracking script
    .get("/analytics.js", ...analyticsScriptHandler)
    .post("/track", ...trackEventHandler)

    // Routes
    .route("/api/health", healthRouter)
    .route("/api/auth", authRouter)
    .route("/api/sites", siteRouter);

  // Error handlers
  app.notFound(notFound);
  app.onError(onError);

  return app;
}

/**
 * Create a test app with a router
 *  This is useful for testing the app with a router
 * Example:
 * const userRouter = new Hono()
 * userRouter.get("/", (c) => c.text("Hello World"))
 * const app = createTestApp(userRouter);
 */
export function createTestApp(router: Hono<AppBindings>) {
  return new Hono<AppBindings>().use(requestId()).use(cors()).use(pinoLogger()).route("/", router);
}
