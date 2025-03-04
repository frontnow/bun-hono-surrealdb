/**
 * Mock SurrealDB for testing
 * 
 * Provides a mock implementation of SurrealDB for unit testing
 */
import { mock } from 'bun:test';

// Mock database data for testing
export const mockProducts = [
    {
        id: 'product:1',
        name: 'Test Product 1',
        description: 'Description for test product 1',
        price: 99.99,
        url: 'https://example.com/product1',
        brand: 'brand:1',
        brands: [
            {
                id: 'brand:1',
                name: 'Test Brand 1'
            }
        ]
    },
    {
        id: 'product:2',
        name: 'Test Product 2',
        description: 'Description for test product 2',
        price: 49.99,
        url: 'https://example.com/product2',
        brand: 'brand:2',
        brands: [
            {
                id: 'brand:2',
                name: 'Test Brand 2'
            }
        ]
    },
    {
        id: 'product:3',
        name: 'Test Product 3',
        price: 149.99,
        url: 'https://example.com/product3',
        brands: []
    }
];

export const mockBrands = [
    {
        id: 'brand:1',
        name: 'Test Brand 1'
    },
    {
        id: 'brand:2',
        name: 'Test Brand 2'
    }
];

// Create a mock class for SurrealDB
export class MockSurreal {
    // Mock query method
    query = mock((query: string) => {
        console.log('Mock query called with:', query);

        // Handle different query patterns
        if (query.includes('FROM product')) {
            return Promise.resolve([mockProducts]);
        } else if (query.includes('FROM product:')) {
            const idMatch = query.match(/product:([a-zA-Z0-9]+)/);
            if (idMatch) {
                const id = 'product:' + idMatch[1];
                const product = mockProducts.find(p => p.id === id);
                return Promise.resolve(product ? [[product]] : [[]]);
            }
        }

        return Promise.resolve([[]]);
    });

    // Mock create method
    create = mock((table: string, data: any) => {
        console.log(`Mock create called for ${table}:`, data);
        const newId = `${table}:new-test-id`;
        const newProduct = {
            ...data,
            id: newId,
            url: data.url || `https://example.com/${table}-test`
        };
        return Promise.resolve([newProduct]);
    });

    // Mock merge (update) method
    merge = mock((id: string, data: any) => {
        console.log(`Mock merge called for ${id}:`, data);
        const tableId = id.split(':');
        if (tableId.length !== 2) return Promise.resolve(null);

        const existingItemIndex = mockProducts.findIndex(p => p.id === id);
        if (existingItemIndex >= 0) {
            const updatedItem = {
                ...mockProducts[existingItemIndex],
                ...data
            };
            return Promise.resolve([updatedItem]);
        }

        return Promise.resolve(null);
    });

    // Mock delete method
    delete = mock((id: string) => {
        console.log(`Mock delete called for ${id}`);
        const existingItemIndex = mockProducts.findIndex(p => p.id === id);
        if (existingItemIndex >= 0) {
            return Promise.resolve([{ id }]);
        }

        return Promise.resolve([]);
    });

    // Mock connect method
    connect = mock(() => {
        console.log('Mock connect called');
        return Promise.resolve();
    });

    // Mock signin method
    signin = mock(() => {
        console.log('Mock signin called');
        return Promise.resolve();
    });

    // Mock close method
    close = mock(() => {
        console.log('Mock close called');
        return Promise.resolve();
    });
}

// Instance of the mock database
export const mockDB = new MockSurreal();
