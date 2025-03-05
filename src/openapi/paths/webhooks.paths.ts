/**
 * OpenAPI specification - Webhook endpoints
 */
export const webhookPaths = {
    "/webhooks": {
        post: {
            summary: "Create webhook",
            description: "Configure webhook endpoints to receive notifications about specific events",
            tags: ["Webhooks"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/WebhookRequest"
                        }
                    }
                }
            },
            responses: {
                "201": {
                    description: "Webhook created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/WebhookResponse"
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
        },
        get: {
            summary: "List webhooks",
            description: "Get a list of all configured webhooks",
            tags: ["Webhooks"],
            parameters: [],
            responses: {
                "200": {
                    description: "List of webhooks",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    webhooks: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/WebhookResponse"
                                        }
                                    }
                                }
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
    },
    "/webhooks/{webhook_id}": {
        get: {
            summary: "Get webhook details",
            description: "Retrieve details about a specific webhook",
            tags: ["Webhooks"],
            parameters: [
                {
                    name: "webhook_id",
                    in: "path",
                    description: "Webhook ID",
                    required: true,
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                "200": {
                    description: "Webhook details",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/WebhookResponse"
                            }
                        }
                    }
                },
                "404": {
                    description: "Webhook not found",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse"
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
        },
        put: {
            summary: "Update webhook",
            description: "Update an existing webhook configuration",
            tags: ["Webhooks"],
            parameters: [
                {
                    name: "webhook_id",
                    in: "path",
                    description: "Webhook ID",
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
                            $ref: "#/components/schemas/WebhookRequest"
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Webhook updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/WebhookResponse"
                            }
                        }
                    }
                },
                "404": {
                    description: "Webhook not found",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse"
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
        },
        delete: {
            summary: "Delete webhook",
            description: "Delete an existing webhook",
            tags: ["Webhooks"],
            parameters: [
                {
                    name: "webhook_id",
                    in: "path",
                    description: "Webhook ID",
                    required: true,
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                "200": {
                    description: "Webhook deleted successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: {
                                        type: "boolean",
                                        example: true
                                    },
                                    message: {
                                        type: "string",
                                        example: "Webhook deleted successfully"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "Webhook not found",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse"
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
