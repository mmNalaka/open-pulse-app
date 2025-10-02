import { Hono, type Schema } from "hono";
import type { PinoLogger } from "hono-pino";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { pinoLogger } from 'hono-pino'
import type { ApiResponse } from "shared/dist";

export interface AppBindings {
  Variables: {
    logger: PinoLogger;
  };
};

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

    .get("/", (c) => c.text("Hello World"))
    .get("/hello", async (c) => {
      const data: ApiResponse<string> = {
        message: "Hello BHVR!",
        success: true,
        data: "Hello BHVR!",
      };

	return c.json(data, { status: 200 });
});

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
