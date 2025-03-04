/**
 * Product model
 * 
 * Defines the data structure for product entities
 */
import { z } from "zod";
import { BrandSchema } from "./brand.model";

// Product schema validator
export const ProductSchema = z.object({
    id: z.string().describe("Unique identifier for the product"),
    name: z.string().describe("Name of the product"),
    description: z.string().optional().describe("Description of the product"),
    price: z.number().optional().describe("Price of the product"),
    url: z.string().optional().describe("URL for the product"),
    brand: z.string().optional().describe("Reference to the product's brand"),
    brands: z.array(BrandSchema).optional().describe("Brands associated with the product"),
});

// Product type definition
export type Product = z.infer<typeof ProductSchema>;

// Product with populated brands
export type ProductWithBrands = Omit<Product, 'brands'> & {
    brands: Array<z.infer<typeof BrandSchema>>;
};

// Pagination schema
export const PaginationSchema = z.object({
    total: z.number().describe("Total number of items available"),
    limit: z.number().nullable().describe("Number of items per page"),
    offset: z.number().nullable().describe("Starting position for pagination"),
    hasMore: z.boolean().describe("Whether there are more items available"),
});

// Pagination type
export type Pagination = z.infer<typeof PaginationSchema>;

// Paginated products response
export type PaginatedProducts = {
    data: ProductWithBrands[];
    pagination: Pagination;
};
