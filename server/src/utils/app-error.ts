import { HttpStatusCode } from "shared/dist/http-status-code";

export const ErrorCode = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  CONFLICT: "CONFLICT",
  DATABASE_ERROR: "DATABASE_ERROR",
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export class AppError extends Error {
  statusCode: (typeof HttpStatusCode)[keyof typeof HttpStatusCode];
  code: (typeof ErrorCode)[keyof typeof ErrorCode];
  details?: string;

  constructor(
    message: string,
    statusCode: (typeof HttpStatusCode)[keyof typeof HttpStatusCode] = HttpStatusCode.INTERNAL_SERVER_ERROR,
    code: (typeof ErrorCode)[keyof typeof ErrorCode] = ErrorCode.INTERNAL_ERROR,
    details?: string
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: string) {
    super(message, HttpStatusCode.BAD_REQUEST, ErrorCode.VALIDATION_ERROR, details);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, details?: string) {
    super(message, HttpStatusCode.NOT_FOUND, ErrorCode.NOT_FOUND, details);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, details?: string) {
    super(message, HttpStatusCode.UNAUTHORIZED, ErrorCode.UNAUTHORIZED, details);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string, details?: string) {
    super(message, HttpStatusCode.FORBIDDEN, ErrorCode.FORBIDDEN, details);
    this.name = "ForbiddenError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: string) {
    super(message, HttpStatusCode.CONFLICT, ErrorCode.CONFLICT, details);
    this.name = "ConflictError";
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: string) {
    super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, ErrorCode.DATABASE_ERROR, details);
    this.name = "DatabaseError";
  }
}

export class ExternalServiceError extends AppError {
  constructor(message: string, details?: string) {
    super(message, HttpStatusCode.BAD_GATEWAY, ErrorCode.EXTERNAL_SERVICE_ERROR, details);
    this.name = "ExternalServiceError";
  }
}

export const isAppError = (error: unknown): error is AppError => error instanceof AppError;
