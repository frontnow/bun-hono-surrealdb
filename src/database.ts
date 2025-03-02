import { Surreal } from "surrealdb";

// Create a singleton instance of the SurrealDB client
let dbInstance: Surreal | null = null;

/**
 * Get or create a SurrealDB connection
 * @returns A connection to the SurrealDB database
 */
export const getSurrealDB = async (): Promise<Surreal> => {
  if (!dbInstance) {
    // Create a new instance if one doesn't exist
    dbInstance = new Surreal();

    // Connect to the database
    try {
      // Connect to the SurrealDB server with namespace and database included
      await dbInstance.connect(
        "wss://product-graph-06ab59i8odvsj7v3ve16ctlcgg.aws-euw1.surreal.cloud/rpc",
        {
          namespace: "Product Graph",
          database: "Product Graph",
        }
      );

      // Authenticate with credentials
      await dbInstance.signin({
        username: "root",
        password: "VerySecurePassword!",
      });

      console.log("🔌 SurrealDB connection established");
    } catch (error) {
      console.error("❌ SurrealDB connection error:", error);
      dbInstance = null;
      throw error;
    }
  }

  return dbInstance;
};

/**
 * Close the SurrealDB connection
 */
export const closeSurrealDB = async (): Promise<void> => {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
    console.log("🔌 SurrealDB connection closed");
  }
};

/**
 * Get all products with their related brands with pagination support
 * @param limit Optional number of products to return
 * @param offset Optional offset for pagination
 * @returns Array of products with brand information and pagination metadata
 */
export const getProducts = async (
  limit?: number,
  offset?: number
): Promise<{ data: any[]; total: number }> => {
  try {
    const db = await getSurrealDB();

    // Count total products for pagination metadata
    const countResult = await db.query(`
      SELECT count() AS total FROM product;
    `);

    // Handle unknown type from SurrealDB with proper type handling
    let total = 1; // Default to 1 to ensure pagination works

    if (countResult && Array.isArray(countResult) && countResult.length > 0) {
      const firstResult = countResult[0] as unknown as Record<string, unknown>;

      if (typeof firstResult.total === "number") {
        total = firstResult.total;
      } else if (
        firstResult.result &&
        typeof firstResult.result === "object" &&
        firstResult.result !== null &&
        "total" in firstResult.result &&
        typeof (firstResult.result as Record<string, unknown>).total ===
          "number"
      ) {
        total = (firstResult.result as Record<string, unknown>).total as number;
      }
    }

    // Apply pagination if parameters are provided
    let query = `
      SELECT *, ->product_brand->brands[*] AS brands FROM product
    `;

    if (limit !== undefined) {
      query += ` LIMIT ${limit}`;

      if (offset !== undefined) {
        query += ` START AT ${offset}`;
      }
    }

    query += `;`;

    const result = await db.query(query);

    return {
      data: result,
      total,
    };
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    throw error;
  }
};

/**
 * Get a product by ID
 * @param id The product ID
 * @returns The product with brand information
 */
export const getProductById = async (id: string): Promise<any> => {
  try {
    const db = await getSurrealDB();
    const result = await db.query(`
      SELECT *, ->product_brand->brands[*] AS brands FROM product:${id};
    `);
    return result[0];
  } catch (error) {
    console.error(`❌ Error fetching product ${id}:`, error);
    throw error;
  }
};
