# Error Handling

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

## Common Error Codes
- `invalid_credentials`: Authentication failed
- `rate_limit_exceeded`: Request rate limit reached
- `invalid_language`: Requested language not supported
- `resource_not_found`: Requested resource could not be found
- `insufficient_credits`: Not enough credits to complete the operation
