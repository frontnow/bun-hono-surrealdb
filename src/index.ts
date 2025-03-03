import { Hono } from "hono";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { serveStatic } from "hono/serve-static";
import * as fs from "fs";
import * as path from "path";
import { timing, setMetric, startTime, endTime } from "hono/timing";
import type { TimingVariables } from "hono/timing";
import { prettyJSON } from "hono/pretty-json";
import { languageDetector } from "hono/language";
import { cache } from "hono/cache";
import type { MiddlewareHandler } from "hono";
import { cors } from "hono/cors";
import {
  getSurrealDB,
  closeSurrealDB,
  getProducts,
  getProductById,
} from "./database";
import { handle } from "hono/vercel";
import {
  ProductSchema,
  ProductListResponseSchema,
  ProductResponseSchema,
  ErrorResponseSchema,
  ProductListQuerySchema,
  ProductPathParamsSchema,
} from "./schemas";

export const runtime = "edge";

// Type definitions for our app variables
type Variables = TimingVariables;

// Create the main Hono app
const app = new Hono<{ Variables: Variables }>();

// Helper function to read the custom Swagger template
const getSwaggerTemplate = (): string => {
  try {
    const templatePath = path.join(
      process.cwd(),
      "src",
      "swagger-template.html"
    );
    if (fs.existsSync(templatePath)) {
      return fs.readFileSync(templatePath, "utf8");
    }
    console.warn("Swagger template file not found at", templatePath);
    return "";
  } catch (error) {
    console.error("Error reading Swagger template:", error);
    return "";
  }
};

// Custom fancy logger middleware
const fancyLogger = (): MiddlewareHandler => {
  // ANSI color codes
  const reset = "\x1b[0m";
  const bright = "\x1b[1m";
  const dim = "\x1b[2m";

  const black = "\x1b[30m";
  const red = "\x1b[31m";
  const green = "\x1b[32m";
  const yellow = "\x1b[33m";
  const blue = "\x1b[34m";
  const magenta = "\x1b[35m";
  const cyan = "\x1b[36m";
  const white = "\x1b[37m";

  // Background colors
  const bgGreen = "\x1b[42m";
  const bgYellow = "\x1b[43m";
  const bgRed = "\x1b[41m";
  const bgBlue = "\x1b[44m";

  return async (c, next) => {
    const method = c.req.method;
    const path = c.req.path;

    // Get colorized method
    const getMethodColor = (method: string) => {
      switch (method) {
        case "GET":
          return `${bright}${green}${method}${reset}`;
        case "POST":
          return `${bright}${blue}${method}${reset}`;
        case "PUT":
          return `${bright}${yellow}${method}${reset}`;
        case "DELETE":
          return `${bright}${red}${method}${reset}`;
        case "PATCH":
          return `${bright}${magenta}${method}${reset}`;
        case "OPTIONS":
          return `${bright}${cyan}${method}${reset}`;
        default:
          return `${bright}${white}${method}${reset}`;
      }
    };

    // Get status code color
    const getStatusColor = (status: number) => {
      if (status >= 500) {
        return `${bgRed}${bright}${black} ${status} ${reset}`;
      } else if (status >= 400) {
        return `${bgYellow}${bright}${black} ${status} ${reset}`;
      } else if (status >= 300) {
        return `${bgBlue}${bright}${black} ${status} ${reset}`;
      } else if (status >= 200) {
        return `${bgGreen}${bright}${black} ${status} ${reset}`;
      } else {
        return `${bright} ${status} ${reset}`;
      }
    };

    // Log the request
    console.log(
      `${dim}[${new Date().toISOString()}]${reset} ${cyan}⟹${reset}  ${getMethodColor(
        method
      )} ${path}`
    );

    const startTime = Date.now();
    await next();
    const endTime = Date.now();
    const duration = endTime - startTime;

    // Get response status
    const status = c.res.status;

    // Log the response
    console.log(
      `${dim}[${new Date().toISOString()}]${reset} ${green}⟸${reset}  ${getMethodColor(
        method
      )} ${path} ${getStatusColor(status)} ${dim}${duration}ms${reset}`
    );
  };
};

// Apply middleware
app.use("*", fancyLogger());
app.use("*", prettyJSON());
app.use("*", cors());
app.use(
  languageDetector({
    supportedLanguages: ["en", "de", "fr"],
    fallbackLanguage: "en",
  })
);

