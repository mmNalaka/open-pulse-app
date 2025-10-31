import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatTimestamp } from "@/utils/clickhouse.utils";

const TIMESTAMP_REGEX = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

describe("formatTimestamp", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Valid inputs", () => {
    it("should format ISO 8601 string correctly", () => {
      const result = formatTimestamp("2024-10-31T15:24:43.948Z");
      expect(result).toBe("2024-10-31 15:24:43");
    });

    it("should format ISO 8601 string with milliseconds", () => {
      const result = formatTimestamp("2024-12-25T23:59:59.999Z");
      expect(result).toBe("2024-12-25 23:59:59");
    });

    it("should format Date object correctly", () => {
      const date = new Date("2024-06-15T12:30:45Z");
      const result = formatTimestamp(date);
      expect(result).toBe("2024-06-15 12:30:45");
    });

    it("should handle dates with single-digit months and days", () => {
      const result = formatTimestamp("2024-01-05T09:05:03Z");
      expect(result).toBe("2024-01-05 09:05:03");
    });

    it("should pad single-digit hours, minutes, and seconds", () => {
      const result = formatTimestamp("2024-03-07T01:02:03Z");
      expect(result).toBe("2024-03-07 01:02:03");
    });

    it("should handle leap year dates", () => {
      const result = formatTimestamp("2024-02-29T00:00:00Z");
      expect(result).toBe("2024-02-29 00:00:00");
    });

    it("should handle year boundaries", () => {
      const result = formatTimestamp("2024-12-31T23:59:59Z");
      expect(result).toBe("2024-12-31 23:59:59");
    });

    it("should handle new year", () => {
      const result = formatTimestamp("2025-01-01T00:00:00Z");
      expect(result).toBe("2025-01-01 00:00:00");
    });
  });

  describe("Invalid inputs - should return current time", () => {
    it("should return current time for null", () => {
      const now = new Date("2024-10-31T15:24:43Z");
      vi.setSystemTime(now);

      const result = formatTimestamp(null);
      expect(result).toBe("2024-10-31 15:24:43");
    });

    it("should return current time for undefined", () => {
      const now = new Date("2024-10-31T15:24:43Z");
      vi.setSystemTime(now);

      const result = formatTimestamp(undefined);
      expect(result).toBe("2024-10-31 15:24:43");
    });

    it("should return current time for empty string", () => {
      const now = new Date("2024-10-31T15:24:43Z");
      vi.setSystemTime(now);

      const result = formatTimestamp("");
      expect(result).toBe("2024-10-31 15:24:43");
    });

    it("should return current time for invalid date string", () => {
      const now = new Date("2024-10-31T15:24:43Z");
      vi.setSystemTime(now);

      const result = formatTimestamp("not-a-date");
      expect(result).toBe("2024-10-31 15:24:43");
    });

    it("should return current time for malformed ISO string", () => {
      const now = new Date("2024-10-31T15:24:43Z");
      vi.setSystemTime(now);

      const result = formatTimestamp("2024-13-45T99:99:99Z");
      expect(result).toBe("2024-10-31 15:24:43");
    });

    it("should return current time for number input", () => {
      const now = new Date("2024-10-31T15:24:43Z");
      vi.setSystemTime(now);

      const result = formatTimestamp(12_345);
      expect(result).toBe("2024-10-31 15:24:43");
    });

    it("should return current time for object input", () => {
      const now = new Date("2024-10-31T15:24:43Z");
      vi.setSystemTime(now);

      const result = formatTimestamp({ timestamp: "2024-10-31T15:24:43Z" });
      expect(result).toBe("2024-10-31 15:24:43");
    });

    it("should return current time for array input", () => {
      const now = new Date("2024-10-31T15:24:43Z");
      vi.setSystemTime(now);

      const result = formatTimestamp(["2024-10-31T15:24:43Z"]);
      expect(result).toBe("2024-10-31 15:24:43");
    });

    it("should return current time for Invalid Date object", () => {
      const now = new Date("2024-10-31T15:24:43Z");
      vi.setSystemTime(now);

      const invalidDate = new Date("invalid");
      const result = formatTimestamp(invalidDate);
      expect(result).toBe("2024-10-31 15:24:43");
    });

    it("should return current time for boolean input", () => {
      const now = new Date("2024-10-31T15:24:43Z");
      vi.setSystemTime(now);

      const result = formatTimestamp(true);
      expect(result).toBe("2024-10-31 15:24:43");
    });

    it("should return current time for false input", () => {
      const now = new Date("2024-10-31T15:24:43Z");
      vi.setSystemTime(now);

      const result = formatTimestamp(false);
      expect(result).toBe("2024-10-31 15:24:43");
    });
  });

  describe("Format validation", () => {
    it("should always return format yyyy-MM-dd HH:mm:ss", () => {
      const result = formatTimestamp("2024-10-31T15:24:43Z");
      expect(result).toMatch(TIMESTAMP_REGEX);
    });

    it("should never throw an exception", () => {
      expect(() => formatTimestamp(null)).not.toThrow();
      expect(() => formatTimestamp("invalid")).not.toThrow();
      expect(() => formatTimestamp({})).not.toThrow();
      expect(() => formatTimestamp(Symbol("test"))).not.toThrow();
    });
  });

  describe("Edge cases", () => {
    it("should handle very old dates", () => {
      const result = formatTimestamp("1970-01-01T00:00:00Z");
      expect(result).toBe("1970-01-01 00:00:00");
    });

    it("should handle future dates", () => {
      const result = formatTimestamp("2099-12-31T23:59:59Z");
      expect(result).toBe("2099-12-31 23:59:59");
    });

    it("should handle midnight", () => {
      const result = formatTimestamp("2024-10-31T00:00:00Z");
      expect(result).toBe("2024-10-31 00:00:00");
    });

    it("should handle noon", () => {
      const result = formatTimestamp("2024-10-31T12:00:00Z");
      expect(result).toBe("2024-10-31 12:00:00");
    });

    it("should handle millisecond precision in input", () => {
      const result = formatTimestamp("2024-10-31T15:24:43.123456789Z");
      expect(result).toBe("2024-10-31 15:24:43");
    });

    it("should handle timezone offsets in ISO string", () => {
      const result = formatTimestamp("2024-10-31T15:24:43+05:30");
      // Should still parse and format correctly
      expect(result).toMatch(TIMESTAMP_REGEX);
    });
  });

  describe("Consistency", () => {
    it("should return same format for same input", () => {
      const input = "2024-10-31T15:24:43Z";
      const result1 = formatTimestamp(input);
      const result2 = formatTimestamp(input);
      expect(result1).toBe(result2);
    });

    it("should return same format for equivalent Date objects", () => {
      const date1 = new Date("2024-10-31T15:24:43Z");
      const date2 = new Date("2024-10-31T15:24:43Z");
      const result1 = formatTimestamp(date1);
      const result2 = formatTimestamp(date2);
      expect(result1).toBe(result2);
    });
  });
});
