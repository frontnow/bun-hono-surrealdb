import { z } from "zod";

// Brand schema
export const BrandSchema = z
  .object({
    id: z.string().describe("Unique identifier for the brand"),
    name: z.string().describe("Name of the brand"),
  })
  .describe("Brand information");

// Product schema
export const ProductSchema = z
  .object({
    id: z.string().describe("Unique identifier for the product"),
    name: z.string().describe("Name of the product"),
    description: z.string().optional().describe("Description of the product"),
    price: z.number().optional().describe("Price of the product"),
    // Additional product properties can be added here as needed
    brands: z.array(BrandSchema).optional().describe("Brands associated with the product"),
  })
  .describe("Product information");

// Pagination schema
export const PaginationSchema = z
  .object({
    total: z.number().describe("Total number of items available"),
    limit: z.number().nullable().describe("Number of items per page"),
    offset: z.number().nullable().describe("Starting position for pagination"),
    hasMore: z.boolean().describe("Whether there are more items available"),
  })
  .describe("Pagination information");

// Product list response schema
export const ProductListResponseSchema = z
  .object({
    success: z.boolean().describe("Whether the operation was successful"),
    data: z.array(ProductSchema).describe("List of products"),
    pagination: PaginationSchema.describe("Pagination information"),
  })
  .describe("Response for product list endpoint");

// Single product response schema
export const ProductResponseSchema = z
  .object({
    success: z.boolean().describe("Whether the operation was successful"),
    data: ProductSchema.describe("Product information"),
  })
  .describe("Response for single product endpoint");

// Error response schema
export const ErrorResponseSchema = z
  .object({
    success: z.literal(false).describe("Operation failed"),
    error: z.string().describe("Error message"),
  })
  .describe("Error response");

// Query parameters for product list
export const ProductListQuerySchema = z.object({
  limit: z.string().optional().describe("Number of items to return per page"),
  offset: z.string().optional().describe("Starting position for pagination"),
});

// Path parameters for single product
export const ProductPathParamsSchema = z.object({
  id: z.string().describe("Product ID"),
});