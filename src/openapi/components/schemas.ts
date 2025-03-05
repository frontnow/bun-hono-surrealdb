/**
 * OpenAPI specification - Schema definitions
 */
export const schemas = {
    // Base schemas
    Product: {
        type: "object",
        properties: {
            id: {
                type: "string",
                description: "Unique identifier for the product",
                example: "prod_98765"
            },
            name: {
                type: "object",
                description: "Product name in various languages",
                example: {
                    en: "Sony WH-1000XM4 Wireless Noise-Canceling Headphones",
                    de: "Sony WH-1000XM4 Kabellose Noise-Cancelling-Kopfhörer"
                }
            },
            gtin: {
                type: "string",
                description: "Global Trade Item Number",
                example: "4548736112001"
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
                type: "object",
                description: "Product description in various languages",
                example: {
                    en: "Premium noise-canceling wireless headphones with exceptional sound quality",
                    de: "Premium-Noise-Cancelling-Kopfhörer mit außergewöhnlicher Klangqualität"
                }
            }
        },
        required: ["name"]
    },

    Brand: {
        type: "object",
        properties: {
            id: {
                type: "string",
                description: "Unique identifier for the brand",
                example: "brand_sony"
            },
            name: {
                type: "string",
                description: "Brand name",
                example: "Sony"
            },
            searchable_aliases: {
                type: "array",
                items: {
                    type: "string"
                },
                description: "Alternative names for searching",
                example: ["sony corporation", "sony electronics"]
            },
            established: {
                type: "integer",
                description: "Year the brand was established",
                example: 1946
            },
            display_name: {
                type: "object",
                description: "Brand display name in various languages",
                example: {
                    en: "Brand",
                    de: "Marke"
                }
            },
            headquarters: {
                type: "object",
                properties: {
                    city: {
                        type: "string",
                        example: "Tokyo"
                    },
                    country: {
                        type: "string",
                        example: "Japan"
                    }
                }
            },
            description: {
                type: "object",
                description: "Brand description in various languages",
                example: {
                    en: "Global electronics and entertainment company known for innovation and quality",
                    de: "Globales Elektronik- und Unterhaltungsunternehmen, bekannt für Innovation und Qualität"
                }
            },
            logo_url: {
                type: "string",
                description: "URL to the brand logo",
                example: "https://example.com/logos/sony_logo_primary.svg"
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
                    brand: {
                        $ref: "#/components/schemas/Brand"
                    },
                    categories: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "string",
                                    example: "cat_456"
                                },
                                name: {
                                    type: "object",
                                    example: {
                                        en: "Wireless Headphones",
                                        de: "Kabellose Kopfhörer"
                                    }
                                },
                                parent: {
                                    type: "string",
                                    example: "cat_123"
                                },
                                primary: {
                                    type: "boolean",
                                    example: true
                                }
                            }
                        }
                    },
                    content: {
                        type: "object",
                        properties: {
                            short_description: {
                                type: "object",
                                example: {
                                    en: "Premium wireless headphones with industry-leading noise cancellation.",
                                    de: "Premium-Funkkopfhörer mit branchenführender Geräuschunterdrückung."
                                }
                            },
                            description: {
                                type: "object",
                                example: {
                                    en: "Industry-leading noise cancellation technology helps block out background noise...",
                                    de: "Branchenführende Geräuschunterdrückungstechnologie hilft..."
                                }
                            },
                            key_benefits: {
                                type: "array",
                                items: {
                                    type: "object",
                                    example: {
                                        en: "Industry-leading noise cancellation",
                                        de: "Branchenführende Geräuschunterdrückung"
                                    }
                                }
                            }
                        }
                    },
                    quality_score: {
                        type: "object",
                        properties: {
                            score: {
                                type: "integer",
                                example: 92
                            },
                            breakdown: {
                                type: "object",
                                properties: {
                                    images: {
                                        type: "integer",
                                        example: 95
                                    },
                                    description: {
                                        type: "integer",
                                        example: 90
                                    },
                                    attributes: {
                                        type: "integer",
                                        example: 95
                                    },
                                    overall_completeness: {
                                        type: "integer",
                                        example: 88
                                    }
                                }
                            }
                        }
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
            },
            page: {
                type: "integer",
                description: "Current page number",
                example: 1
            },
            total_pages: {
                type: "integer",
                description: "Total number of pages",
                example: 5
            }
        }
    },

    ProductInput: {
        type: "object",
        properties: {
            name: {
                type: "object",
                description: "Product name in various languages",
                example: {
                    en: "Sony WH-1000XM4 Wireless Headphones",
                    de: "Sony WH-1000XM4 Kabellose Kopfhörer"
                }
            },
            gtin: {
                type: "string",
                description: "Global Trade Item Number",
                example: "4548736112001"
            },
            url: {
                type: "string",
                description: "Product URL",
                example: "https://example.com/products/sony-wh1000xm4"
            },
            price: {
                type: "number",
                description: "Product price",
                example: 599.99
            },
            description: {
                type: "object",
                description: "Product description in various languages",
                example: {
                    en: "Premium wireless headphones with industry-leading noise cancellation.",
                    de: "Premium-Funkkopfhörer mit branchenführender Geräuschunterdrückung."
                }
            },
            brand_id: {
                type: "string",
                description: "Brand identifier",
                example: "brand_sony"
            },
            category_ids: {
                type: "array",
                items: {
                    type: "string"
                },
                description: "Category identifiers",
                example: ["cat_456", "cat_789"]
            }
        },
        required: ["name"]
    },

    ProductUpdateInput: {
        type: "object",
        properties: {
            name: {
                type: "object",
                description: "Product name in various languages",
                example: {
                    en: "Sony WH-1000XM4 Wireless Headphones - Updated",
                    de: "Sony WH-1000XM4 Kabellose Kopfhörer - Aktualisiert"
                }
            },
            url: {
                type: "string",
                description: "Product URL",
                example: "https://example.com/products/sony-wh1000xm4"
            },
            price: {
                type: "number",
                description: "Product price",
                example: 549.99
            },
            description: {
                type: "object",
                description: "Product description in various languages",
                example: {
                    en: "Premium wireless headphones with industry-leading noise cancellation and new features.",
                    de: "Premium-Funkkopfhörer mit branchenführender Geräuschunterdrückung und neuen Funktionen."
                }
            }
        }
    },

    // Response schemas
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
                type: "object",
                properties: {
                    code: {
                        type: "string",
                        example: "invalid_language"
                    },
                    message: {
                        type: "string",
                        example: "The requested language 'xyz' is not supported."
                    },
                    documentation_url: {
                        type: "string",
                        example: "https://productgraph.org/docs/errors#invalid_language"
                    }
                }
            },
            statusCode: {
                type: "integer",
                example: 400
            }
        }
    },

    DeleteResponse: {
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
    },

    // Additional schemas from the documentation
    CreditsResponse: {
        type: "object",
        properties: {
            total_credits: {
                type: "integer",
                example: 1000
            },
            used_credits: {
                type: "integer",
                example: 250
            },
            remaining_credits: {
                type: "integer",
                example: 750
            },
            plan: {
                type: "string",
                example: "Startup"
            },
            credits_reset_at: {
                type: "string",
                format: "date-time",
                example: "2023-05-01T00:00:00Z"
            }
        }
    },

    SearchRequest: {
        type: "object",
        properties: {
            query: {
                type: "string",
                description: "Search query text",
                example: "wireless headphones"
            },
            languages: {
                type: "array",
                items: {
                    type: "string"
                },
                description: "Priority order of languages",
                example: ["de", "en"]
            },
            cross_language_search: {
                type: "boolean",
                description: "Whether to search across all available languages",
                example: true
            },
            result_language: {
                type: "string",
                description: "Preferred language for results",
                example: "de"
            },
            filter: {
                type: "object",
                properties: {
                    brand: {
                        type: "string",
                        example: "Sony"
                    },
                    category: {
                        type: "string",
                        example: "Electronics"
                    },
                    attributes: {
                        type: "object",
                        additionalProperties: true,
                        example: {
                            "color": "black",
                            "wireless": true
                        }
                    }
                }
            },
            sort: {
                type: "object",
                properties: {
                    field: {
                        type: "string",
                        example: "relevance"
                    },
                    order: {
                        type: "string",
                        enum: ["asc", "desc"],
                        example: "desc"
                    }
                }
            }
        },
        required: ["query"]
    },

    SearchJobResponse: {
        type: "object",
        properties: {
            job_id: {
                type: "string",
                example: "srch_12345"
            },
            status: {
                type: "string",
                enum: ["queued", "processing", "completed", "failed"],
                example: "queued"
            },
            created_at: {
                type: "string",
                format: "date-time",
                example: "2023-04-14T10:30:22Z"
            }
        }
    },

    SearchResultsResponse: {
        type: "object",
        properties: {
            job_id: {
                type: "string",
                example: "srch_12345"
            },
            status: {
                type: "string",
                enum: ["queued", "processing", "completed", "failed"],
                example: "completed"
            },
            query: {
                type: "string",
                example: "wireless headphones"
            },
            results: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        product_id: {
                            type: "string",
                            example: "prod_98765"
                        },
                        name: {
                            type: "object",
                            example: {
                                en: "Sony WH-1000XM4 Wireless Noise-Canceling Headphones",
                                de: "Sony WH-1000XM4 Kabellose Noise-Cancelling-Kopfhörer"
                            }
                        },
                        gtin: {
                            type: "string",
                            example: "4548736112001"
                        },
                        score: {
                            type: "number",
                            format: "float",
                            example: 0.95
                        },
                        language_match: {
                            type: "object",
                            properties: {
                                matched_language: {
                                    type: "string",
                                    example: "de"
                                },
                                original_query_language: {
                                    type: "string",
                                    example: "en"
                                },
                                confidence: {
                                    type: "number",
                                    format: "float",
                                    example: 0.92
                                }
                            }
                        },
                        summary: {
                            type: "object",
                            example: {
                                en: "Premium noise-canceling wireless headphones with exceptional sound quality",
                                de: "Premium-Noise-Cancelling-Kopfhörer mit außergewöhnlicher Klangqualität"
                            }
                        },
                        brand: {
                            type: "string",
                            example: "Sony"
                        },
                        main_image_url: {
                            type: "string",
                            example: "https://example.com/images/sony-wh1000xm4.jpg"
                        }
                    }
                }
            },
            facets: {
                type: "object",
                properties: {
                    brand: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                name: {
                                    type: "string",
                                    example: "Sony"
                                },
                                count: {
                                    type: "integer",
                                    example: 12
                                }
                            }
                        }
                    },
                    category: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                name: {
                                    type: "string",
                                    example: "Headphones"
                                },
                                count: {
                                    type: "integer",
                                    example: 28
                                }
                            }
                        }
                    },
                    attributes: {
                        type: "object",
                        additionalProperties: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    name: {
                                        type: "string",
                                        example: "Black"
                                    },
                                    count: {
                                        type: "integer",
                                        example: 18
                                    }
                                }
                            }
                        }
                    }
                }
            },
            created_at: {
                type: "string",
                format: "date-time",
                example: "2023-04-14T10:30:22Z"
            },
            completed_at: {
                type: "string",
                format: "date-time",
                example: "2023-04-14T10:31:15Z"
            },
            total_results: {
                type: "integer",
                example: 124
            },
            page: {
                type: "integer",
                example: 1
            },
            total_pages: {
                type: "integer",
                example: 13
            }
        }
    },

    TranslationRequest: {
        type: "object",
        properties: {
            target_languages: {
                type: "array",
                items: {
                    type: "string"
                },
                description: "Languages to translate content into",
                example: ["de", "fr"]
            },
            priority: {
                type: "string",
                enum: ["low", "normal", "high"],
                description: "Processing priority",
                example: "normal"
            },
            fields: {
                type: "array",
                items: {
                    type: "string"
                },
                description: "Fields to translate",
                example: ["description", "attributes", "seo"]
            },
            callback_url: {
                type: "string",
                description: "Webhook URL for completion notification",
                example: "https://your-webhook.com/translation-completed"
            }
        },
        required: ["target_languages"]
    },

    TranslationJobResponse: {
        type: "object",
        properties: {
            job_id: {
                type: "string",
                example: "tr_45678"
            },
            status: {
                type: "string",
                enum: ["queued", "processing", "completed", "failed"],
                example: "queued"
            },
            estimated_completion: {
                type: "string",
                format: "date-time",
                example: "2023-04-15T16:00:00Z"
            }
        }
    },

    WebhookRequest: {
        type: "object",
        properties: {
            url: {
                type: "string",
                example: "https://your-callback-url.com/webhook"
            },
            events: {
                type: "array",
                items: {
                    type: "string",
                    enum: ["search_completed", "product_updated", "translation_completed", "quality_score_changed"]
                },
                example: ["search_completed", "product_updated", "translation_completed"]
            },
            language_filters: {
                type: "array",
                items: {
                    type: "string"
                },
                description: "Only trigger for these languages",
                example: ["de", "fr"]
            },
            secret: {
                type: "string",
                description: "For signature verification",
                example: "your-webhook-secret"
            }
        },
        required: ["url", "events"]
    },

    WebhookResponse: {
        type: "object",
        properties: {
            webhook_id: {
                type: "string",
                example: "wh_34567"
            },
            url: {
                type: "string",
                example: "https://your-callback-url.com/webhook"
            },
            events: {
                type: "array",
                items: {
                    type: "string"
                },
                example: ["search_completed", "product_updated", "translation_completed"]
            },
            language_filters: {
                type: "array",
                items: {
                    type: "string"
                },
                example: ["de", "fr"]
            },
            status: {
                type: "string",
                enum: ["active", "paused", "disabled"],
                example: "active"
            },
            created_at: {
                type: "string",
                format: "date-time",
                example: "2023-04-14T10:30:22Z"
            }
        }
    },

    HistoricalDataResponse: {
        type: "object",
        properties: {
            product_id: {
                type: "string",
                example: "prod_98765"
            },
            content_history: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        timestamp: {
                            type: "string",
                            format: "date-time",
                            example: "2023-04-10T14:22:31Z"
                        },
                        field: {
                            type: "string",
                            example: "description"
                        },
                        language: {
                            type: "string",
                            example: "en"
                        },
                        previous_value: {
                            type: "string",
                            example: "Industry-leading noise cancellation with premium sound quality and long battery life."
                        },
                        new_value: {
                            type: "string",
                            example: "Industry-leading noise cancellation technology helps block out background noise..."
                        },
                        change_type: {
                            type: "string",
                            enum: ["add", "update", "remove"],
                            example: "update"
                        },
                        change_source: {
                            type: "string",
                            example: "enrichment"
                        },
                        change_reason: {
                            type: "string",
                            example: "Quality improvement"
                        }
                    }
                }
            },
            summarized_changes: {
                type: "object",
                properties: {
                    total_changes: {
                        type: "integer",
                        example: 17
                    },
                    by_field: {
                        type: "object",
                        additionalProperties: {
                            type: "integer"
                        },
                        example: {
                            "description": 3,
                            "attributes": 8,
                            "images": 6
                        }
                    },
                    by_language: {
                        type: "object",
                        additionalProperties: {
                            type: "integer"
                        },
                        example: {
                            "en": 10,
                            "de": 7
                        }
                    },
                    by_change_type: {
                        type: "object",
                        additionalProperties: {
                            type: "integer"
                        },
                        example: {
                            "add": 9,
                            "update": 8,
                            "remove": 0
                        }
                    }
                }
            }
        }
    },

    AnalyticsResponse: {
        type: "object",
        properties: {
            timeframe: {
                type: "string",
                example: "30d"
            },
            total_requests: {
                type: "integer",
                example: 3452
            },
            requests_by_endpoint: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        endpoint: {
                            type: "string",
                            example: "/search"
                        },
                        count: {
                            type: "integer",
                            example: 1245
                        },
                        percentage: {
                            type: "number",
                            format: "float",
                            example: 36.1
                        }
                    }
                }
            },
            requests_by_language: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        language: {
                            type: "string",
                            example: "en"
                        },
                        count: {
                            type: "integer",
                            example: 2134
                        },
                        percentage: {
                            type: "number",
                            format: "float",
                            example: 61.8
                        }
                    }
                }
            },
            average_processing_time_sec: {
                type: "object",
                properties: {
                    overall: {
                        type: "number",
                        format: "float",
                        example: 2.1
                    },
                    by_endpoint: {
                        type: "object",
                        additionalProperties: {
                            type: "number",
                            format: "float"
                        }
                    }
                }
            },
            credits_used: {
                type: "integer",
                example: 1240
            }
        }
    }
};
