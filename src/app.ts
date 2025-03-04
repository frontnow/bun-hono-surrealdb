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

// Swagger Documentation
const openAPIDoc = {
    openapi: "3.1.0",
    info: {
        title: "Product API",
        version: "1.0.0",
        description: "API for managing products and their associated brands with SurrealDB",
        contact: {
            name: "API Support",
            email: "support@example.com"
        },
        license: {
            name: "MIT",
            url: "https://opensource.org/licenses/MIT"
        }
    },
    servers: [
        {
            url: "/api",
            description: "API endpoint"
        }
    ],
    tags: [
        {
            name: "Products",
            description: "Product management endpoints"
        }
    ],
    paths: {
        "/products": {
            get: {
                summary: "Get all products",
                description: "Retrieve a list of all products with optional pagination",
                tags: ["Products"],
                parameters: [
                    {
                        name: "limit",
                        in: "query",
                        description: "Maximum number of items to return",
                        required: false,
                        schema: {
                            type: "integer",
                            minimum: 1
                        }
                    },
                    {
                        name: "offset",
                        in: "query",
                        description: "Number of items to skip for pagination",
                        required: false,
                        schema: {
                            type: "integer",
                            minimum: 0
                        }
                    }
                ],
                responses: {
                    "200": {
                        description: "List of products",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/PaginatedProductsResponse"
                                }
                            }
                        }
                    },
                    "500": {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            },
            post: {
                summary: "Create a new product",
                description: "Add a new product to the database",
                tags: ["Products"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ProductInput"
                            }
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "Product created successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ProductResponse"
                                }
                            }
                        }
                    },
                    "400": {
                        description: "Invalid input",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "500": {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/products/{id}": {
            get: {
                summary: "Get product by ID",
                description: "Retrieve a single product by its ID",
                tags: ["Products"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Product ID",
                        required: true,
                        schema: {
                            type: "string"
                        }
                    }
                ],
                responses: {
                    "200": {
                        description: "Product found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ProductResponse"
                                }
                            }
                        }
                    },
                    "404": {
                        description: "Product not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "500": {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            },
            put: {
                summary: "Update product",
                description: "Update an existing product by ID",
                tags: ["Products"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Product ID",
                        required: true,
                        schema: {
                            type: "string"
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ProductUpdateInput"
                            }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Product updated successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ProductResponse"
                                }
                            }
                        }
                    },
                    "404": {
                        description: "Product not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "500": {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            },
            delete: {
                summary: "Delete product",
                description: "Delete a product by ID",
                tags: ["Products"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Product ID",
                        required: true,
                        schema: {
                            type: "string"
                        }
                    }
                ],
                responses: {
                    "200": {
                        description: "Product deleted successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean",
                                            example: true
                                        },
                                        data: {
                                            type: "object",
                                            properties: {
                                                message: {
                                                    type: "string",
                                                    example: "Product deleted successfully"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "404": {
                        description: "Product not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "500": {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    components: {
        schemas: {
            Product: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "Unique identifier for the product",
                        example: "g72nd6u4rejnrcguuuuy"
                    },
                    name: {
                        type: "string",
                        description: "Product name",
                        example: "Smart TV 55\""
                    },
                    url: {
                        type: "string",
                        description: "Product URL",
                        example: "https://example.com/smart-tv-55"
                    },
                    price: {
                        type: "number",
                        description: "Product price",
                        example: 599.99
                    },
                    description: {
                        type: "string",
                        description: "Product description",
                        example: "55-inch Smart TV with 4K resolution"
                    }
                },
                required: ["name", "url"]
            },
            Brand: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "Unique identifier for the brand",
                        example: "brands:samsung"
                    },
                    name: {
                        type: "string",
                        description: "Brand name",
                        example: "Samsung"
                    }
                },
                required: ["name"]
            },
            ProductWithBrands: {
                allOf: [
                    {
                        $ref: "#/components/schemas/Product"
                    },
                    {
                        type: "object",
                        properties: {
                            brands: {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/Brand"
                                },
                                description: "Associated brands"
                            }
                        }
                    }
                ]
            },
            PaginationInfo: {
                type: "object",
                properties: {
                    total: {
                        type: "integer",
                        description: "Total number of items",
                        example: 50
                    },
                    limit: {
                        type: ["integer", "null"],
                        description: "Items per page",
                        example: 10
                    },
                    offset: {
                        type: ["integer", "null"],
                        description: "Number of items to skip",
                        example: 0
                    },
                    hasMore: {
                        type: "boolean",
                        description: "Whether more items exist",
                        example: true
                    }
                }
            },
            ProductInput: {
                type: "object",
                properties: {
                    name: {
                        type: "string",
                        description: "Product name",
                        example: "Smart TV 55\""
                    },
                    url: {
                        type: "string",
                        description: "Product URL",
                        example: "https://example.com/smart-tv-55"
                    },
                    price: {
                        type: "number",
                        description: "Product price",
                        example: 599.99
                    },
                    description: {
                        type: "string",
                        description: "Product description",
                        example: "55-inch Smart TV with 4K resolution"
                    }
                },
                required: ["name", "url"]
            },
            ProductUpdateInput: {
                type: "object",
                properties: {
                    name: {
                        type: "string",
                        description: "Product name",
                        example: "Smart TV 55\" - Updated"
                    },
                    url: {
                        type: "string",
                        description: "Product URL",
                        example: "https://example.com/smart-tv-55"
                    },
                    price: {
                        type: "number",
                        description: "Product price",
                        example: 549.99
                    },
                    description: {
                        type: "string",
                        description: "Product description",
                        example: "55-inch Smart TV with 4K resolution and HDR"
                    }
                }
            },
            ProductResponse: {
                type: "object",
                properties: {
                    success: {
                        type: "boolean",
                        example: true
                    },
                    data: {
                        $ref: "#/components/schemas/ProductWithBrands"
                    }
                }
            },
            PaginatedProductsResponse: {
                type: "object",
                properties: {
                    success: {
                        type: "boolean",
                        example: true
                    },
                    data: {
                        type: "array",
                        items: {
                            $ref: "#/components/schemas/ProductWithBrands"
                        }
                    },
                    pagination: {
                        $ref: "#/components/schemas/PaginationInfo"
                    }
                }
            },
            ErrorResponse: {
                type: "object",
                properties: {
                    success: {
                        type: "boolean",
                        example: false
                    },
                    error: {
                        type: "string",
                        example: "Product not found"
                    },
                    statusCode: {
                        type: "integer",
                        example: 404
                    }
                }
            }
        }
    }
};

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
