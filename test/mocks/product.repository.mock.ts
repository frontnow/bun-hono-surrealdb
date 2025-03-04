/**
 * Mock Product Repository for Testing
 * 
 * This file provides controlled mock implementations of the repository functions
 * for more reliable testing of error cases.
 */
import { Product } from '../../src/models/product.model';
import { mockProducts } from './db.mock';

// Store original module for normal operation
import * as originalRepo from '../../src/repositories/product.repository';

// Error simulation switch
let shouldThrowError = false;

// Toggle error simulation 
export const simulateError = (shouldError: boolean) => {
    shouldThrowError = shouldError;
};

// Mock implementations with controlled error handling
export const getAllProducts = async (limit?: number, offset?: number) => {
    if (shouldThrowError) {
        throw new Error('Database error');
    }

    return originalRepo.getAllProducts(limit, offset);
};

export const getProductById = async (id: string) => {
    if (shouldThrowError) {
        throw new Error('Database error');
    }

    return originalRepo.getProductById(id);
};

export const createProduct = async (productData: Omit<Product, 'id'>) => {
    if (shouldThrowError) {
        throw new Error('Database error');
    }

    return originalRepo.createProduct(productData);
};

export const updateProduct = async (id: string, productData: Partial<Product>) => {
    if (shouldThrowError) {
        throw new Error('Database error');
    }

    return originalRepo.updateProduct(id, productData);
};

export const deleteProduct = async (id: string) => {
    if (shouldThrowError) {
        throw new Error('Database error');
    }

    return originalRepo.deleteProduct(id);
};