// Apply timing middleware
app.use(timing());

// Create an OpenAPI instance for the API
const api = new OpenAPIHono();

// Define the OpenAPI document
const openAPIDocument = {
  openapi: "3.1.0",
  info: {
    title: "Product API",
    version: "1.0.0",
    description: "API for managing products and their associated brands",
  },
  servers: [
    {
      url: "/api",
      description: "API endpoint",
    },
  ],
};

// Standard API routes
// Get all products with brand information (with pagination)
api.get("/products", async (c) => {
  try {
    startTime(c, "get-products");

    // Extract pagination parameters from query
    const limitParam = c.req.query("limit");
    const offsetParam = c.req.query("offset");

    // Parse parameters (with fallback to undefined for optional pagination)
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    const offset = offsetParam ? parseInt(offsetParam, 10) : undefined;

    // Get paginated products
    const { data: products, total } = await getProducts(limit, offset);
    endTime(c, "get-products");

    return c.json({
      success: true,
      data: products,
      pagination: {
        total,
        limit,
        offset,
        hasMore:
          limit !== undefined && total > 0
            ? (offset || 0) + limit < total
            : false,
      },
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

// Get product by ID
api.get("/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    startTime(c, "get-product");
    const product = await getProductById(id);
    endTime(c, "get-product");

    if (!product) {
      return c.json(
        {
          success: false,
          error: "Product not found",
        },
        404
      );
    }

    return c.json({
      success: true,
      data: product,
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

// Add Swagger UI with custom template
api.get(
  "/docs",
  swaggerUI({
    url: "/api/docs/json",
    manuallySwaggerUIHtml: (assets) => {
      return getSwaggerTemplate().replace("URL_PLACEHOLDER", "/api/docs/json");
    },
  })
);

// Serve OpenAPI documentation
api.get("/docs/json", (c) => {
  // Define API paths
  const paths = {
    "/products": {
      get: {
        tags: ["Products"],
        summary: "Get a list of products",
        description:
          "Retrieve a paginated list of products with brand information",
        parameters: [
          {
            name: "limit",
            in: "query",
            description: "Number of items to return per page",
            required: false,
            schema: { type: "string" },
          },
          {
            name: "offset",
            in: "query",
            description: "Starting position for pagination",
            required: false,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Successful response with paginated products",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          name: { type: "string" },
                          description: { type: "string" },
                          price: { type: "number" },
                          brands: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                id: { type: "string" },
                                name: { type: "string" },
                              },
                            },
                          },
                        },
                      },
                    },
                    pagination: {
                      type: "object",
                      properties: {
                        total: { type: "number" },
                        limit: { type: "number", nullable: true },
                        offset: { type: "number", nullable: true },
                        hasMore: { type: "boolean" },
                      },
                    },
                  },
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", enum: [false] },
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get a product by ID",
        description: "Retrieve a single product by its unique identifier",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Product ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Successful response with product details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        description: { type: "string" },
                        price: { type: "number" },
                        brands: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id: { type: "string" },
                              name: { type: "string" },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Product not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", enum: [false] },
                    error: { type: "string" },
                  },
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", enum: [false] },
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  // Combine with base OpenAPI document
  const fullDoc = {
    ...openAPIDocument,
    paths,
  };

  return c.json(fullDoc);
});

// Mount the API under /api
app.route("/api", api);

// Home route with custom metrics and API docs link
app.get("/", async (c) => {
  startTime(c, "db");
  await new Promise((resolve) => setTimeout(resolve, 50));
  endTime(c, "db");

  const lang = c.get("language");

  return c.json({
    message: "Welcome to Hono with Bun!",
    language: lang,
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

// For Vercel deployment
const handler = handle(app);
export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const OPTIONS = handler;

// Start local server when not in production/Vercel environment
if (process.env.VERCEL !== "1") {
  const port = process.env.PORT || 3457;
  console.log(`🚀 Server running at http://localhost:${port}`);

  // Create and start the Bun server
  const server = Bun.serve({
    port: Number(port),
    fetch: app.fetch,
  });

  console.log(
    `📚 API Documentation available at http://localhost:${port}/api/docs`
  );
}
