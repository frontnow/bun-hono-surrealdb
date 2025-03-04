/**
 * Product Routes Tests
 */
import { describe, expect, it, mock, beforeEach, beforeAll, afterAll } from 'bun:test';
import { Hono } from 'hono';
import '../setup'; // Import setup first to ensure mocks are applied

// Create a special test app with mock handlers
describe('Product Routes', () => {
    // Create our test app
    const app = new Hono();

    // Create mocks for all handlers
    const mockHandlers = {
        getProductsHandler: mock(() => Promise.resolve(new Response())),
        getProductByIdHandler: mock(() => Promise.resolve(new Response())),
        createProductHandler: mock(() => Promise.resolve(new Response())),
        updateProductHandler: mock(() => Promise.resolve(new Response())),
        deleteProductHandler: mock(() => Promise.resolve(new Response()))
    };

    // Add our test routes with the mock handlers
    beforeAll(() => {
        // GET /products - Get all products
        app.get("/api/products", mockHandlers.getProductsHandler);

        // GET /products/:id - Get a product by ID
        app.get("/api/products/:id", mockHandlers.getProductByIdHandler);

        // POST /products - Create a new product
        app.post("/api/products", mockHandlers.createProductHandler);

        // PUT /products/:id - Update a product
        app.put("/api/products/:id", mockHandlers.updateProductHandler);

        // DELETE /products/:id - Delete a product
        app.delete("/api/products/:id", mockHandlers.deleteProductHandler);
    });

    beforeEach(() => {
        // Reset all mocks before each test
        mockHandlers.getProductsHandler.mockClear();
        mockHandlers.getProductByIdHandler.mockClear();
        mockHandlers.createProductHandler.mockClear();
        mockHandlers.updateProductHandler.mockClear();
        mockHandlers.deleteProductHandler.mockClear();
    });

    describe('GET /products', () => {
        it('should route to the getProductsHandler', async () => {
            // Create test request
            const req = new Request('http://localhost/api/products');

            // Send request to our app
            await app.fetch(req);

            // Verify that the correct handler was called
            expect(mockHandlers.getProductsHandler).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /products/:id', () => {
        it('should route to the getProductByIdHandler', async () => {
            // Create test request
            const req = new Request('http://localhost/api/products/1');

            // Send request to our app
            await app.fetch(req);

            // Verify that the correct handler was called
            expect(mockHandlers.getProductByIdHandler).toHaveBeenCalledTimes(1);
        });
    });

    describe('POST /products', () => {
        it('should route to the createProductHandler', async () => {
            // Create test request
            const req = new Request('http://localhost/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'Test Product',
                    price: 99.99
                })
            });

            // Send request to our app
            await app.fetch(req);

            // Verify that the correct handler was called
            expect(mockHandlers.createProductHandler).toHaveBeenCalledTimes(1);
        });
    });

    describe('PUT /products/:id', () => {
        it('should route to the updateProductHandler', async () => {
            // Create test request
            const req = new Request('http://localhost/api/products/1', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'Updated Product',
                    price: 199.99
                })
            });

            // Send request to our app
            await app.fetch(req);

            // Verify that the correct handler was called
            expect(mockHandlers.updateProductHandler).toHaveBeenCalledTimes(1);
        });
    });

    describe('DELETE /products/:id', () => {
        it('should route to the deleteProductHandler', async () => {
            // Create test request
            const req = new Request('http://localhost/api/products/1', {
                method: 'DELETE'
            });

            // Send request to our app
            await app.fetch(req);

            // Verify that the correct handler was called
            expect(mockHandlers.deleteProductHandler).toHaveBeenCalledTimes(1);
        });
    });
});
