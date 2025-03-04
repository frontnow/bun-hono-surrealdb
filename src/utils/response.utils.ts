/**
 * Response utilities
 * 
 * Provides standardized response formats for API endpoints
 */

/**
 * Standard success response format
 * @param data Response data
 * @returns Formatted success response object
 */
export const createSuccessResponse = <T>(data: T) => {
    return {
        success: true,
        data
    };
};

/**
 * Standard error response format
 * @param message Error message
 * @param statusCode HTTP status code
 * @returns Formatted error response object
 */
export const createErrorResponse = (message: string, statusCode: number = 500) => {
    return {
        success: false,
        error: message,
        statusCode
    };
};

/**
 * Standard paginated response format
 * @param data Array of items
 * @param total Total number of items
 * @param limit Items per page
 * @param offset Pagination offset
 * @returns Formatted paginated response
 */
export const createPaginatedResponse = <T>(
    data: T[],
    total: number,
    limit?: number | null,
    offset?: number | null
) => {
    const limitNum = limit ?? null;
    const offsetNum = offset ?? null;

    return {
        success: true,
        data,
        pagination: {
            total,
            limit: limitNum,
            offset: offsetNum,
            hasMore: limitNum !== null ? (offsetNum || 0) + limitNum < total : false
        }
    };
};
