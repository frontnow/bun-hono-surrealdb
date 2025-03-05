/**
 * OpenAPI specification - Credits management endpoints
 */
export const creditsPaths = {
    "/credits": {
        get: {
            summary: "Get credit balance",
            description: "Check your current credit balance and usage statistics",
            tags: ["Credits"],
            parameters: [],
            responses: {
                "200": {
                    description: "Credit information",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/CreditsResponse"
                            }
                        }
                    }
                },
                "401": {
                    description: "Unauthorized - Authentication required",
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
            },
            security: [
                {
                    "ApiKeyAuth": []
                }
            ]
        }
    }
};
