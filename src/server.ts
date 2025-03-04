/**
 * Server entry point
 * 
 * Starts the server when not in Vercel environment
 */
import app from "./app";
import { env } from "./config/environment";
import { closeSurrealDB } from "./config/database";

// Handle Vercel serverless deployment
export const handle = app.fetch;
export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
export const OPTIONS = handle;

// Start server when not in Vercel environment
if (process.env.VERCEL !== "1") {
    const port = parseInt(env.PORT, 10);

    // Create and start the Bun server
    const server = Bun.serve({
        port,
        fetch: app.fetch,
    });

    console.log(`🚀 Server running at http://localhost:${port}`);
    console.log(`📚 API Documentation available at http://localhost:${port}/api/docs`);

    // Handle shutdown
    const shutdown = async () => {
        console.log("Shutting down server...");
        await closeSurrealDB();
        process.exit(0);
    };

    // Add handlers for graceful shutdown
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
}
