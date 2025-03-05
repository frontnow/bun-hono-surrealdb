/**
 * OpenAPI specification - Search API endpoints
 */
export const searchPaths = {
    "/search": {
        post: {
            summary: "Search for products",
            description: "Initiate an asynchronous search operation with advanced options",
            tags: ["Search"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/SearchRequest"
                        }
                    }
                }
            },
            responses: {
                "202": {
                    description: "Search request accepted",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/SearchJobResponse"
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
    },
    "/search/{job_id}": {
        get: {
            summary: "Get search results",
            description: "Retrieve the results of a previously initiated search",
            tags: ["Search"],
            parameters: [
                {
                    name: "job_id",
                    in: "path",
                    description: "Search job ID",
                    required: true,
                    schema: {
                        type: "string"
                    }
                },
                {
                    name: "page",
                    in: "query",
                    description: "Page number for results pagination",
                    required: false,
                    schema: {
                        type: "integer",
                        minimum: 1,
                        default: 1
                    }
                }
            ],
            responses: {
                "200": {
                    description: "Search results",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/SearchResultsResponse"
                            }
                        }
                    }
                },
                "404": {
                    description: "Search job not found",
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
