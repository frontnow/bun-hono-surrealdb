# Historical Data API

Track changes to product information over time with our comprehensive historical data APIs.

## GET `/api/v1/products/{product_id}/history/content`
Monitor how product information has evolved over time.

### Query Parameters:
- `timeframe=30d` (1d, 7d, 30d, 90d, 1y, all)
- `fields=description,attributes,images` (selective loading)
- `lang=en` (language for text fields)

### Response:
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
