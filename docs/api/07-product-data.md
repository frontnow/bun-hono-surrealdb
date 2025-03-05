# Product Data API

Retrieve comprehensive product information with support for selective loading and multi-language content.

## GET `/api/v1/products/{product_id}`
Get detailed product information with language customization.

### Query Parameters: 
- `lang=en` or `languages=de,en,fr` (prioritized list)
- `fields=description,attributes,images` (selective loading)
- `include_translation_status=true|false` (optional, default: false)

### Response:
```json
{
  "product_id": "prod_98765",
  "name": {
    "en": "Sony WH-1000XM4 Wireless Noise-Canceling Headphones",
    "de": "Sony WH-1000XM4 Kabellose Noise-Cancelling-Kopfhörer"
  },
  "gtin": "4548736112001",
  "brand": {
    "id": "brand_sony",
    "name": "Sony",
    "display_name": {
      "en": "Brand",
      "de": "Marke"
    },
    "established": 1946,
    "country_of_origin": "Japan",
    "description": {
      "en": "Global electronics and entertainment company known for innovation and quality",
      "de": "Globales Elektronik- und Unterhaltungsunternehmen, bekannt für Innovation und Qualität"
    },
    "logo_url": "https://example.com/logos/sony_logo_primary.svg",
    "details_url": "/api/v1/brands/brand_sony"
  },
  "categories": [
    {
      "id": "cat_456",
      "name": {
        "en": "Wireless Headphones",
        "de": "Kabellose Kopfhörer"
      },
      "parent": "cat_123",
      "primary": true
    },
    {
      "id": "cat_789",
      "name": {
        "en": "Noise-Canceling Devices",
        "de": "Geräuschunterdrückende Geräte"
      },
      "parent": "cat_234",
      "primary": false
    }
  ],
  "content": {
    "short_description": {
      "en": "Premium wireless headphones with industry-leading noise cancellation and 30-hour battery life.",
      "de": "Premium-Funkkopfhörer mit branchenführender Geräuschunterdrückung und 30 Stunden Akkulaufzeit."
    },
    "description": {
      "en": "Industry-leading noise cancellation technology helps block out background noise for a more immersive listening experience. Enjoy premium sound quality with minimal distortion thanks to 40mm drivers and DSEE Extreme upscaling. Up to 30 hours of battery life with quick charging capability.",
      "de": "Branchenführende Geräuschunterdrückungstechnologie hilft, Hintergrundgeräusche auszublenden, für ein intensiveres Hörerlebnis. Genießen Sie erstklassige Klangqualität mit minimaler Verzerrung dank 40-mm-Treibern und DSEE Extreme-Upscaling. Bis zu 30 Stunden Akkulaufzeit mit Schnellladefunktion."
    },
    "markdown_description": {
      "en": "# Sony WH-1000XM4 Wireless Headphones\n\n## Industry-Leading Noise Cancellation\n\nExperience the next level of silence with industry-leading noise cancellation technology that intelligently eliminates unwanted sound.\n\n## Premium Sound Quality\n\n- **HD Noise Canceling Processor QN1**: Powerful processing for exceptional noise cancellation\n- **40mm Drivers**: Delivers rich, clear audio across the frequency spectrum\n- **DSEE Extreme**: AI-powered upscaling restores detail to compressed music\n\n## All-Day Comfort and Battery\n\nEnjoy up to **30 hours** of battery life with quick charging capability (5 hours of playback from just 10 minutes of charging).",
      "de": "# Sony WH-1000XM4 Kabellose Kopfhörer\n\n## Branchenführende Geräuschunterdrückung\n\nErleben Sie die nächste Stufe der Stille mit einer branchenführenden Geräuschunterdrückungstechnologie, die unerwünschte Geräusche intelligent eliminiert.\n\n## Erstklassige Klangqualität\n\n- **HD Noise Canceling Processor QN1**: Leistungsstarke Verarbeitung für außergewöhnliche Geräuschunterdrückung\n- **40-mm-Treiber**: Liefert reichen, klaren Klang über das gesamte Frequenzspektrum\n- **DSEE Extreme**: KI-gestützte Hochskalierung stellt Details in komprimierter Musik wieder her\n\n## Ganztägiger Komfort und Akku\n\nGenießen Sie bis zu **30 Stunden** Akkulaufzeit mit Schnellladefunktion (5 Stunden Wiedergabe nach nur 10 Minuten Laden)."
    },
    "key_benefits": [
      {
        "en": "Industry-leading noise cancellation",
        "de": "Branchenführende Geräuschunterdrückung"
      },
      {
        "en": "Exceptional sound quality with 40mm drivers",
        "de": "Außergewöhnliche Klangqualität mit 40-mm-Treibern"
      },
      {
        "en": "30-hour battery life with quick charging",
        "de": "30 Stunden Akkulaufzeit mit Schnellladefunktion"
      },
      {
        "en": "Speak-to-chat automatic pause function",
        "de": "Speak-to-Chat automatische Pausenfunktion"
      },
      {
        "en": "Multipoint connection to pair with two devices",
        "de": "Multipoint-Verbindung zur Kopplung mit zwei Geräten"
      }
    ],
    "usage_scenarios": {
      "en": "Perfect for daily commute, air travel, working from home, gym workouts, and focused study sessions. The adaptive sound control automatically adjusts settings based on your location and activities.",
      "de": "Perfekt für den täglichen Arbeitsweg, Flugreisen, Heimarbeit, Fitnessstudio-Training und konzentrierte Lernsitzungen. Die adaptive Klangsteuerung passt die Einstellungen automatisch an Ihren Standort und Ihre Aktivitäten an."
    },
    "technical_description": {
      "en": "The WH-1000XM4 features Sony's HD Noise Canceling Processor QN1 with dual noise sensor technology utilizing forward and feedback microphones for superior noise cancellation. It employs Bluetooth 5.0 with support for SBC, AAC, and LDAC codecs, offering high-resolution audio when paired with compatible devices. The Precise Voice Pickup technology uses 5 microphones and advanced audio signal processing for clearer hands-free calls.",
      "de": "Der WH-1000XM4 verfügt über Sonys HD Noise Canceling Processor QN1 mit Dual-Noise-Sensor-Technologie, die Vorwärts- und Feedback-Mikrofone für überlegene Geräuschunterdrückung nutzt. Er verwendet Bluetooth 5.0 mit Unterstützung für SBC-, AAC- und LDAC-Codecs und bietet hochauflösenden Klang, wenn er mit kompatiblen Geräten gekoppelt wird. Die Precise Voice Pickup-Technologie verwendet 5 Mikrofone und fortschrittliche Audiosignalverarbeitung für klarere Freisprechanrufe."
    },
    "comparison_points": [
      {
        "en": "Better noise cancellation than Bose QC45",
        "de": "Bessere Geräuschunterdrückung als Bose QC45"
      },
      {
        "en": "Superior sound quality to Apple AirPods Max",
        "de": "Überlegene Klangqualität gegenüber Apple AirPods Max"
      },
      {
        "en": "Longer battery life than Sennheiser Momentum 4",
        "de": "Längere Akkulaufzeit als Sennheiser Momentum 4"
      }
    ],
    "sustainability": {
      "en": "Packaging made from sustainable materials with plastic-free packaging goals. Sony's Green Management 2025 targets include eliminating plastic packaging and promoting product recycling programs.",
      "de": "Verpackung aus nachhaltigen Materialien mit plastikfreien Verpackungszielen. Sonys Ziele für Green Management 2025 umfassen die Beseitigung von Plastikverpackungen und die Förderung von Produktrecyclingprogrammen."
    },
    "awards": [
      {
        "id": "award_123",
        "title": {
          "en": "Product of the Year 2021",
          "de": "Produkt des Jahres 2021"
        },
        "issuer": {
          "en": "What Hi-Fi? Awards",
          "de": "What Hi-Fi? Awards"
        },
        "date": "2021-11-15",
        "logo_url": "https://example.com/awards/what-hi-fi-logo.png",
        "award_url": "https://www.whathifi.com/awards/2021/headphones",
        "description": {
          "en": "Recognized for outstanding performance, design excellence and value",
          "de": "Ausgezeichnet für hervorragende Leistung, exzellentes Design und Preis-Leistungs-Verhältnis"
        }
      }
    ]
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
    ]
  },
  "lifecycle": {
    "display_name": {
      "en": "Product Lifecycle",
      "de": "Produktlebenszyklus"
    },
    "release_date": "2020-08-20",
    "warranty": {
      "standard_period": {
        "value": 1,
        "unit": "year"
      }
    },
    "software_support": {
      "status": "active",
      "end_date": "2025-08-20",
      "latest_firmware": {
        "version": "2.5.0",
        "release_date": "2023-03-15"
      }
    }
  },
  "updated_at": "2023-04-12T09:45:33Z"
}
```

This is an abbreviated example of the product data response. The full response includes additional sections such as product family information, environmental impact data, compatibility details, and more complete documentation of features.
