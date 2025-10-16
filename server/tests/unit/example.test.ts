import { describe, it, expect, vi } from "vitest";

/**
 * Example unit test
 * This demonstrates how to structure unit tests
 */
describe("Unit: Example", () => {
  it("should demonstrate a simple unit test", () => {
    const add = (a: number, b: number) => a + b;
    expect(add(2, 3)).toBe(5);
  });

  it("should demonstrate mocking", () => {
    const mockFn = vi.fn().mockReturnValue("mocked");
    expect(mockFn()).toBe("mocked");
    expect(mockFn).toHaveBeenCalled();
  });

  it("should demonstrate async testing", async () => {
    const asyncFn = async () => "result";
    const result = await asyncFn();
    expect(result).toBe("result");
  });
});
