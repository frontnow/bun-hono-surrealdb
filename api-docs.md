# ProductGraph.org REST API Documentation

## Overview

ProductGraph.org provides a comprehensive product data enrichment and management service designed to enhance product data quality across multiple languages. Our API enables businesses to access detailed product information, track changes over time, and manage product content efficiently.

### What this API Provides:
* Product searches using names, GTINs, or URLs
* Detailed enrichment (descriptions, attributes, documents, images, videos, reviews)
* SEO optimization data
* AI-driven image enrichment
* Data quality scoring and issue tracking
* Multi-language product data handling
* Historical product data 
* Asynchronous processing with status tracking
* Webhooks for real-time notifications
* Detailed analytics and usage reporting

### What this API Does NOT Provide:
* Competitor analysis
* Prices and availability information
* Demand forecasting or trend analysis
* Sustainability or regulatory compliance data
* Real-time inventory management
* Product recommendations

## Authentication & Rate Limiting

### Authentication
Access to the ProductGraph API requires authentication for most operations. While some basic endpoints are available anonymously, full functionality requires an API key.

- **API Key**: Pass your unique API key via the `X-API-Key` header: 
  ```
  X-API-Key: your-api-key
  ```

### Rate Limits
We implement fair usage policies to ensure reliable service for all users:

- **Anonymous Requests**: Limited to 10 requests per day per IP address
- **Authenticated Requests**: Rate limits based on your subscription tier

