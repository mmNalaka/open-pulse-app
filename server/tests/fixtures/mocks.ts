import { vi } from "vitest";

export const createMockLogger = () => ({
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});

export const createMockContext = () => ({
  req: {
    header: vi.fn(),
    query: vi.fn(),
    param: vi.fn(),
  },
  json: vi.fn(),
  text: vi.fn(),
  status: vi.fn().mockReturnThis(),
});
