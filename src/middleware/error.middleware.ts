/**
 * Error Middleware
 * 
 * Provides centralized error handling for the application
 */
import { Context, MiddlewareHandler, Next } from "hono";
import { createErrorResponse } from "../utils/response.utils";

/**
 * Known HTTP errors that can be handled specifically
 */
export class HttpError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = "HttpError";
    }
}

/**
 * Not Found error (404)
 */
export class NotFoundError extends HttpError {
    constructor(message = "Resource not found") {
        super(404, message);
        this.name = "NotFoundError";
    }
}

/**
 * Bad Request error (400)
 */
export class BadRequestError extends HttpError {
    constructor(message = "Bad request") {
        super(400, message);
        this.name = "BadRequestError";
    }
}

/**
 * Unauthorized error (401)
 */
export class UnauthorizedError extends HttpError {
    constructor(message = "Unauthorized") {
        super(401, message);
        this.name = "UnauthorizedError";
    }
}

/**
 * Forbidden error (403)
 */
export class ForbiddenError extends HttpError {
    constructor(message = "Forbidden") {
        super(403, message);
        this.name = "ForbiddenError";
    }
}

/**
 * Internal Server Error (500)
 */
export class InternalServerError extends HttpError {
    constructor(message = "Internal server error") {
        super(500, message);
        this.name = "InternalServerError";
    }
}

/**
 * Error handler middleware
 * Handles errors thrown in routes and returns appropriate JSON responses
 */
export const errorMiddleware = (): MiddlewareHandler => {
    return async (c: Context, next: Next) => {
        try {
            await next();
        } catch (error) {
            console.error("Error caught by middleware:", error);

            if (error instanceof HttpError) {
                // Handle known HTTP errors
                const response = createErrorResponse(error.message, error.status);
                return c.json(response, error.status as any);
            }

            // Handle validation errors and other known types differently if needed

            // Generic error response for unknown errors
            const response = createErrorResponse(
                error instanceof Error ? error.message : "Internal server error",
                500
            );
            return c.json(response, 500 as any);
        }
    };
};

/**
 * Not found handler for undefined routes
 */
export const notFoundHandler = (c: Context) => {
    const response = createErrorResponse("Route not found", 404);
    return c.json(response, 404 as any);
};
