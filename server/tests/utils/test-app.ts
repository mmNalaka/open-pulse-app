import type { Hono } from "hono";
import type { AppBindings } from "../../src/app";
import { createApp, createTestApp } from "../../src/app";

/**
 * Create a full app instance for integration tests
 */
export function createIntegrationTestApp() {
  return createApp();
}

/**
 * Create a test app with a specific router for unit/isolated tests
 */
export function createUnitTestApp(router: Hono<AppBindings>) {
  return createTestApp(router);
}

/**
 * Helper to make HTTP requests in tests
 */
export function makeRequest(
  app: Hono<AppBindings>,
  path: string,
  options?: {
    method?: string;
    headers?: Record<string, string>;
    body?: Record<string, unknown>;
  }
) {
  const body = options?.body ? JSON.stringify(options.body) : undefined;
  const headers = {
    "content-type": "application/json",
    ...options?.headers,
  };

  return app.request(path, {
    method: options?.method || "GET",
    headers,
    body,
  });
}

/**
 * Helper to parse JSON response
 */
export async function parseJsonResponse(
  response: Response
): Promise<Record<string, unknown> | null> {
  try {
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}
