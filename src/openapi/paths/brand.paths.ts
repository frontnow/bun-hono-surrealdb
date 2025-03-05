/**
 * OpenAPI specification - Brand API endpoints
 */
export const brandPaths = {
    "/brands/{brand_id}": {
        get: {
            summary: "Get brand by ID",
            description: "Retrieve a specific brand by its unique identifier",
            tags: ["Brands"],
            parameters: [
                {
                    name: "brand_id",
                    in: "path",
                    description: "The ID of the brand to retrieve",
                    required: true,
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                "200": {
                    description: "Brand details",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Brand"
                            }
                        }
                    }
                },
                "404": {
                    description: "Brand not found",
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
    "/brands/search": {
        get: {
            summary: "Search for brands",
            description: "Search for brands using various criteria",
            tags: ["Brands"],
            parameters: [
                {
                    name: "query",
                    in: "query",
                    description: "Text to search in name and aliases",
                    required: false,
                    schema: {
                        type: "string"
                    }
                },
                {
                    name: "established_after",
                    in: "query",
                    description: "Filter by establishment year",
                    required: false,
                    schema: {
                        type: "integer"
                    }
                },
                {
                    name: "country",
                    in: "query",
                    description: "Filter by country",
                    required: false,
                    schema: {
                        type: "string"
                    }
                },
                {
                    name: "page",
                    in: "query",
                    description: "Page number for pagination",
                    required: false,
                    schema: {
                        type: "integer",
                        minimum: 1,
                        default: 1
                    }
                },
                {
                    name: "per_page",
                    in: "query",
                    description: "Items per page",
                    required: false,
                    schema: {
                        type: "integer",
                        minimum: 1,
                        maximum: 50,
                        default: 20
                    }
                }
            ],
            responses: {
                "200": {
                    description: "List of brands matching search criteria",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    results: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/Brand"
                                        }
                                    },
                                    total: {
                                        type: "integer",
                                        example: 10
                                    },
                                    page: {
                                        type: "integer",
                                        example: 1
                                    },
                                    pages: {
                                        type: "integer",
                                        example: 1
                                    }
                                }
                            }
                        }
                    }
                },
                "400": {
                    description: "Invalid search parameters",
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
