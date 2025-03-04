/**
 * Environment configuration module
 * 
 * Centralizes access to environment variables with validation and default values.
 */
import { z } from "zod";

// Schema for environment variables validation
const envSchema = z.object({
    // Server configuration
    PORT: z.string().default("3457"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

    // Database configuration
    DB_URL: z.string(),
    DB_NAMESPACE: z.string(),
    DB_NAME: z.string(),
    DB_USERNAME: z.string(),
    DB_PASSWORD: z.string()
});

// Parse environment variables or throw validation error
const parseEnv = () => {
    try {
        return envSchema.parse({
            // Server configuration
            PORT: process.env.PORT,
            NODE_ENV: process.env.NODE_ENV,

            // Database configuration
            DB_URL: process.env.DB_URL || "wss://product-graph-06ab59i8odvsj7v3ve16ctlcgg.aws-euw1.surreal.cloud/rpc",
            DB_NAMESPACE: process.env.DB_NAMESPACE || "Product Graph",
            DB_NAME: process.env.DB_NAME || "Product Graph",
            DB_USERNAME: process.env.DB_USERNAME || "root",
            DB_PASSWORD: process.env.DB_PASSWORD || "VerySecurePassword!"
        });
    } catch (error) {
        console.error("❌ Environment validation error:", error);
        throw new Error("Missing required environment variables");
    }
};

// Export validated environment variables
export const env = parseEnv();

// Utility helper for checking environment
export const isDevelopment = () => env.NODE_ENV === "development";
export const isProduction = () => env.NODE_ENV === "production";
export const isTest = () => env.NODE_ENV === "test";
