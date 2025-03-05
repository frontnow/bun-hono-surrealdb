/**
 * OpenAPI specification - Product API endpoints
 */
export const productPaths = {
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
                },
                {
                    name: "lang",
                    in: "query",
                    description: "Preferred language for content",
                    required: false,
                    schema: {
                        type: "string"
                    }
                },
                {
                    name: "languages",
                    in: "query",
                    description: "Prioritized list of languages for content",
                    required: false,
                    schema: {
                        type: "string"
                    }
                },
                {
                    name: "fields",
                    in: "query",
                    description: "Comma-separated list of fields to include",
                    required: false,
                    schema: {
                        type: "string"
                    }
                },
                {
                    name: "include_translation_status",
                    in: "query",
                    description: "Whether to include translation status information",
                    required: false,
                    schema: {
                        type: "boolean"
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
                "400": {
                    description: "Invalid request parameters",
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
    "/products/{product_id}": {
        get: {
            summary: "Get product by ID",
            description: "Retrieve a single product by its ID with language customization",
            tags: ["Products"],
            parameters: [
                {
                    name: "product_id",
                    in: "path",
                    description: "Product ID",
                    required: true,
                    schema: {
                        type: "string"
                    }
                },
                {
                    name: "lang",
                    in: "query",
                    description: "Preferred language for content",
                    required: false,
                    schema: {
                        type: "string"
                    }
                },
                {
                    name: "languages",
                    in: "query",
                    description: "Prioritized list of languages for content",
                    required: false,
                    schema: {
                        type: "string"
                    }
                },
                {
                    name: "fields",
                    in: "query",
                    description: "Comma-separated list of fields to include",
                    required: false,
                    schema: {
                        type: "string"
                    }
                },
                {
                    name: "include_translation_status",
                    in: "query",
                    description: "Whether to include translation status information",
                    required: false,
                    schema: {
                        type: "boolean"
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
                    name: "product_id",
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
                    name: "product_id",
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
                                $ref: "#/components/schemas/DeleteResponse"
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
    },
    "/products/{product_id}/translate": {
        post: {
            summary: "Request product translation",
            description: "Request translation of product content into additional languages",
            tags: ["Products", "Multilanguage"],
            parameters: [
                {
                    name: "product_id",
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
                            $ref: "#/components/schemas/TranslationRequest"
                        }
                    }
                }
            },
            responses: {
                "202": {
                    description: "Translation request accepted",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/TranslationJobResponse"
                            }
                        }
                    }
                },
                "400": {
                    description: "Invalid request",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse"
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
    },
    "/products/{product_id}/history/content": {
        get: {
            summary: "Get product history",
            description: "Track changes to product information over time",
            tags: ["Products", "Historical Data"],
            parameters: [
                {
                    name: "product_id",
                    in: "path",
                    description: "Product ID",
                    required: true,
                    schema: {
                        type: "string"
                    }
                },
                {
                    name: "timeframe",
                    in: "query",
                    description: "Time period for history (1d, 7d, 30d, 90d, 1y, all)",
                    required: false,
                    schema: {
                        type: "string",
                        enum: ["1d", "7d", "30d", "90d", "1y", "all"],
                        default: "30d"
                    }
                },
                {
                    name: "fields",
                    in: "query",
                    description: "Specific fields to include in history",
                    required: false,
                    schema: {
                        type: "string"
                    }
                },
                {
                    name: "lang",
                    in: "query",
                    description: "Language filter for history records",
                    required: false,
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                "200": {
                    description: "Product history",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/HistoricalDataResponse"
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
};
