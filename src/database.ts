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

    // Simplified, more direct count query
    const countQuery = `SELECT count() FROM product`;
    const countResult = await db.query(countQuery);

    // Extract count properly from SurrealDB response
    let total = 0;

    if (
      countResult &&
      Array.isArray(countResult) &&
      countResult.length > 0 &&
      Array.isArray(countResult[0]) &&
      countResult[0].length > 0
    ) {
      const countObj = countResult[0][0];
      if (countObj && typeof countObj === "object" && countObj !== null) {
        // Try to extract the count from various possible formats
        if ("count" in countObj && typeof countObj.count === "number") {
          total = countObj.count;
        } else if (
          "result" in countObj &&
          typeof countObj.result === "number"
        ) {
          total = countObj.result;
        }
      }
    }

    // Ensure we have at least 1 for the count if query failed
    if (total <= 0) {
      // Fallback to counting products directly
      const productsQuery = `SELECT * FROM product`;
      const productsResult = await db.query(productsQuery);

      if (
        productsResult &&
        Array.isArray(productsResult) &&
        productsResult.length > 0 &&
        Array.isArray(productsResult[0])
      ) {
        total = productsResult[0].length;
      } else {
        total = 1; // Default fallback
      }
    }

    // Apply pagination if parameters are provided
    let query = `
      SELECT *, ->product_brand->brands[*] AS brands FROM product
      FETCH brand
    `;

    // Add pagination with correct SurrealDB syntax
    // SurrealDB uses standard LIMIT and START parameters separately
    if (limit !== undefined) {
      query += ` LIMIT ${limit}`;
    }

    if (offset !== undefined && offset > 0) {
      query += ` START ${offset}`;
    }

    query += `;`;

    const result = await db.query(query);

    // Ensure consistent result structure
    let data = [];
    if (
      result &&
      Array.isArray(result) &&
      result.length > 0 &&
      Array.isArray(result[0])
    ) {
      data = result[0];
    }

    return {
      data,
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
