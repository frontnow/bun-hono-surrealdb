/**
 * Application setup
 * 
 * Configures the main Hono application with middleware and routes
 */
import { Hono } from "hono";
import { cache } from "hono/cache";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { timing } from "hono/timing";

import { errorMiddleware, notFoundHandler } from "./middleware/error.middleware";
import { loggerMiddleware } from "./middleware/logger.middleware";
import { getSwaggerTemplate } from "./config/swagger";
import productRouter from "./routes/product.routes";

// Create the main app instance
const app = new Hono();

// Apply global middleware
app.use("*", loggerMiddleware());
app.use("*", errorMiddleware());
app.use("*", prettyJSON());
app.use("*", cors());
app.use("*", timing());

// Set up API routes
app.route("/api", productRouter);

// Import the OpenAPI specification
import { openAPIDoc } from './openapi';

// Create OpenAPI instance
const apiDocs = new OpenAPIHono();

// Add Swagger UI
apiDocs.get(
    "/docs",
    swaggerUI({
        url: "/api/docs/json",
        manuallySwaggerUIHtml: () => {
            return getSwaggerTemplate().replace("URL_PLACEHOLDER", "/api/docs/json");
        },
    })
);

// Serve OpenAPI JSON
apiDocs.get("/docs/json", (c) => {
    return c.json(openAPIDoc);
});

// Mount API docs
app.route("/api", apiDocs);

// Home route
app.get("/", async (c) => {
    return c.json({
        message: "Welcome to Hono API with Bun!",
        endpoints: {
            api: {
                products: "/api/products",
                productById: "/api/products/:id",
                documentation: "/api/docs",
            },
            root: "/",
        },
    });
});

// Handle 404 for undefined routes
app.notFound(notFoundHandler);

export default app;
