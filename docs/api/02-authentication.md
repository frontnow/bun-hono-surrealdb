# Authentication & Rate Limiting

## Authentication
Access to the ProductGraph API requires authentication for most operations. While some basic endpoints are available anonymously, full functionality requires an API key.

- **API Key**: Pass your unique API key via the `X-API-Key` header: 
  ```
  X-API-Key: your-api-key
  ```

## Rate Limits
We implement fair usage policies to ensure reliable service for all users:

- **Anonymous Requests**: Limited to 10 requests per day per IP address
- **Authenticated Requests**: Rate limits based on your subscription tier

All responses include rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 2023-04-15T16:00:00Z
