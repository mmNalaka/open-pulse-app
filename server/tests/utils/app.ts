import type { Hono } from "hono";
import type { AppBindings } from "../../src/app";
import { createApp, createTestApp } from "../../src/app";

export function makeApp() {
  return createApp();
}

export function makeAppWithRouter(router: Hono<AppBindings>) {
  return createTestApp(router);
}
