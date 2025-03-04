/**
 * Product Controller
 * 
 * Handles business logic for product operations
 */
import { Context } from "hono";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../repositories/product.repository";
import { Product } from "../models/product.model";
import { createSuccessResponse, createErrorResponse, createPaginatedResponse } from "../utils/response.utils";

/**
 * Get all products with optional pagination
 */
export const getProductsHandler = async (c: Context) => {
    try {
        // Extract pagination parameters from query
        const limitParam = c.req.query("limit");
        const offsetParam = c.req.query("offset");

        // Parse parameters with fallbacks
        const limit = limitParam ? parseInt(limitParam, 10) : undefined;
        const offset = offsetParam ? parseInt(offsetParam, 10) : undefined;

        // Get paginated products
        const { data: products, pagination } = await getAllProducts(limit, offset);

        // Return formatted response
        return c.json(createPaginatedResponse(
            products,
            pagination.total,
            pagination.limit,
            pagination.offset
        ));
    } catch (error) {
        console.error("Error in getProductsHandler:", error);
        return c.json(
            createErrorResponse(error instanceof Error ? error.message : String(error)),
            500
        );
    }
};

/**
 * Get a single product by ID
 */
export const getProductByIdHandler = async (c: Context) => {
    try {
        const id = c.req.param("id");
        const product = await getProductById(id);

        if (!product) {
            return c.json(
                createErrorResponse("Product not found", 404),
                404
            );
        }

        return c.json(createSuccessResponse(product));
    } catch (error) {
        console.error(`Error in getProductByIdHandler:`, error);
        return c.json(
            createErrorResponse(error instanceof Error ? error.message : String(error)),
            500
        );
    }
};

/**
 * Create a new product
 */
export const createProductHandler = async (c: Context) => {
    try {
        const productData = await c.req.json() as Omit<Product, 'id'>;
        const product = await createProduct(productData);

        return c.json(createSuccessResponse(product), 201);
    } catch (error) {
        console.error("Error in createProductHandler:", error);
        return c.json(
            createErrorResponse(error instanceof Error ? error.message : String(error)),
            500
        );
    }
};

/**
 * Update an existing product
 */
export const updateProductHandler = async (c: Context) => {
    try {
        const id = c.req.param("id");
        const productData = await c.req.json() as Partial<Product>;

        const product = await updateProduct(id, productData);

        if (!product) {
            return c.json(
                createErrorResponse("Product not found", 404),
                404
            );
        }

        return c.json(createSuccessResponse(product));
    } catch (error) {
        console.error(`Error in updateProductHandler:`, error);
        return c.json(
            createErrorResponse(error instanceof Error ? error.message : String(error)),
            500
        );
    }
};

/**
 * Delete a product
 */
export const deleteProductHandler = async (c: Context) => {
    try {
        const id = c.req.param("id");
        const success = await deleteProduct(id);

        if (!success) {
            return c.json(
                createErrorResponse("Product not found", 404),
                404
            );
        }

        return c.json(createSuccessResponse({ message: "Product deleted successfully" }));
    } catch (error) {
        console.error(`Error in deleteProductHandler:`, error);
        return c.json(
            createErrorResponse(error instanceof Error ? error.message : String(error)),
            500
        );
    }
};
