/** biome-ignore-all lint/nursery/useConsistentTypeDefinitions: false positive */
import { Hono, type Schema } from "hono";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import type { PinoLogger } from "hono-pino";
import { pinoLogger } from "hono-pino";
import onError from "./middlewares/on-error.mw";
import healthRouter from "./modules/health/health.routes";

export interface AppBindings {
  Variables: {
    logger: PinoLogger;
  };
}
/**
 * Create a new app
 *
 * @returns {Hono<AppBindings>}
 */
export function createApp() {
  const app = new Hono<AppBindings>()
    .use(requestId())
    .use(cors())
    .use(pinoLogger())

    .route("/health", healthRouter);

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
export function createTestApp<S extends Schema>(router: Hono<AppBindings, S>) {
  return createApp().route("/", router);
}
