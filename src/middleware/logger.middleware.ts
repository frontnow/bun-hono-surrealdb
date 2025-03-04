/**
 * Logger Middleware
 * 
 * Provides logging for HTTP requests and responses
 */
import { MiddlewareHandler } from "hono";
import { isDevelopment } from "../config/environment";

/**
 * Fancy console logger middleware with color coding
 */
export const fancyLoggerMiddleware = (): MiddlewareHandler => {
    // ANSI color codes
    const reset = "\x1b[0m";
    const bright = "\x1b[1m";
    const dim = "\x1b[2m";

    const black = "\x1b[30m";
    const red = "\x1b[31m";
    const green = "\x1b[32m";
    const yellow = "\x1b[33m";
    const blue = "\x1b[34m";
    const magenta = "\x1b[35m";
    const cyan = "\x1b[36m";
    const white = "\x1b[37m";

    // Background colors
    const bgGreen = "\x1b[42m";
    const bgYellow = "\x1b[43m";
    const bgRed = "\x1b[41m";
    const bgBlue = "\x1b[44m";

    return async (c, next) => {
        const method = c.req.method;
        const path = c.req.path;

        // Get colorized method
        const getMethodColor = (method: string) => {
            switch (method) {
                case "GET":
                    return `${bright}${green}${method}${reset}`;
                case "POST":
                    return `${bright}${blue}${method}${reset}`;
                case "PUT":
                    return `${bright}${yellow}${method}${reset}`;
                case "DELETE":
                    return `${bright}${red}${method}${reset}`;
                case "PATCH":
                    return `${bright}${magenta}${method}${reset}`;
                case "OPTIONS":
                    return `${bright}${cyan}${method}${reset}`;
                default:
                    return `${bright}${white}${method}${reset}`;
            }
        };

        // Get status code color
        const getStatusColor = (status: number) => {
            if (status >= 500) {
                return `${bgRed}${bright}${black} ${status} ${reset}`;
            } else if (status >= 400) {
                return `${bgYellow}${bright}${black} ${status} ${reset}`;
            } else if (status >= 300) {
                return `${bgBlue}${bright}${black} ${status} ${reset}`;
            } else if (status >= 200) {
                return `${bgGreen}${bright}${black} ${status} ${reset}`;
            } else {
                return `${bright} ${status} ${reset}`;
            }
        };

        // Log the request
        console.log(
            `${dim}[${new Date().toISOString()}]${reset} ${cyan}⟹${reset}  ${getMethodColor(
                method
            )} ${path}`
        );

        const startTime = Date.now();
        await next();
        const endTime = Date.now();
        const duration = endTime - startTime;

        // Get response status
        const status = c.res.status;

        // Log the response
        console.log(
            `${dim}[${new Date().toISOString()}]${reset} ${green}⟸${reset}  ${getMethodColor(
                method
            )} ${path} ${getStatusColor(status)} ${dim}${duration}ms${reset}`
        );
    };
};

/**
 * Simple logger middleware for production environments
 */
export const simpleLoggerMiddleware = (): MiddlewareHandler => {
    return async (c, next) => {
        const method = c.req.method;
        const path = c.req.path;

        const startTime = Date.now();
        console.log(`[${new Date().toISOString()}] ${method} ${path}`);

        await next();

        const endTime = Date.now();
        const duration = endTime - startTime;
        const status = c.res.status;

        console.log(`[${new Date().toISOString()}] ${method} ${path} ${status} ${duration}ms`);
    };
};

/**
 * Logger middleware factory that returns the appropriate logger based on environment
 */
export const loggerMiddleware = (): MiddlewareHandler => {
    return isDevelopment() ? fancyLoggerMiddleware() : simpleLoggerMiddleware();
};
