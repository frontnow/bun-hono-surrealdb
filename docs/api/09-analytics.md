# Analytics

Gain insights into API usage patterns and optimize your integration with our comprehensive analytics.

## GET `/api/v1/analytics/usage`
Get detailed insights into your API usage patterns.

### Query Parameters:
- `timeframe=30d` (1d, 7d, 30d, 90d, 1y)
- `group_by=endpoint,language` (group metrics)

### Response:
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
