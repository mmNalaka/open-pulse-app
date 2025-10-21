import { createFactory } from "hono/factory";
import type { AppBindings } from "../app";
import { auth } from "../modules/auth/better-auth.config";

const LOGGER_ID = "auth-middleware";

const factory = createFactory<AppBindings>();

export const requireAuth = factory.createMiddleware(async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  c.var.logger.debug({ session }, `${LOGGER_ID}:requireAuth: Session result`);

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});
