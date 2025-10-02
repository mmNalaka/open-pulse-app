// Core API Response Types - Production-ready response interfaces

// Generic success response
export interface ApiSuccessResponse<T = any> {
  success: true;
  message: string;
  data: T;
}

// Error response
export interface ApiErrorResponse {
  success: false;
  message: string;
  errorCode?: string;
  details?: string;
  validationErrors?: Array<{
    field: string;
    message: string;
    code?: string;
  }>;
}

// Pagination information
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Paginated success response
export interface PaginatedApiResponse<T = any> {
  success: true;
  message: string;
  data: T[];
  pagination: PaginationInfo;
}

// Union type for all possible API responses
export type ApiResponse<T = any> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse
  | PaginatedApiResponse<T>;

// Common HTTP status codes for better type safety
export enum HttpStatusCode {
  // Success
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,

  // Client Errors
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,

  // Server Errors
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}