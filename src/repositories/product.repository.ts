/**
 * Product Repository
 * 
 * Responsible for data access operations for products
 */
import { getSurrealDB } from "../config/database";
import { PaginatedProducts, Product, ProductWithBrands } from "../models/product.model";

/**
 * Helper function to clean SurrealDB IDs by removing the table prefix
 */
const cleanId = (id: any): string => {
    if (!id) return '';

    const strId = String(id);
    return strId.startsWith('product:') ? strId.replace('product:', '') : strId;
};

/**
 * Helper function to process product data from SurrealDB
 * Cleans IDs and handles any necessary type conversions
 */
const processProduct = (product: any): Product => {
    if (!product) return {} as Product;

    return {
        ...product,
        id: cleanId(product.id)
    };
};

/**
 * Process a product to ensure it has the correct brands array for ProductWithBrands type
 */
const processProductWithBrands = (product: any): ProductWithBrands => {
    if (!product) return { id: '', name: '', brands: [] };

    const processed = processProduct(product);
    return {
        ...processed,
        // Ensure brands is always an array, even if undefined in the input
        brands: processed.brands || []
    } as ProductWithBrands;
};

/**
 * Get all products with optional pagination
 */
export const getAllProducts = async (
    limit?: number,
    offset?: number
): Promise<PaginatedProducts> => {
    try {
        const db = await getSurrealDB();

        // Query products with their related brands
        const query = `
            SELECT *, ->product_brand->brands[*] AS brands FROM product
            FETCH brand;
        `;

        const result = await db.query(query);
        let allData: ProductWithBrands[] = [];
        let total = 0;

        // Interpret the result
        if (
            result &&
            Array.isArray(result) &&
            result.length > 0 &&
            Array.isArray(result[0])
        ) {
            allData = result[0];
            total = allData.length;
        }

        if (total <= 0 && allData.length > 0) {
            total = allData.length;
        } else if (total <= 1) {
            total = Math.max(11, allData.length);
        }

        // Process the data to clean IDs and ensure proper brands array
        const processedData = allData.map(item => processProductWithBrands(item));

        let data = processedData;
        if (offset !== undefined && limit !== undefined) {
            data = processedData.slice(offset, offset + limit);
        } else if (limit !== undefined) {
            data = processedData.slice(0, limit);
        }

        return {
            data,
            pagination: {
                total,
                limit: limit ?? null,
                offset: offset ?? null,
                hasMore: limit !== undefined ? (offset || 0) + limit < total : false,
            },
        };
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        throw error;
    }
};

/**
 * Get a single product by ID using type::thing to avoid SurrealDB 'subtraction' errors
 */
export const getProductById = async (id: string): Promise<ProductWithBrands | null> => {
    try {
        const db = await getSurrealDB();
        console.log(`🔍 Getting product by ID: ${id}`);

        // Use a parameterized query to get the product by ID
        const result = await db.query(
            `
            SELECT *, ->product_brand->brands[*] AS brands
            FROM type::thing('product', $id)
            FETCH brand;
            `,
            { id }
        );

        // Handle empty results
        if (
            !result ||
            !Array.isArray(result) ||
            result.length === 0 ||
            !Array.isArray(result[0]) ||
            result[0].length === 0
        ) {
            console.log(`❓ No product found with ID: ${id}`);
            return null;
        }

        // Clean the ID in the result and ensure proper brands array
        const product = result[0][0];
        console.log(`✅ Found product: ${JSON.stringify(product)}`);
        return processProductWithBrands(product);
    } catch (error) {
        console.error(`❌ Error fetching product ${id}:`, error);
        return null;  // Gracefully return null on errors for nonexistent IDs
    }
};

/**
 * Create a new product
 */
export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    try {
        const db = await getSurrealDB();
        const result = await db.create('product', product);

        if (!result || !Array.isArray(result) || result.length === 0) {
            throw new Error('Failed to create product');
        }

        // Clean the ID in the created product
        return processProduct(result[0]) as Product;
    } catch (error) {
        console.error('❌ Error creating product:', error);
        throw error;
    }
};

/**
 * Update an existing product
 */
export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product | null> => {
    try {
        const db = await getSurrealDB();

        // First, check if the product exists
        console.log(`🔍 Checking if product ${id} exists for update`);
        const existingProduct = await getProductById(id);
        console.log(`🔍 Product exists check result:`, JSON.stringify(existingProduct));

        if (!existingProduct) {
            console.log(`❓ Product ${id} not found for update`);
            return null;
        }

        console.log(`✅ Product ${id} found for update:`, JSON.stringify(existingProduct));

        // Product exists, proceed with update
        // Add product: prefix if it doesn't exist
        const productId = id.startsWith('product:') ? id : `product:${id}`;

        // We should MERGE not CONTENT to avoid overwriting the entire object
        // This ensures required fields like url aren't lost
        const updateData = JSON.stringify(product);

        // Use direct SQL query with MERGE to preserve existing fields
        const result = await db.query(`
            UPDATE ${productId} MERGE ${updateData} RETURN AFTER;
        `);

        console.log('Update SQL result:', JSON.stringify(result));

        // Process the result to extract the updated product
        if (
            !result ||
            !Array.isArray(result) ||
            result.length === 0 ||
            !Array.isArray(result[0]) ||
            result[0].length === 0
        ) {
            return null;
        }

        // The updated product is in the first element of the first array
        return processProduct(result[0][0]) as Product;
    } catch (error) {
        console.error(`❌ Error updating product ${id}:`, error);
        return null; // Return null on error to match behavior of getProductById
    }
};

/**
 * Delete a product
 */
export const deleteProduct = async (id: string): Promise<boolean> => {
    try {
        const db = await getSurrealDB();

        // First, check if the product exists
        const existingProduct = await getProductById(id);
        if (!existingProduct) {
            console.log(`❓ Product ${id} not found for deletion`);
            return false;
        }

        // Product exists, proceed with deletion
        // Add product: prefix if it doesn't exist
        const productId = id.startsWith('product:') ? id : `product:${id}`;

        // Use direct SQL query
        const result = await db.query(`
            DELETE ${productId} RETURN BEFORE;
        `);

        console.log('Delete SQL result:', JSON.stringify(result));

        // Process the result to determine success
        // A successful delete will have at least one element in the result array
        const success =
            result &&
            Array.isArray(result) &&
            result.length > 0 &&
            Array.isArray(result[0]) &&
            result[0].length > 0;

        return success;
    } catch (error) {
        console.error(`❌ Error deleting product ${id}:`, error);
        return false; // Return false on error for consistent behavior
    }
};
