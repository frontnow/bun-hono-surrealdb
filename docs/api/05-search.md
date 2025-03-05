# Search API

Our powerful search capabilities help users find relevant products through a variety of parameters and filters.

## POST `/api/v1/search`
Initiate an asynchronous search operation with advanced options.

### Body:
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
### Response:
```json
{
  "job_id": "srch_12345",
  "status": "queued",
  "created_at": "2023-04-14T10:30:22Z"
}
```

## GET `/api/v1/search/{job_id}`
Retrieve the results of a previously initiated search.

### Response:
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
