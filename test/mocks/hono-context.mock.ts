/**
 * Mock Hono Context for testing
 */
import { Context } from 'hono';
import { mock } from 'bun:test';

// Extend the Context type to include our testing utilities
export interface MockContext extends Context {
    getResponse: () => { body: any; status: number };
}

/**
 * Create a mock Hono Context for testing controller functions
 */
export const createMockContext = (options: {
    params?: Record<string, string>;
    query?: Record<string, string>;
    body?: any;
    headers?: Record<string, string>;
}): MockContext => {
    const { params = {}, query = {}, body = {}, headers = {} } = options;

    // Track response data
    let responseBody: any = null;
    let responseStatus = 200;

    // Create mock request
    const req = {
        param: mock((key: string) => params[key] || null),
        query: mock((key: string) => query[key] || null),
        json: mock(() => Promise.resolve(body)),
        header: mock((key: string) => headers[key] || null),
    };

    // Track response data
    const getResponse = () => ({
        body: responseBody,
        status: responseStatus
    });

    // Create context with all needed mocks
    const context = {
        req,
        // Important: json method can set both body and status
        json: mock((data: any, status?: number) => {
            responseBody = data;
            if (status !== undefined) {
                responseStatus = status;
            }
            return context;
        }),
        // Status setter
        status: mock((code: number) => {
            responseStatus = code;
            return context;
        }),
        // Body setter
        body: mock((data: any) => {
            responseBody = data;
            return context;
        }),
        // Access the response for testing
        getResponse
    } as unknown as MockContext;

    return context;
};
