import type { PaginationInfo } from "shared/dist/types/response.types";

/**
 * Calculates pagination metadata from page, limit, and total count
 */
export const calculatePagination = (
  page: number,
  limit: number,
  total: number
): PaginationInfo => {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
};
