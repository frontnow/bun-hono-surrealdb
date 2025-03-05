# Brand API

Access comprehensive information about product brands, including their identity, values, and corporate details.

## GET `/api/v1/brands/{brand_id}`
Retrieve a specific brand by its unique identifier.

### Response:
```json
{
  "id": "brand_sony",
  "name": "Sony",
  "searchable_aliases": ["sony corporation", "sony electronics"],
  "established": 1946,
  "display_name": {
    "en": "Brand",
    "de": "Marke"
  },
  "headquarters": {
    "city": "Tokyo",
    "country": "Japan"
  },
  "brand_values": [
    {
      "name": {
        "en": "Innovation",
        "de": "Innovation"
      },
      "description": {
        "en": "Pushing the boundaries of what's possible",
        "de": "Die Grenzen des Möglichen verschieben"
      }
    }
  ],
  "brand_identity": {
    "logo": {
      "primary_url": "https://example.com/logos/sony_logo_primary.svg",
      "monochrome_url": "https://example.com/logos/sony_logo_mono.svg"
    }
  },
  "divisions": [
    {
      "name": "Sony Electronics",
      "products": ["TVs", "Audio", "Cameras"]
    }
  ]
}
```

## GET `/api/v1/brands/search`
Search for brands using various criteria.

### Query Parameters:
- `query=Sony` (text to search in name and aliases)
- `established_after=1940` (filter by establishment year)
- `country=Japan` (filter by country)

### Response Example:
```json
{
  "results": [
    {
      "id": "brand_sony",
      "name": "Sony",
      "established": 1946,
      "headquarters": {
        "country": "Japan"
      },
      "logo_url": "https://example.com/logos/sony_logo.svg"
    }
  ],
  "total": 1,
  "page": 1,
  "pages": 1
}
