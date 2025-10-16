import { describe, expect, it } from "vitest";
import { createIntegrationTestApp, makeRequest, parseJsonResponse } from "../utils/test-app";

describe("Integration: Health Routes", () => {
  const app = createIntegrationTestApp();

  it("should return 200 and success status from GET /api/health/health", async () => {
    const res = await makeRequest(app, "/api/health/health");

    expect(res.status).toBe(200);
    const json = await parseJsonResponse(res);
    expect(json).not.toBeNull();
    expect((json as Record<string, unknown>).success).toBe(true);
    expect(((json as Record<string, unknown>).data as Record<string, unknown>)?.status).toBe("ok");
  });

  it("should return 200 from GET /api/health/ready", async () => {
    const res = await makeRequest(app, "/api/health/ready");

    expect(res.status).toBe(200);
  });

  it("should return 200 from GET /api/health/metrics", async () => {
    const res = await makeRequest(app, "/api/health/metrics");

    expect(res.status).toBe(200);
  });
});
