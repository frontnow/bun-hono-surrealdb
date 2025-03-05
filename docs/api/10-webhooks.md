# Webhooks

Stay informed about important events with real-time notifications through webhooks.

## POST `/api/v1/webhooks`
Configure webhook endpoints to receive notifications about specific events.

### Body:
```json
{
  "url": "https://your-callback-url.com/webhook",
  "events": ["search_completed", "product_updated", "translation_completed"],
  "language_filters": ["de", "fr"],  // Only trigger for these languages
  "secret": "your-webhook-secret"    // For signature verification
}
```
### Response:
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

## Webhook Events
Webhooks can be configured for a variety of event types:

- `search_completed`: Triggered when an asynchronous search operation completes
- `product_updated`: Triggered when product data is updated or enriched
- `translation_completed`: Triggered when a translation job completes
- `quality_score_changed`: Triggered when a product's quality score changes significantly

## Webhook Payload Examples

### search_completed:
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

### translation_completed:
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

## Security
All webhook payloads include a signature header for verification:

```
X-ProductGraph-Signature: sha256=hash
```

Verify this signature using your webhook secret to ensure the payload's authenticity.
