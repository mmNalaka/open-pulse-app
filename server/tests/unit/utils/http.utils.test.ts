import { HttpStatusCode } from "shared/dist/http-status-code";
import { HttpStatusCodeMessage } from "shared/dist/http-status-messages";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { errorResponse, successResponse } from "../../../src/utils/http.utils";

describe("Unit: successResponse", () => {
  let mockContext: any;

  beforeEach(() => {
    mockContext = {
      json: vi.fn((data, status) => ({
        data,
        status,
      })),
    };
  });

  describe("default behavior", () => {
    it("should return success response with default message and status code", () => {
      const testData = { id: 1, name: "John" };
      const result = successResponse(mockContext, testData);

      expect(mockContext.json).toHaveBeenCalledWith(
        {
          success: true,
          message: HttpStatusCodeMessage.OK,
          data: testData,
        },
        HttpStatusCode.OK
      );
      expect(result.status).toBe(HttpStatusCode.OK);
    });

    it("should return success flag as true", () => {
      successResponse(mockContext, {});
      const callArgs = mockContext.json.mock.calls[0][0];

      expect(callArgs.success).toBe(true);
    });
  });

  describe("data handling", () => {
    it("should include provided data in response", () => {
      const testData = { id: 1, name: "John", email: "john@example.com" };
      successResponse(mockContext, testData);

      const callArgs = mockContext.json.mock.calls[0][0];
      expect(callArgs.data).toEqual(testData);
    });
  });

  describe("combined options", () => {
    it("should handle both custom message and status code", () => {
      const options = {
        message: "Resource Created",
        statusCode: HttpStatusCode.CREATED,
      };
      successResponse(mockContext, { id: 1 }, options);

      expect(mockContext.json).toHaveBeenCalledWith(
        {
          success: true,
          message: "Resource Created",
          data: { id: 1 },
        },
        HttpStatusCode.CREATED
      );
    });

    it("should handle message enum key with custom status code", () => {
      const options = {
        message: "ACCEPTED",
        statusCode: HttpStatusCode.ACCEPTED,
      };
      successResponse(mockContext, { status: "pending" }, options);

      const callArgs = mockContext.json.mock.calls[0][0];
      expect(callArgs.message).toBe(HttpStatusCodeMessage.ACCEPTED);
      expect(mockContext.json).toHaveBeenCalledWith(expect.any(Object), HttpStatusCode.ACCEPTED);
    });
  });

  describe("response structure", () => {
    it("should always include success, message, and data fields", () => {
      successResponse(mockContext, { test: "data" });

      const callArgs = mockContext.json.mock.calls[0][0];
      expect(callArgs).toHaveProperty("success");
      expect(callArgs).toHaveProperty("message");
      expect(callArgs).toHaveProperty("data");
      expect(Object.keys(callArgs).length).toBe(3);
    });
  });
});

describe("Unit: errorResponse", () => {
  let mockContext: any;

  beforeEach(() => {
    mockContext = {
      json: vi.fn((data, status) => ({
        data,
        status,
      })),
    };
  });

  it("should return error response with auto-mapped message from status code", () => {
    errorResponse(mockContext, HttpStatusCode.NOT_FOUND);

    const callArgs = mockContext.json.mock.calls[0][0];
    expect(callArgs.success).toBe(false);
    expect(callArgs.message).toBe(HttpStatusCodeMessage.NOT_FOUND);
  });

  it("should use custom message when provided", () => {
    errorResponse(mockContext, HttpStatusCode.BAD_REQUEST, "Custom Error");

    const callArgs = mockContext.json.mock.calls[0][0];
    expect(callArgs.message).toBe("Custom Error");
  });

  it("should include error options when provided", () => {
    errorResponse(mockContext, HttpStatusCode.BAD_REQUEST, undefined, {
      errorCode: "VALIDATION_ERROR",
      details: "Invalid input",
      validationErrors: [{ field: "email", message: "Required" }],
    });

    const callArgs = mockContext.json.mock.calls[0][0];
    expect(callArgs.errorCode).toBe("VALIDATION_ERROR");
    expect(callArgs.details).toBe("Invalid input");
    expect(callArgs.validationErrors).toHaveLength(1);
  });

  it("should not include optional fields when not provided", () => {
    errorResponse(mockContext, HttpStatusCode.NOT_FOUND);

    const callArgs = mockContext.json.mock.calls[0][0];
    expect(callArgs).not.toHaveProperty("errorCode");
    expect(callArgs).not.toHaveProperty("details");
    expect(callArgs).not.toHaveProperty("validationErrors");
  });
});
