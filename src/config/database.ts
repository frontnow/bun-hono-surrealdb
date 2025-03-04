/**
 * Database configuration module
 * 
 * Provides connection management for SurrealDB
 */
import { Surreal } from "surrealdb";
import { env } from "./environment";

// Global database instance
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
            await dbInstance.connect(env.DB_URL, {
                namespace: env.DB_NAMESPACE,
                database: env.DB_NAME,
            });

            // Authenticate with credentials
            await dbInstance.signin({
                username: env.DB_USERNAME,
                password: env.DB_PASSWORD,
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
