import { Hono } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AppBindings } from "@/app";
import { trackEventHandler } from "@/modules/track/track.handlers";
import { createUnitTestApp, makeRequest, parseJsonResponse } from "../utils/test-app";

// Mock the dependencies
vi.mock("@/repositories/site.repo", () => ({
  getSiteConfig: vi.fn(async () => ({
    id: "site_1",
    name: "Test Site",
    domain: "example.com",
  })),
}));

vi.mock("@/services/session.service", () => ({
  createOrUpdateSession: vi.fn(async () => ({
    id: "se_test_session_123",
    siteId: "site_1",
    userId: null,
    startTime: new Date(),
    lastActivity: new Date(),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
}));

vi.mock("@/services/event-queue.service", () => ({
  eventQueue: {
    add: vi.fn(async () => {
      // Mock implementation - do nothing
    }),
  },
}));

describe("Integration: Track Endpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const router = new Hono<AppBindings>().post("/track", ...trackEventHandler);
  const app = createUnitTestApp(router);

  it("should accept a minimal valid pageview payload", async () => {
    const res = await makeRequest(app, "/track", {
      method: "POST",
      body: { type: "pageview", site_id: "site_1" },
    });

    expect(res.status).toBe(200);
    const json = await parseJsonResponse(res);
    expect(json).not.toBeNull();
    expect((json as Record<string, unknown>).success).toBe(true);
    expect(((json as Record<string, unknown>).data as Record<string, unknown>)?.type).toBe(
      "pageview"
    );
  });

  it("should reject invalid payload (missing site_id)", async () => {
    const res = await makeRequest(app, "/track", {
      method: "POST",
      body: { type: "pageview" },
    });

    expect(res.status).toBe(400);
  });

  it("should accept a valid custom_event with JSON properties string", async () => {
    const res = await makeRequest(app, "/track", {
      method: "POST",
      body: {
        type: "custom_event",
        site_id: "site_1",
        event_name: "signup",
        properties: JSON.stringify({ plan: "pro", step: 1 }),
      },
    });

    expect(res.status).toBe(200);
    const json = await parseJsonResponse(res);
    expect(json).not.toBeNull();
    expect((json as Record<string, unknown>).success).toBe(true);
    expect(((json as Record<string, unknown>).data as Record<string, unknown>)?.type).toBe(
      "custom_event"
    );
    expect(((json as Record<string, unknown>).data as Record<string, unknown>)?.event_name).toBe(
      "signup"
    );
  });

  it("should reject custom_event with invalid JSON properties string", async () => {
    const res = await makeRequest(app, "/track", {
      method: "POST",
      body: {
        type: "custom_event",
        site_id: "site_1",
        event_name: "signup",
        properties: "{invalid-json}",
      },
    });

    expect(res.status).toBe(400);
  });

  it("should accept an error payload with properties JSON", async () => {
    const res = await makeRequest(app, "/track", {
      method: "POST",
      body: {
        type: "error",
        site_id: "site_1",
        event_name: "TypeError",
        properties: JSON.stringify({ message: "boom", stack: "at line 1" }),
      },
    });

    expect(res.status).toBe(200);
    const json = await parseJsonResponse(res);
    expect(json).not.toBeNull();
    expect((json as Record<string, unknown>).success).toBe(true);
    expect(((json as Record<string, unknown>).data as Record<string, unknown>)?.type).toBe("error");
  });

  it("should reject if unknown payload type", async () => {
    const res = await makeRequest(app, "/track", {
      method: "POST",
      body: {
        type: "unknown",
        site_id: "site_1",
        event_name: "TypeError",
        properties: JSON.stringify({ message: "boom", stack: "at line 1" }),
      },
    });

    expect(res.status).toBe(400);
  });
});
