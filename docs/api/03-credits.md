# Credits Management

The ProductGraph API uses a credit-based system to provide flexibility while maintaining fair usage. Different operations consume varying amounts of credits based on their complexity and resource requirements.

## Credit Consumption
- 1 Credit per search operation (includes the first product detail retrieval)
- Additional operations may consume extra credits depending on complexity

## GET `/api/v1/credits`
Check your current credit balance and usage statistics.

### Response:
```json
{
  "total_credits": 1000,
  "used_credits": 250,
  "remaining_credits": 750,
  "plan": "Startup",
  "credits_reset_at": "2023-05-01T00:00:00Z"
}
