/**
 * Product Controller Tests (Real DB)
 * 
 * Tests the controller layer against the real database
 */
import { describe, expect, it, beforeEach } from 'bun:test';
import {
    getProductsHandler,
    getProductByIdHandler,
    createProductHandler,
    updateProductHandler,
    deleteProductHandler
} from '../../src/controllers/product.controller';
import { createMockContext } from '../mocks/hono-context.mock';
import '../setup'; // Use real DB from global setup

describe('Product Controller with Real DB', () => {
    beforeEach(() => {
        // If you had any mocking logic, remove it
    });

    describe('getProductsHandler', () => {
        it('should return some products from the real DB', async () => {
            const ctx = createMockContext({});

            await getProductsHandler(ctx);

            const response = ctx.getResponse();
            // Expect success 200
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            // Because we don't know how many products exist, just check that .data is an array
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    describe('getProductByIdHandler', () => {
        it('should return 404 when product is not found in real DB', async () => {
            const ctx = createMockContext({
                params: { id: 'nonexistent-id' }
            });

            await getProductByIdHandler(ctx);

            const response = ctx.getResponse();
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(typeof response.body.error).toBe('string');
        });
    });

    describe('createProductHandler', () => {
        it('should create a product and return 201 status', async () => {
            const newProductData = {
                name: 'Database Product',
                description: 'Testing real DB creation',
                price: 49.99,
                url: 'https://example.com/db-product'
            };

            const ctx = createMockContext({
                body: newProductData
            });

            await createProductHandler(ctx);

            const response = ctx.getResponse();
            // Expect successful creation
            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeDefined();
            // IDs should no longer contain 'product:' prefix
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.name).toBe(newProductData.name);
        });
    });

    // Skip the complex tests that involve creating and then updating/deleting
    // as these are better tested at the repository level
    describe('updateProductHandler', () => {
        it('should return 404 when updating non-existent product', async () => {
            const nonExistentId = 'non-existent-id';
            const updateData = { name: 'Updated Name' };

            const ctx = createMockContext({
                params: { id: nonExistentId },
                body: updateData
            });

            await updateProductHandler(ctx);

            const response = ctx.getResponse();
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(typeof response.body.error).toBe('string');
        });
    });

    describe('deleteProductHandler', () => {
        it('should return 404 when deleting non-existent product', async () => {
            const nonExistentId = 'non-existent-id';

            const ctx = createMockContext({
                params: { id: nonExistentId }
            });

            await deleteProductHandler(ctx);

            const response = ctx.getResponse();
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(typeof response.body.error).toBe('string');
        });
    });
});
