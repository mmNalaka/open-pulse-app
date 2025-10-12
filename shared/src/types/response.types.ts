// Core API Response Types - Production-ready response interfaces

// Generic success response
export type ApiSuccessResponse<T = unknown> = {
  success: true;
  message: string;
  data: T;
};

// Error response
export type ApiErrorResponse = {
  success: false;
  message: string;
  errorCode?: string;
  details?: string;
  validationErrors?: Array<{
    field: string;
    message: string;
    code?: string;
  }>;
};

// Pagination information
export type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

// Paginated success response
export type PaginatedApiResponse<T = unknown> = {
  success: true;
  message: string;
  data: T[];
  pagination: PaginationInfo;
};

// Union type for all possible API responses
export type ApiResponse<T = unknown> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse
  | PaginatedApiResponse<T>;
