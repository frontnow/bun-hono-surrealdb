# Multi-language Support

ProductGraph offers robust multi-language support, enabling you to serve global customers with localized product information while maintaining data consistency across languages.

## Language Selection
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

## Language Fallback Chain
Specify intelligent fallback options for when translations are incomplete:

```json
{
  "preferred_language": "de",
  "fallback_chain": ["en", "fr"]
}
```

## Translation Requests
Request new translations or updates to existing translations:

### POST `/api/v1/products/{product_id}/translate`
#### Body:
```json
{
  "target_languages": ["de", "fr"],
  "priority": "normal",
  "fields": ["description", "attributes", "seo"],
  "callback_url": "https://your-webhook.com/translation-completed"
}
```
#### Response:
```json
{
  "job_id": "tr_45678",
  "status": "queued",
  "estimated_completion": "2023-04-15T16:00:00Z"
}
```

## Multilingual Response Structure
ProductGraph provides a consistent structure for multilingual content across all product data:

### Text Fields & Content Structures

**Simple Text Fields** (e.g., name) use language-keyed objects:

```json
"name": {
  "en": "Sony WH-1000XM4 Wireless Noise-Canceling Headphones",
  "de": "Sony WH-1000XM4 Kabellose Noise-Cancelling-Kopfhörer"
}
```

**Rich Content Fields** are organized under a `content` object with various formats and types:

```json
"content": {
  // Different description formats for different use cases
  "short_description": {
    "en": "Premium wireless headphones with industry-leading noise cancellation and 30-hour battery life.",
    "de": "Premium-Funkkopfhörer mit branchenführender Geräuschunterdrückung und 30 Stunden Akkulaufzeit."
  },
  "description": {
    "en": "Industry-leading noise cancellation technology helps block out background noise...",
    "de": "Branchenführende Geräuschunterdrückungstechnologie hilft, Hintergrundgeräusche auszublenden..."
  },
  "markdown_description": {
    "en": "# Sony WH-1000XM4 Wireless Headphones\n\n## Industry-Leading Noise Cancellation...",
    "de": "# Sony WH-1000XM4 Kabellose Kopfhörer\n\n## Branchenführende Geräuschunterdrückung..."
  },
  
  // Array of multilingual key benefits
  "key_benefits": [
    {
      "en": "Industry-leading noise cancellation",
      "de": "Branchenführende Geräuschunterdrückung"
    },
    {
      "en": "Exceptional sound quality with 40mm drivers",
      "de": "Außergewöhnliche Klangqualität mit 40-mm-Treibern"
    }
  ],
  
  // Other specialized content types
  "technical_description": {
    "en": "The WH-1000XM4 features Sony's HD Noise Canceling Processor QN1...",
    "de": "Der WH-1000XM4 verfügt über Sonys HD Noise Canceling Processor QN1..."
  },
  
  // Frequently asked questions as structured data
  "faq": [
    {
      "question": {
        "en": "Can I connect to multiple devices simultaneously?",
        "de": "Kann ich mich mit mehreren Geräten gleichzeitig verbinden?"
      },
      "answer": {
        "en": "Yes, the WH-1000XM4 supports multipoint connection...",
        "de": "Ja, der WH-1000XM4 unterstützt Multipoint-Verbindung..."
      }
    }
  ]
}
```

### Attributes
Attributes support localized keys and values, nested hierarchies, and ISO-standardized measurements:

```json
"attributes": {
  "color": {
    "en": {
      "key": "Color",
      "value": "Black"
    },
    "de": {
      "key": "Farbe",
      "value": "schwarz"
    }
  },
  "technical": {
    "en": {
      "key": "Technical",
      "value": null
    },
    "de": {
      "key": "Technisch",
      "value": null
    },
    "children": {
      "connectivity": {
        "en": {
          "key": "Connectivity",
          "value": "Bluetooth 5.0"
        },
        "de": {
          "key": "Konnektivität",
          "value": "Bluetooth 5.0"
        }
      },
      "battery": {
        "en": {
          "key": "Battery",
          "value": null
        },
        "de": {
          "key": "Akku",
          "value": null
        },
        "children": {
          "battery_life": {
            "value": 30,
            "unit": "h",
            "en": {
              "key": "Battery Life",
              "formatted_value": "30 hours"
            },
            "de": {
              "key": "Akkulaufzeit",
              "formatted_value": "30 Stunden"
            }
          },
          "charging_time": {
            "value": 3,
            "unit": "h",
            "en": {
              "key": "Charging Time",
              "formatted_value": "3 hours"
            },
            "de": {
              "key": "Ladezeit", 
              "formatted_value": "3 Stunden"
            }
          }
        }
      }
    }
  },
  "weight": {
    "value": 254,
    "unit": "g",
    "en": {
      "key": "Weight",
      "formatted_value": "254 grams"
    },
    "en-US": {
      "key": "Weight",
      "formatted_value": "8.96 ounces"
    },
    "de": {
      "key": "Gewicht",
      "formatted_value": "254 Gramm"
    }
  }
}
```

### Media Content (images, videos, documents)
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

## Translation Status
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