All responses include rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 2023-04-15T16:00:00Z
```

## Credits Management

The ProductGraph API uses a credit-based system to provide flexibility while maintaining fair usage. Different operations consume varying amounts of credits based on their complexity and resource requirements.

### Credit Consumption
- 1 Credit per search operation (includes the first product detail retrieval)
- Additional operations may consume extra credits depending on complexity

### GET `/api/v1/credits`
Check your current credit balance and usage statistics.

#### Response:
```json
{
  "total_credits": 1000,
  "used_credits": 250,
  "remaining_credits": 750,
  "plan": "Startup",
  "credits_reset_at": "2023-05-01T00:00:00Z"
}
```

## Multi-language Support

ProductGraph offers robust multi-language support, enabling you to serve global customers with localized product information while maintaining data consistency across languages.

### Language Selection
We provide three flexible ways to specify your language preferences:

1. **Query Parameter (request-specific)**: 
   - `?lang=de` for a single language
   - `?languages=de,en,fr` for a prioritized list of languages

2. **Request Header (session-specific)**:
   - Standard HTTP language negotiation: `Accept-Language: de-DE, de;q=0.9, en;q=0.8`
   - Follows RFC 7231 specification for language priority

3. **Account Default Setting**:
   - Configure default languages through your account settings
   - Applied automatically when no specific language parameters are provided

### Language Fallback Chain
Specify intelligent fallback options for when translations are incomplete:

```json
{
  "preferred_language": "de",
  "fallback_chain": ["en", "fr"]
}
```

### Translation Requests
Request new translations or updates to existing translations:

#### POST `/api/v1/products/{product_id}/translate`
##### Body:
```json
{
  "target_languages": ["de", "fr"],
  "priority": "normal",
  "fields": ["description", "attributes", "seo"],
  "callback_url": "https://your-webhook.com/translation-completed"
}
```
##### Response:
```json
{
  "job_id": "tr_45678",
  "status": "queued",
  "estimated_completion": "2023-04-15T16:00:00Z"
}
```

### Multilingual Response Structure
ProductGraph provides a consistent structure for multilingual content across all product data:

#### Text Fields (name, description, etc.)
Text fields use simple language-keyed objects:

```json
"name": {
  "en": "Sony WH-1000XM4 Wireless Noise-Canceling Headphones",
  "de": "Sony WH-1000XM4 Kabellose Noise-Cancelling-Kopfhörer"
}
```

#### Attributes
Attributes support localized keys and values while maintaining a consistent structure:

```json
"attributes": {
  "color": {
    "en": {
      "key": "color",
      "value": "black"
    },
    "de": {
      "key": "Farbe",
      "value": "schwarz"
    }
  },
  "weight": {
    "en": {
      "key": "weight",
      "value": "8.96 ounces"
    },
    "de": {
      "key": "Gewicht",
      "value": "254 Gramm"
    }
  }
}
```

#### Media Content (images, videos, documents)
Media content uses simple language indicators:

```json
"images": [
  {
    "url": "https://example.com/images/product-front.jpg",
    "language": "neutral"  // No specific language
  }
],
"videos": [
  {
    "url": "https://example.com/videos/product-overview.mp4",
    "language": "en"  // English video
  },
  {
    "url": "https://example.com/videos/product-overview-de.mp4",
    "language": "de"  // German video
  }
],
"documents": [
  {
    "type": "user_manual",
    "url": "https://example.com/docs/manual-en.pdf",
    "language": "en"
  }
]
```

### Translation Status
Translation status information is optional and only included when explicitly requested:

```
GET /api/v1/products/{product_id}?include_translation_status=true
```

When requested, the API includes translation status at the root level:

```json
"translation_status": {
  "en": {"completion_percentage": 100, "last_updated": "2023-04-10T14:22:31Z"},
  "de": {"completion_percentage": 95, "last_updated": "2023-04-11T16:33:42Z"},
  "fr": {"completion_percentage": 42, "last_updated": "2023-04-08T11:15:27Z"}
}
```

## Search API

Our powerful search capabilities help users find relevant products through a variety of parameters and filters.

### POST `/api/v1/search`
Initiate an asynchronous search operation with advanced options.

#### Body:
```json
{
  "query": "wireless headphones",
  "languages": ["de", "en"],  // Priority order
  "cross_language_search": true,  // Search across all available languages
  "result_language": "de",  // Preferred language for results
  "filter": {
    "brand": "Sony",
    "category": "Electronics",
    "attributes": {"color": "black", "wireless": true}
  },
  "sort": {"field": "relevance", "order": "desc"}
}
```
#### Response:
```json
{
  "job_id": "srch_12345",
  "status": "queued",
  "created_at": "2023-04-14T10:30:22Z"
}
```

### GET `/api/v1/search/{job_id}`
Retrieve the results of a previously initiated search.

#### Response:
```json
{
  "job_id": "srch_12345",
  "status": "completed",
  "query": "wireless headphones",
  "results": [
    {
      "product_id": "prod_98765",
      "name": {
        "en": "Sony WH-1000XM4 Wireless Noise-Canceling Headphones",
        "de": "Sony WH-1000XM4 Kabellose Noise-Cancelling-Kopfhörer"
      },
      "gtin": "4548736112001",
      "score": 0.95,
      "language_match": {
        "matched_language": "de",
        "original_query_language": "en",
        "confidence": 0.92
      },
      "summary": {
        "en": "Premium noise-canceling wireless headphones with exceptional sound quality",
        "de": "Premium-Noise-Cancelling-Kopfhörer mit außergewöhnlicher Klangqualität"
      },
      "brand": "Sony",
      "main_image_url": "https://example.com/images/sony-wh1000xm4.jpg"
    }
  ],
  "facets": {
    "brand": [{"name": "Sony", "count": 12}, {"name": "Bose", "count": 8}],
    "category": [{"name": "Headphones", "count": 28}, {"name": "Audio", "count": 42}],
    "attributes": {
      "color": [{"name": "Black", "count": 18}, {"name": "White", "count": 12}],
      "noise_canceling": [{"name": "true", "count": 24}]
    }
  },
  "created_at": "2023-04-14T10:30:22Z",
  "completed_at": "2023-04-14T10:31:15Z",
  "total_results": 124,
  "page": 1,
  "total_pages": 13
}
```

## Product Data API

Retrieve comprehensive product information with support for selective loading and multi-language content.

### GET `/api/v1/products/{product_id}`
Get detailed product information with language customization.

#### Query Parameters: 
- `lang=en` or `languages=de,en,fr` (prioritized list)
- `fields=description,attributes,images` (selective loading)
- `include_translation_status=true|false` (optional, default: false)

#### Response:
```json
{
  "product_id": "prod_98765",
  "name": {
    "en": "Sony WH-1000XM4 Wireless Noise-Canceling Headphones",
    "de": "Sony WH-1000XM4 Kabellose Noise-Cancelling-Kopfhörer"
  },
  "gtin": "4548736112001",
  "brand": "Sony",
  "category": {
    "en": "Wireless Headphones",
    "de": "Kabellose Kopfhörer"
  },
  "description": {
    "en": "Industry-leading noise cancellation technology helps block out background noise for a more immersive listening experience. Enjoy premium sound quality with minimal distortion thanks to 40mm drivers and DSEE Extreme upscaling. Up to 30 hours of battery life with quick charging capability.",
    "de": "Branchenführende Geräuschunterdrückungstechnologie hilft, Hintergrundgeräusche auszublenden, für ein intensiveres Hörerlebnis. Genießen Sie erstklassige Klangqualität mit minimaler Verzerrung dank 40-mm-Treibern und DSEE Extreme-Upscaling. Bis zu 30 Stunden Akkulaufzeit mit Schnellladefunktion."
  },
  "attributes": {
    "color": {
      "en": {
        "key": "color",
        "value": "black"
      },
      "de": {
        "key": "Farbe",
        "value": "schwarz"
      }
    },
    "weight": {
      "en": {
        "key": "weight",
        "value": "8.96 ounces"
      },
      "de": {
        "key": "Gewicht",
        "value": "254 Gramm"
      }
    },
    "battery_life": {
      "en": {
        "key": "battery life",
        "value": "30 hours"
      },
      "de": {
        "key": "Akkulaufzeit",
        "value": "30 Stunden"
      }
    },
    "noise_cancellation": {
      "en": {
        "key": "noise cancellation",
        "value": "yes"
      },
      "de": {
        "key": "Geräuschunterdrückung",
        "value": "ja"
      }
    },
    "connectivity": {
      "en": {
        "key": "connectivity",
        "value": "Bluetooth 5.0"
      },
      "de": {
        "key": "Konnektivität",
        "value": "Bluetooth 5.0"
      }
    }
  },
  "images": [
    {
      "url": "https://example.com/images/sony-wh1000xm4-front.jpg",
      "language": "neutral"
    },
    {
      "url": "https://example.com/images/sony-wh1000xm4-side.jpg",
      "language": "neutral"
    },
    {
      "url": "https://example.com/images/sony-wh1000xm4-folded.jpg",
      "language": "neutral"
    }
  ],
  "videos": [
    {
      "url": "https://example.com/videos/sony-wh1000xm4-overview.mp4",
      "language": "en"
    },
    {
      "url": "https://example.com/videos/sony-wh1000xm4-overview-de.mp4",
      "language": "de"
    }
  ],
  "documents": [
    {
      "type": "user_manual",
      "url": "https://example.com/docs/sony-wh1000xm4-manual-en.pdf",
      "language": "en"
    },
    {
      "type": "user_manual",
      "url": "https://example.com/docs/sony-wh1000xm4-manual-de.pdf",
      "language": "de"
    },
    {
      "type": "quick_start_guide",
      "url": "https://example.com/docs/sony-wh1000xm4-quickstart-en.pdf",
      "language": "en"
    }
  ],
  "reviews": [
    {
      "rating": 5,
      "author": "AudioEnthusiast",
      "text": "Exceptional noise cancellation and sound quality. Worth every penny.",
      "language": "en",
      "date": "2023-03-15T18:22:31Z",
      "verified_purchase": true
    }
  ],
  "seo": {
    "en": {
      "title": "Sony WH-1000XM4 Wireless Noise-Canceling Headphones - Premium Sound Quality",
      "meta_description": "Experience industry-leading noise cancellation and exceptional sound quality with Sony WH-1000XM4 wireless headphones. 30-hour battery life and premium comfort.",
      "keywords": ["noise-canceling headphones", "wireless headphones", "Sony WH-1000XM4", "premium headphones"],
      "structured_data": "{\"@context\":\"https://schema.org\",\"@type\":\"Product\",\"name\":\"Sony WH-1000XM4\",\"brand\":{\"@type\":\"Brand\",\"name\":\"Sony\"}}"
    },
    "de": {
      "title": "Sony WH-1000XM4 Kabellose Noise-Cancelling-Kopfhörer - Premium-Klangqualität",
      "meta_description": "Erleben Sie branchenführende Geräuschunterdrückung und außergewöhnliche Klangqualität mit den kabellosen Sony WH-1000XM4 Kopfhörern. 30 Stunden Akkulaufzeit und erstklassiger Komfort.",
      "keywords": ["Noise-Cancelling-Kopfhörer", "kabellose Kopfhörer", "Sony WH-1000XM4", "Premium-Kopfhörer"],
      "structured_data": "{\"@context\":\"https://schema.org\",\"@type\":\"Product\",\"name\":\"Sony WH-1000XM4\",\"brand\":{\"@type\":\"Brand\",\"name\":\"Sony\"}}"
    }
  },
  "images_enrichment": {
    "processed_images": [
      {
        "original_url": "https://example.com/images/sony-wh1000xm4-front.jpg",
        "processed_url": "https://example.com/processed/sony-wh1000xm4-front-enhanced.jpg",
        "tags": ["headphones", "electronics", "black", "over-ear", "noise-canceling"],
        "auto_alt_text": {
          "en": "Black Sony WH-1000XM4 over-ear wireless headphones with cushioned earpads",
          "de": "Schwarze Sony WH-1000XM4 Over-Ear-Funkkopfhörer mit gepolsterten Ohrpolstern"
        },
        "background_removal_url": "https://example.com/processed/sony-wh1000xm4-front-nobg.png",
        "detection": {
          "primary_color": "#191919",
          "color_palette": ["#191919", "#303030", "#8D8D8D"],
          "objects": [
            {"label": "headphones", "confidence": 0.98, "bounding_box": {"x": 0.1, "y": 0.2, "width": 0.8, "height": 0.6}}
          ]
        }
      }
    ]
  },
  "quality_score": {
    "score": 92,
    "breakdown": {
      "images": 95,
      "description": 90,
      "attributes": 95,
      "overall_completeness": 88
    },
    "issues": [
      {"severity": "low", "description": "French translation incomplete", "field": "description", "language": "fr"},
      {"severity": "suggestion", "description": "Could benefit from additional lifestyle images", "field": "images"}
    ],
    "improvement_recommendations": [
      "Complete French translations",
      "Add lifestyle product images showing the headphones in use"
    ]
  },
  "updated_at": "2023-04-12T09:45:33Z"
}
```

## Historical Data API

Track changes to product information over time with our comprehensive historical data APIs.

### GET `/api/v1/products/{product_id}/history/content`
Monitor how product information has evolved over time.

#### Query Parameters:
- `timeframe=30d` (1d, 7d, 30d, 90d, 1y, all)
- `fields=description,attributes,images` (selective loading)
- `lang=en` (language for text fields)

#### Response:
```json
{
  "product_id": "prod_98765",
  "content_history": [
    {
      "timestamp": "2023-04-10T14:22:31Z",
      "field": "description",
      "language": "en",
      "previous_value": "Industry-leading noise cancellation with premium sound quality and long battery life.",
      "new_value": "Industry-leading noise cancellation technology helps block out background noise for a more immersive listening experience. Enjoy premium sound quality with minimal distortion thanks to 40mm drivers and DSEE Extreme upscaling. Up to 30 hours of battery life with quick charging capability.",
      "change_type": "update",
      "change_source": "enrichment",
      "change_reason": "Quality improvement"
    },
    {
      "timestamp": "2023-04-09T08:15:22Z",
      "field": "attributes",
      "language": "en",
      "attribute_key": "connectivity",
      "previous_value": "Bluetooth",
      "new_value": "Bluetooth 5.0",
      "change_type": "update",
      "change_source": "manual_correction",
      "change_reason": "Technical specification update"
    },
    {
      "timestamp": "2023-04-07T16:42:15Z",
      "field": "images",
      "previous_value": null,
      "new_value": "https://example.com/images/sony-wh1000xm4-folded.jpg",
      "change_type": "add",
      "change_source": "enrichment"
    }
  ],
  "summarized_changes": {
    "total_changes": 17,
    "by_field": {
      "description": 3,
      "attributes": 8,
      "images": 6
    },
    "by_language": {
      "en": 10,
      "de": 7
    },
    "by_change_type": {
      "add": 9,
      "update": 8,
      "remove": 0
    }
  }
}
```

## Analytics

Gain insights into API usage patterns and optimize your integration with our comprehensive analytics.

### GET `/api/v1/analytics/usage`
Get detailed insights into your API usage patterns.

#### Query Parameters:
- `timeframe=30d` (1d, 7d, 30d, 90d, 1y)
- `group_by=endpoint,language` (group metrics)

#### Response:
```json
{
  "timeframe": "30d",
  "total_requests": 3452,
  "requests_by_endpoint": [
    {"endpoint": "/search", "count": 1245, "percentage": 36.1},
    {"endpoint": "/products/{product_id}", "count": 987, "percentage": 28.6},
    {"endpoint": "/products/{product_id}/translate", "count": 428, "percentage": 12.4}
  ],
  "requests_by_language": [
    {"language": "en", "count": 2134, "percentage": 61.8},
    {"language": "de", "count": 876, "percentage": 25.4},
    {"language": "fr", "count": 442, "percentage": 12.8}
  ],
  "average_processing_time_sec": {
    "overall": 2.1,
    "by_endpoint": {
      "/search": 3.2,
      "/products/{product_id}": 1.5,
      "/products/{product_id}/translate": 5.7
    }
  },
  "credits_used": 1240,
  "top_search_queries": [
    {"query": "wireless headphones", "count": 87, "percentage": 7.0},
    {"query": "bluetooth speaker", "count": 65, "percentage": 5.2}
  ],
  "top_products_viewed": [
    {"product_id": "prod_98765", "name": "Sony WH-1000XM4", "count": 124, "percentage": 12.6}
  ],
  "translation_usage": {
    "total_translation_requests": 324,
    "by_language": [
      {"language": "de", "count": 156, "percentage": 48.1},
      {"language": "fr", "count": 98, "percentage": 30.2},
      {"language": "es", "count": 70, "percentage": 21.7}
    ]
  },
  "usage_trends": {
    "daily_requests": [
      {"date": "2023-04-01", "count": 112},
      {"date": "2023-04-02", "count": 98}
    ],
    "weekly_comparison": {
      "current_week": 843,
      "previous_week": 792,
      "change_percentage": 6.4
    }
  }
}
```

## Webhooks

Stay informed about important events with real-time notifications through webhooks.

### POST `/api/v1/webhooks`
Configure webhook endpoints to receive notifications about specific events.

#### Body:
```json
{
  "url": "https://your-callback-url.com/webhook",
  "events": ["search_completed", "product_updated", "translation_completed"],
  "language_filters": ["de", "fr"],  // Only trigger for these languages
  "secret": "your-webhook-secret"    // For signature verification
}
```
#### Response:
```json
{
  "webhook_id": "wh_34567",
  "url": "https://your-callback-url.com/webhook",
  "events": ["search_completed", "product_updated", "translation_completed"],
  "language_filters": ["de", "fr"],
  "status": "active",
  "created_at": "2023-04-14T10:30:22Z"
}
```

### Webhook Events
Webhooks can be configured for a variety of event types:

- `search_completed`: Triggered when an asynchronous search operation completes
- `product_updated`: Triggered when product data is updated or enriched
- `translation_completed`: Triggered when a translation job completes
- `quality_score_changed`: Triggered when a product's quality score changes significantly

### Webhook Payload Examples

#### search_completed:
```json
{
  "event": "search_completed",
  "webhook_id": "wh_34567",
  "job_id": "srch_12345",
  "status": "completed",
  "query": "wireless headphones",
  "result_count": 42,
  "timestamp": "2023-04-14T10:31:15Z"
}
```

#### translation_completed:
```json
{
  "event": "translation_completed",
  "webhook_id": "wh_34567",
  "product_id": "prod_98765",
  "language": "de",
  "completion_percentage": 100,
  "fields_translated": ["description", "attributes", "seo"],
  "timestamp": "2023-04-12T15:33:42Z"
}
```

### Security
All webhook payloads include a signature header for verification:

```
X-ProductGraph-Signature: sha256=hash
```

Verify this signature using your webhook secret to ensure the payload's authenticity.

## Best Practices

### Language Handling
- Always specify which languages you need to minimize response size and optimize performance.
- Use language priority lists (`languages=de,en,fr`) to ensure sensible fallbacks.
- When displaying product attributes, use the localized keys (`key` field) and values for a better user experience.

### Performance Optimization
- Use selective loading (`fields=description,attributes,images`) to minimize response size.
- Implement caching strategies based on the `updated_at` timestamps.
- Use asynchronous APIs for resource-intensive operations like search.

### Translation Management
- Prioritize translation of the most important fields (name, description, key attributes).
- Monitor translation status with the `include_translation_status=true` parameter when needed.
- Use webhooks to receive notifications when translations are completed.

## Error Handling

The API uses standard HTTP status codes and provides detailed error messages:

```json
{
  "error": {
    "code": "invalid_language",
    "message": "The requested language 'xyz' is not supported.",
    "documentation_url": "https://productgraph.org/docs/errors#invalid_language"
  }
}
```

Common error codes:
- `invalid_credentials`: Authentication failed
- `rate_limit_exceeded`: Request rate limit reached
- `invalid_language`: Requested language not supported
- `resource_not_found`: Requested resource could not be found
- `insufficient_credits`: Not enough credits to complete the operation