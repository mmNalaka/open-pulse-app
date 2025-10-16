/** biome-ignore-all lint/suspicious/noExplicitAny: ok for this file */
import { expect } from "vitest";

/**
 * Assert successful API response
 */
export function expectSuccessResponse(json: any) {
  expect(json).toBeDefined();
  expect(json.success).toBe(true);
  expect(json.data).toBeDefined();
}

/**
 * Assert error API response
 */
export function expectErrorResponse(json: any, expectedStatus?: number) {
  expect(json).toBeDefined();
  expect(json.success).toBe(false);
  if (expectedStatus) {
    expect(json.statusCode).toBe(expectedStatus);
  }
}

/**
 * Assert HTTP status code
 */
export function expectStatus(status: number, expected: number) {
  expect(status).toBe(expected);
}

/**
 * Assert response structure
 */
export function expectResponseStructure(json: any, expectedKeys: string[]) {
  expectedKeys.forEach((key) => {
    expect(json).toHaveProperty(key);
  });
}
