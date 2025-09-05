export const apiData = {
  "v1-redemption-planner": {
    "name": "Redemption Planner",
    "endpoint": "/v1/redemptions/calculate",
    "methods": [
      "POST"
    ],
    "status": "coming-soon",
    "description": "Calculate the best way to redeem reward points.",
    "category": "Card APIs",
    "purpose": "Help users maximize the value of their accumulated reward points.",
    "requestSchema": {
      "type": "object",
      "properties": {
        "points": {
          "type": "integer",
          "description": "The number of points to calculate redemption options for."
        },
        "preferred_redemption_types": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "An array of preferred redemption types (e.g., \"cash\")."
        }
      }
    },
    "sampleRequest": {
      "points": 35000,
      "preferred_redemption_types": [
        "cash",
        "amazon_voucher",
        "air_miles"
      ]
    },
    "sampleResponse": {
      "best_option": {
        "type": "cash",
        "conversion_rate": 0.25,
        "estimated_value_inr": 8750,
        "redeem_url": "https://example.com/redeem?pts=35000"
      },
      "options": [
        {
          "type": "cash",
          "conversion_rate": 0.25,
          "estimated_value_inr": 8750
        },
        {
          "type": "amazon_voucher",
          "conversion_rate": 0.2,
          "estimated_value_inr": 7000
        },
        {
          "type": "air_miles",
          "conversion_rate": 0.3,
          "estimated_value_inr": 10500
        }
      ]
    },
    "responseSchema": {
      "type": "object",
      "properties": {
        "best_option": {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "description": "Type of redemption (cash, amazon_voucher, air_miles, etc.)"
            },
            "conversion_rate": {
              "type": "number",
              "description": "Points to INR conversion rate"
            },
            "estimated_value_inr": {
              "type": "number",
              "description": "Estimated value in INR"
            },
            "redeem_url": {
              "type": "string",
              "description": "URL to redeem points"
            }
          }
        },
        "options": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "type": {
                "type": "string",
                "description": "Redemption type"
              },
              "conversion_rate": {
                "type": "number",
                "description": "Conversion rate"
              },
              "estimated_value_inr": {
                "type": "number",
                "description": "Estimated value in INR"
              }
            }
          }
        }
      }
    },
    "errorResponse": {
      "status": "error",
      "message": "Redemption planner request failed",
      "data": null,
      "error_code": "REDEMPTION_001"
    },
    "validationNotes": [],
    "fieldTable": []
  },
  "v1-instant-offers": {
    "name": "Instant Offers",
    "endpoint": "/v1/cards/{card_slug}/offers",
    "methods": [
      "GET"
    ],
    "status": "coming-soon",
    "description": "Get live issuer–brand promotions for a specific card.",
    "category": "Card APIs",
    "purpose": "Display relevant, real-time offers and deals associated with a card.",
    "sampleResponse": {
      "offers": [
        {
          "merchant": "Swiggy",
          "headline": "15% off Tue",
          "valid_till": "2025-12-31"
        }
      ]
    },
    "requestSchema": {},
    "responseSchema": {
      "type": "object",
      "properties": {
        "offers": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "merchant": {
                "type": "string",
                "description": "Merchant name"
              },
              "headline": {
                "type": "string",
                "description": "Offer headline"
              },
              "valid_till": {
                "type": "string",
                "description": "Offer validity date"
              },
              "discount_percentage": {
                "type": "number",
                "description": "Discount percentage"
              },
              "terms": {
                "type": "string",
                "description": "Offer terms and conditions"
              }
            }
          }
        }
      }
    },
    "sampleRequest": {},
    "errorResponse": {
      "status": "error",
      "message": "Instant offers request failed",
      "data": null,
      "error_code": "OFFERS_001"
    },
    "validationNotes": [],
    "fieldTable": []
  },
  "v1-lounge-finder": {
    "name": "Lounge Finder",
    "endpoint": "/v1/cards/{card_slug}/lounges",
    "methods": [
      "GET"
    ],
    "status": "coming-soon",
    "description": "Get airport and railway lounge access details for a specific card.",
    "category": "Card APIs",
    "purpose": "Provide users with information about their travel lounge benefits.",
    "sampleResponse": {
      "domestic_lounges_per_quarter": 4,
      "international_lounges_per_year": 2,
      "railway_lounges_per_quarter": 4,
      "lounge_networks": [
        "Priority Pass"
      ],
      "terms": "Primary only"
    },
    "requestSchema": {},
    "responseSchema": {
      "type": "object",
      "properties": {
        "domestic_lounges_per_quarter": {
          "type": "integer",
          "description": "Number of domestic lounge visits per quarter"
        },
        "international_lounges_per_year": {
          "type": "integer",
          "description": "Number of international lounge visits per year"
        },
        "railway_lounges_per_quarter": {
          "type": "integer",
          "description": "Number of railway lounge visits per quarter"
        },
        "lounge_networks": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "List of lounge networks (e.g., Priority Pass, DreamFolks)"
        },
        "terms": {
          "type": "string",
          "description": "Terms and conditions for lounge access"
        },
        "airports": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "terminal": {
                "type": "string"
              },
              "lounge_name": {
                "type": "string"
              }
            }
          },
          "description": "List of available airport lounges"
        }
      }
    },
    "sampleRequest": {},
    "errorResponse": {
      "status": "error",
      "message": "Lounge finder request failed",
      "data": null,
      "error_code": "LOUNGE_001"
    },
    "validationNotes": [],
    "fieldTable": []
  },
  "v1-omni": {
    "name": "Omni Endpoint",
    "endpoint": "/v1/cards/omni",
    "methods": [
      "POST"
    ],
    "status": "coming-soon",
    "description": "A single endpoint to get nested data from multiple modules.",
    "category": "Card APIs",
    "purpose": "Enable low-development integrations by fetching multiple data types in one API call.",
    "sampleRequest": {
      "include_banks": true,
      "include_categories": true,
      "include_cards": true,
      "include_recommendations": true,
      "include_offers": true,
      "include_lounges": true,
      "include_redemptions": true
    },
    "sampleResponse": {
      "banks": [
        {
          "id": 1,
          "name": "Axis Bank",
          "logo": "https://example.com/axis.png"
        }
      ],
      "categories": [
        {
          "id": 1,
          "name": "Fuel",
          "seo_alias": "fuel"
        }
      ],
      "cards": [
        {
          "id": 27,
          "name": "SBI Cashback Credit Card",
          "card_alias": "sbi-cashback-credit-card"
        }
      ],
      "recommendations": [
        {
          "card_id": 27,
          "reason": "Best for online shopping"
        }
      ],
      "offers": [
        {
          "merchant": "Swiggy",
          "headline": "15% off Tue",
          "valid_till": "2025-12-31"
        }
      ],
      "lounges": {
        "domestic_lounges_per_quarter": 4,
        "international_lounges_per_year": 2
      },
      "redemptions": {
        "available_points": 5000,
        "redemption_options": [
          "cash",
          "vouchers"
        ]
      }
    },
    "requestSchema": {
      "type": "object",
      "properties": {
        "include_banks": {
          "type": "boolean",
          "description": "Include bank data in response"
        },
        "include_categories": {
          "type": "boolean",
          "description": "Include category data in response"
        },
        "include_cards": {
          "type": "boolean",
          "description": "Include card data in response"
        },
        "include_recommendations": {
          "type": "boolean",
          "description": "Include recommendations in response"
        },
        "include_offers": {
          "type": "boolean",
          "description": "Include offers in response"
        },
        "include_lounges": {
          "type": "boolean",
          "description": "Include lounge data in response"
        },
        "include_redemptions": {
          "type": "boolean",
          "description": "Include redemption data in response"
        }
      }
    },
    "responseSchema": {
      "type": "object",
      "properties": {
        "banks": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {
                "type": "integer"
              },
              "name": {
                "type": "string"
              },
              "logo": {
                "type": "string"
              }
            }
          }
        },
        "categories": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {
                "type": "integer"
              },
              "name": {
                "type": "string"
              },
              "seo_alias": {
                "type": "string"
              }
            }
          }
        },
        "cards": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {
                "type": "integer"
              },
              "name": {
                "type": "string"
              },
              "card_alias": {
                "type": "string"
              }
            }
          }
        },
        "recommendations": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "card_id": {
                "type": "integer"
              },
              "reason": {
                "type": "string"
              }
            }
          }
        },
        "offers": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "merchant": {
                "type": "string"
              },
              "headline": {
                "type": "string"
              },
              "valid_till": {
                "type": "string"
              }
            }
          }
        },
        "lounges": {
          "type": "object",
          "properties": {
            "domestic_lounges_per_quarter": {
              "type": "integer"
            },
            "international_lounges_per_year": {
              "type": "integer"
            }
          }
        },
        "redemptions": {
          "type": "object",
          "properties": {
            "available_points": {
              "type": "integer"
            },
            "redemption_options": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        }
      }
    },
    "errorResponse": {
      "status": "error",
      "message": "Omni endpoint request failed",
      "data": null,
      "error_code": "OMNI_001"
    },
    "validationNotes": [],
    "fieldTable": []
  },
  "v1-webhooks": {
    "name": "Webhooks Subscription",
    "endpoint": "/v1/webhooks",
    "methods": [
      "POST"
    ],
    "status": "coming-soon",
    "description": "Subscribe to webhook events for real-time notifications.",
    "category": "Card APIs",
    "purpose": "Allow partners to receive real-time updates on events like application status changes.",
    "requestSchema": {
      "type": "object",
      "properties": {
        "url": {
          "type": "string",
          "description": "The URL to send webhook events to."
        },
        "events": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "An array of event names to subscribe to (e.g., \"application.approved\")."
        }
      }
    },
    "sampleRequest": {
      "url": "https://partner.com/hook",
      "events": [
        "application.approved",
        "reward.posted",
        "card.activated"
      ]
    },
    "sampleResponse": {
      "success": true,
      "message": "Webhook subscription created successfully.",
      "webhook_id": "wh_1a2b3c4d5e"
    },
    "responseSchema": {
      "type": "object",
      "properties": {
        "success": {
          "type": "boolean",
          "description": "Whether the webhook subscription was created successfully"
        },
        "message": {
          "type": "string",
          "description": "Success or error message"
        },
        "webhook_id": {
          "type": "string",
          "description": "Unique identifier for the webhook subscription"
        }
      }
    },
    "errorResponse": {
      "status": "error",
      "message": "Webhook subscription failed",
      "data": null,
      "error_code": "WEBHOOK_001"
    },
    "validationNotes": [],
    "fieldTable": []
  },
  "cardgenius/cards/calculate": {
    "name": "Card Genius Calculator",
    "endpoint": "/cardgenius/cards/calculate",
    "description": "Given a detailed spend profile, ranks cards by potential annual savings.",
    "category": "Card APIs",
    "products": [
      "Card Genius"
    ],
    "purpose": "Drive personalised recommendations on the \"Card Genius\" results page.",
    "methods": [
      "POST"
    ],
    "status": "live",
    "rank": 9,
    "requestSchema": {
      "type": "object",
      "properties": {
        "amazon_spends": {
          "type": "number",
          "description": "Total spending on Amazon."
        },
        "flipkart_spends": {
          "type": "number",
          "description": "Total spending on Flipkart."
        },
        "other_online_spends": {
          "type": "number",
          "description": "Total spending on other online platforms."
        },
        "other_offline_spends": {
          "type": "number",
          "description": "Total spending on other offline platforms."
        },
        "grocery_spends_online": {
          "type": "number",
          "description": "Total online grocery spending."
        },
        "online_food_ordering": {
          "type": "number",
          "description": "Total spending on online food ordering services."
        },
        "fuel": {
          "type": "number",
          "description": "Total spending on fuel."
        },
        "dining_or_going_out": {
          "type": "number",
          "description": "Total spending on dining out or going out."
        },
        "flights_annual": {
          "type": "number",
          "description": "Annual spending on flights."
        },
        "hotels_annual": {
          "type": "number",
          "description": "Annual spending on hotels."
        },
        "domestic_lounge_usage_quarterly": {
          "type": "number",
          "description": "Quarterly usage of domestic lounges."
        },
        "international_lounge_usage_quarterly": {
          "type": "number",
          "description": "Quarterly usage of international lounges."
        },
        "mobile_phone_bills": {
          "type": "number",
          "description": "Monthly mobile phone bills."
        },
        "electricity_bills": {
          "type": "number",
          "description": "Monthly electricity bills."
        },
        "water_bills": {
          "type": "number",
          "description": "Monthly water bills."
        },
        "insurance_health_annual": {
          "type": "number",
          "description": "Annual health insurance costs."
        },
        "insurance_car_or_bike_annual": {
          "type": "number",
          "description": "Annual car or bike insurance costs."
        },
        "rent": {
          "type": "number",
          "description": "Monthly rent expenses."
        },
        "school_fees": {
          "type": "number",
          "description": "Total school fees."
        }
      },
      "required": [
        "amazon_spends",
        "flipkart_spends",
        "other_online_spends",
        "other_offline_spends",
        "grocery_spends_online",
        "online_food_ordering",
        "fuel",
        "dining_or_going_out",
        "flights_annual",
        "hotels_annual",
        "domestic_lounge_usage_quarterly",
        "international_lounge_usage_quarterly",
        "mobile_phone_bills",
        "electricity_bills",
        "water_bills",
        "insurance_health_annual",
        "insurance_car_or_bike_annual",
        "rent",
        "school_fees"
      ]
    },
    "responseSchema": {
      "type": "object",
      "properties": {
        "status": {
          "type": "string"
        },
        "message": {
          "type": "string"
        },
        "data": {
          "type": "object",
          "properties": {
            "success": {
              "type": "boolean"
            },
            "message": {
              "type": "string"
            },
            "savings": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "card_name": {
                    "type": "string"
                  },
                  "seo_card_alias": {
                    "type": "string"
                  },
                  "cg_network_url": {
                    "type": [
                      "string",
                      "null"
                    ]
                  },
                  "ck_store_url": {
                    "type": [
                      "string",
                      "null"
                    ]
                  },
                  "ck_store_url_2": {
                    "type": [
                      "string",
                      "null"
                    ]
                  },
                  "id": {
                    "type": "integer"
                  },
                  "joining_fees": {
                    "type": "string"
                  },
                  "total_savings": {
                    "type": [
                      "number",
                      "null"
                    ]
                  },
                  "total_savings_yearly": {
                    "type": [
                      "number",
                      "null"
                    ]
                  },
                  "total_extra_benefits": {
                    "type": "integer"
                  },
                  "max_potential_savings": {
                    "type": "integer"
                  },
                  "redemption_options": {
                    "type": "array",
                    "items": {
                      "type": "object"
                    }
                  },
                  "brand_options": {
                    "type": "array",
                    "items": {
                      "type": "object"
                    }
                  },
                  "category_breakdown": {
                    "type": "object"
                  },
                  "spending_breakdown": {
                    "type": "object"
                  },
                  "total_beneficial_spends": {
                    "type": "number"
                  },
                  "total_spends": {
                    "type": "number"
                  },
                  "welcomeBenefits": {
                    "type": "array",
                    "items": {
                      "type": "object"
                    }
                  },
                  "food_dining_benefits": {
                    "type": "array",
                    "items": {
                      "type": "object"
                    }
                  },
                  "travel_benefits": {
                    "type": "object"
                  },
                  "milestone_benefits": {
                    "type": "array",
                    "items": {
                      "type": "object"
                    }
                  },
                  "roi": {
                    "type": "number"
                  },
                  "tags": {
                    "type": "string"
                  },
                  "bank_id": {
                    "type": "integer"
                  },
                  "spending_breakdown_array": {
                    "type": "array",
                    "items": {
                      "type": "object"
                    }
                  }
                },
                "required": [
                  "card_name",
                  "id"
                ]
              }
            }
          },
          "required": [
            "success",
            "message",
            "savings"
          ]
        }
      },
      "required": [
        "status",
        "message",
        "data"
      ]
    },
    "sampleRequest": {
      "amazon_spends": 15000,
      "flipkart_spends": 25000,
      "other_online_spends": 0,
      "other_offline_spends": 0,
      "grocery_spends_online": 0,
      "online_food_ordering": 0,
      "fuel": 0,
      "dining_or_going_out": 0,
      "flights_annual": 0,
      "hotels_annual": 0,
      "domestic_lounge_usage_quarterly": 0,
      "international_lounge_usage_quarterly": 0,
      "mobile_phone_bills": 0,
      "electricity_bills": 0,
      "water_bills": 0,
      "insurance_health_annual": 0,
      "insurance_car_or_bike_annual": 0,
      "rent": 0,
      "school_fees": 30000
    },
    "sampleResponse": {
      "status": "success",
      "message": "",
      "data": {
        "success": true,
        "message": "Savings calculated successfully",
        "savings": [
          {
            "card_name": "HDFC Diners Club Black Metal Edition",
            "seo_card_alias": "hdfc-diners-club-black-metal-credit-card",
            "total_savings": 6253,
            "total_savings_yearly": 75036,
            "joining_fees": "10000",
            "roi": 65036
          }
        ]
      }
    },
    "sampleResponses": {
      "status": "success",
      "message": "",
      "data": {
        "success": true,
        "message": "Savings calculated successfully",
        "savings": [
          {
            "card_name": "HDFC Diners Club Black Metal Edition",
            "seo_card_alias": "hdfc-diners-club-black-metal-credit-card",
            "cg_network_url": null,
            "ck_store_url": "cashkaro://stores/hdfc-credit-card-offers",
            "ck_store_url_2": "cashkaro://stores/hdfc-credit-card-offers",
            "id": 114,
            "joining_fees": "10000",
            "total_savings": 6253,
            "total_savings_yearly": 75036,
            "total_extra_benefits": 0,
            "max_potential_savings": 1884000,
            "redemption_options": [
              {
                "id": 422,
                "card_id": 114,
                "method": "Airmiles",
                "brand": "Air Canada Aeroplan",
                "min_points": 2000,
                "max_points": 0,
                "conversion_rate": 0.65,
                "note": "",
                "createdAt": "2025-06-26T11:21:42.000Z",
                "updatedAt": "2025-06-26T11:21:42.000Z"
              }
            ],
            "brand_options": [
              {
                "id": 166,
                "card_id": 114,
                "spend_key": "hotels_annual",
                "brand": "Smart buy - Product/Voucher",
                "note": "",
                "createdAt": "2025-06-26T11:05:31.000Z",
                "updatedAt": "2025-06-26T11:05:31.000Z"
              }
            ],
            "category_breakdown": {
              "HDFCM_5RP": {
                "spend": 33621.58,
                "points_earned": 1121,
                "balance": 73879,
                "savings": 1121
              }
            },
            "spending_breakdown": {
              "amazon_spends": {
                "on": "amazon_spends",
                "spend": 1280,
                "points_earned": 43,
                "savings": 43,
                "explanation": [
                  "On spend of ₹1.28K you get 5 RP for every ₹150, so you will receive 43 RP."
                ],
                "conv_rate": 1,
                "maxCap": 75000
              }
            },
            "total_beneficial_spends": 75121.58,
            "total_spends": 142261.58,
            "welcomeBenefits": [],
            "food_dining_benefits": [],
            "travel_benefits": {
              "domestic_lounge_benefits_annual": 60000,
              "international_lounge_benefits_annual": 65000,
              "railway_lounge_beneftis_annual": 0,
              "domestic_lounges_unlocked": 80,
              "international_lounges_unlocked": 52,
              "railway_lounges_unlocked": 0,
              "total_travel_benefit_annual": 125000
            },
            "milestone_benefits": [],
            "roi": 65036,
            "tags": "dining, travel, grocery shopping,online food ordering",
            "bank_id": 8,
            "spending_breakdown_array": [
              {
                "on": "amazon_spends",
                "spend": 1280,
                "points_earned": 43,
                "savings": 43,
                "explanation": [
                  "On spend of ₹1.28K you get 5 RP for every ₹150, so you will receive 43 RP."
                ],
                "conv_rate": 1,
                "maxCap": 75000
              }
            ]
          }
        ]
      }
    },
    "errorResponses": [],
    "validationNotes": [],
    "fieldTable": [
      {
        "field": "amazon_spends",
        "type": "integer",
        "required": "No",
        "description": "₹ / month on Amazon"
      },
      {
        "field": "flipkart_spends",
        "type": "integer",
        "required": "No",
        "description": "₹ / month on Flipkart"
      },
      {
        "field": "grocery_spends_online",
        "type": "integer",
        "required": "No",
        "description": "₹ / month – online groceries"
      },
      {
        "field": "grocery_spends_offline",
        "type": "integer",
        "required": "No",
        "description": "₹ / month – supermarket"
      },
      {
        "field": "mobile_phone_bills",
        "type": "integer",
        "required": "No",
        "description": "₹ / month – mobile post‑paid"
      },
      {
        "field": "electricity_bills",
        "type": "integer",
        "required": "No",
        "description": "₹ / month – electricity"
      },
      {
        "field": "water_bills",
        "type": "integer",
        "required": "No",
        "description": "₹ / month – water"
      },
      {
        "field": "ott_channels",
        "type": "integer",
        "required": "No",
        "description": "₹ / month – OTT subscriptions"
      },
      {
        "field": "hotels_annual",
        "type": "integer",
        "required": "No",
        "description": "₹ / year – hotel bookings"
      },
      {
        "field": "flights_annual",
        "type": "integer",
        "required": "No",
        "description": "₹ / year – flight tickets"
      }
    ],
    "errorResponse": {
      "status": "error",
      "message": "Card calculation request failed",
      "data": null,
      "error_code": "CALC_001"
    }
  },
  "partner/logout": {
    "name": "Partner Logout",
    "endpoint": "/partner/logout",
    "methods": [
      "GET"
    ],
    "status": "live",
    "description": "Logout partner user session",
    "category": "Partner APIs",
    "purpose": "Logout the currently authenticated partner user and invalidate their session",
    "requestSchema": {},
    "responseSchema": {
      "type": "object",
      "properties": {
        "status": {
          "type": "string",
          "description": "Response status (success/error)"
        },
        "message": {
          "type": "string",
          "description": "Response message"
        }
      }
    },
    "sampleRequest": {},
    "validationNotes": [
      "partner-token header is required",
      "Authorization header with user token is required"
    ],
    "fieldTable": [],
    "products": [
      "Card Genius",
      "Loan Genius"
    ],
    "sampleResponses": [],
    "errorResponses": []
  },
  "/partner/health": {
    "name": "Health Check",
    "endpoint": "/partner/health",
    "description": "This provides a health check for the API ecosystem and sends in a message \"Up and Running\"",
    "category": "Partner APIs",
    "products": [
      "Card Genius"
    ],
    "purpose": "System stability",
    "methods": [
      "GET"
    ],
    "status": "live",
    "rank": 1,
    "requestSchema": {},
    "responseSchema": {
      "type": "object",
      "properties": {
        "message": {
          "type": "string",
          "description": "Status message indicating the system's operational state"
        }
      },
      "required": [
        "message"
      ]
    },
    "sampleRequest": {},
    "sampleResponse": [
      {
        "message": "Up and Running"
      }
    ],
    "sampleResponses": {},
    "errorResponse": {
      "status": "error",
      "message": "Health check failed",
      "data": null,
      "error_code": "HEALTH_001"
    },
    "validationNotes": [],
    "fieldTable": []
  },
  "/partner/cardgenius/cards": {
    "name": "Cards Catalog (GET)",
    "endpoint": "/partner/cardgenius/cards",
    "description": "Get a list of all available credit cards with no request parameters.",
    "category": "Card APIs",
    "products": [
      "Card Genius"
    ],
    "purpose": "Retrieve a comprehensive list of credit cards with no filtering.",
    "methods": [
      "GET"
    ],
    "status": "live",
    "rank": 6,
    "requestSchema": {},
    "responseSchema": {
      "type": "object",
      "properties": {
        "status": {
          "type": "string"
        },
        "message": {
          "type": "string"
        },
        "data": {
          "type": "object",
          "properties": {
            "cards": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "integer"
                  },
                  "name": {
                    "type": "string"
                  },
                  "card_alias": {
                    "type": "string"
                  },
                  "bank_id": {
                    "type": "integer"
                  },
                  "status": {
                    "type": "boolean"
                  }
                },
                "required": [
                  "id",
                  "name",
                  "card_alias",
                  "bank_id",
                  "status"
                ]
              }
            },
            "filteredCards": {
              "type": "array",
              "items": {
                "type": "object"
              }
            },
            "tag_slug": {
              "type": "boolean"
            },
            "card_slug": {
              "type": "boolean"
            },
            "tag": {
              "type": "object"
            },
            "card_details": {
              "type": "object"
            },
            "tag_genius_data": {
              "type": "object"
            }
          },
          "required": [
            "cards",
            "filteredCards",
            "tag_slug",
            "card_slug",
            "tag",
            "card_details",
            "tag_genius_data"
          ]
        }
      },
      "required": [
        "status",
        "message",
        "data"
      ]
    },
    "sampleRequest": {},
    "sampleResponse": {
      "status": "success",
      "message": "",
      "data": [
        {
          "id": 54,
          "name": "ICICI Platinum Chip Credit Card",
          "nick_name": "ICICI Platinum Chip, Credit Card",
          "product_type": "credit_card",
          "card_type": "VISA",
          "user_rating_count": 300,
          "rating": 2.5,
          "bank_id": 14,
          "priority": 0,
          "bk_commission": "2000",
          "new_to_credit": true,
          "existing_customer": false,
          "commission_type": "Flat",
          "commission": "1800",
          "commission_percent": "90",
          "sub_agent_commission": "",
          "seo_card_alias": "icici-platinum-chip-credit-card",
          "card_alias": "icici-platinum-chip-credit-card",
          "image": "https://offline-agent-bk.s3.ap-south-1.amazonaws.com/AGB_Card%20Type%3DICICI%20Platinum.png1735906432341",
          "api_redirection_url": null,
          "card_bg_image": "https://offline-agent-bk.s3.ap-south-1.amazonaws.com/AGB_Mockup-41.webp1735906433314",
          "card_bg_gradient": "radial-gradient(99.6% 170.48% at 50% -70.48%, #B2B2B2 0%, #1B1B1B 100%)",
          "other_images": "",
          "age_criteria": "21-60",
          "age_criteria_comment": "",
          "age_self_emp": "21-60",
          "age_self_emp_comment": "",
          "min_age": 21,
          "max_age": 60,
          "crif": "700",
          "crif_comment": "",
          "income": "20000",
          "income_comment": "",
          "crif_self_emp": "700",
          "crif_self_emp_comment": "",
          "income_salaried": "2",
          "income_self_emp": "2",
          "income_self_emp_comment": "",
          "joining_fee_text": "0",
          "joining_fee_offset": "N/A",
          "joining_fee_comment": "",
          "annual_fee_text": "0",
          "annual_fee_waiver": "N/A",
          "annual_fee_comment": "",
          "annual_saving": "2601",
          "annual_saving_comment": null,
          "reward_conversion_rate": "1reward points = Rs 0.25",
          "redemption_options": "<p>You can redeem reward points by login in with your internet banking login credentials.</p>",
          "redemption_catalogue": "https://www.icicibank.com/",
          "exclusion_earnings": "Rent Payment, Insurance, Cash Withdrawls, School & Educational Services, GST Charges, Tolls",
          "exclusion_spends": "Rent Payment, Insurance, Cash Withdrawls, School & Educational Services, GST Charges, Tolls",
          "network_url": "https://secure.traqkarr.com/click?pid=10&offer_id=1389&sub2=",
          "employment_type": "both",
          "tnc": "The bank may offer a different card variant based on your eligibility. Please carefully read the features of the card offered before submitting your application || A minimum transaction of Rs.100 within 30 days is required to activate the card, otherwise, you won't be eligible for the Rewards",
          "status": true,
          "redirectionFlag": true,
          "createdAt": "2025-01-03T17:42:24.000Z",
          "updatedAt": "2025-07-08T12:44:31.000Z",
          "meta_title": null,
          "meta_description": null,
          "ck_banner_images": null,
          "ek_banner_images": null,
          "ps_banner_images": null,
          "dsa_banner_images": null,
          "card_additional_information": {},
          "product_usps": [
            {
              "header": "Earn 2 Reward Points ",
              "description": "for every ₹100 spent on retail purchases, excluding fuel transactions, and redeem them for exciting rewards",
              "priority": 1,
              "tag_id": 0
            },
            {
              "header": "Earn 1 Reward Point ",
              "description": "for every ₹100 spent on insurance, utilities, and government transactions, making every payment more rewarding",
              "priority": 2,
              "tag_id": 0
            },
            {
              "header": "Earn 2 Reward Points ",
              "description": "for every ₹100 spent on retail purchases and redeem them for exciting rewards",
              "priority": 1,
              "tag_id": 2
            }
          ]
        }
      ]
    },
    "sampleResponses": {
      "status": "success",
      "message": "Cards generated successfully",
      "data": {
        "cards": [
          {
            "id": 27,
            "name": "SBI Cashback Credit Card",
            "card_alias": "sbi-cashback-credit-card",
            "bank_id": 3,
            "status": true
          }
        ],
        "filteredCards": [],
        "tag_slug": false,
        "card_slug": true,
        "tag": {},
        "card_details": {},
        "tag_genius_data": {}
      }
    },
    "errorResponse": {
      "status": "error",
      "message": "Failed to fetch cards catalog",
      "data": null,
      "error_code": "CARDS_001"
    },
    "errorResponses": [
      {
        "title": "Invalid Partner Token",
        "statusCode": 401,
        "response": {
          "status": "error",
          "message": "Invalid or expired partner token",
          "data": null,
          "error_code": "AUTH_001"
        }
      },
      {
        "title": "Service Unavailable",
        "statusCode": 503,
        "response": {
          "status": "error",
          "message": "Cards service temporarily unavailable",
          "data": null,
          "error_code": "SERVICE_001"
        }
      }
    ],
    "validationNotes": [],
    "fieldTable": []
  },
  "/cardgenius/eligibility": {
    "name": "Eligibility",
    "endpoint": "/cardgenius/eligibility",
    "description": "Check if a user qualifies for one or more cards based on pincode, in‑hand salary and employment type.",
    "category": "Card APIs",
    "products": [
      "Card Genius"
    ],
    "purpose": "Surface only cards the user is eligible for before they start the application flow.",
    "methods": [
      "POST"
    ],
    "status": "live",
    "rank": 7,
    "requestSchema": {
      "type": "object",
      "required": [
        "pincode",
        "inhandIncome",
        "empStatus"
      ],
      "properties": {
        "alias": {
          "type": "string",
          "description": "Optional – slug of a single card to check. Omit to get results for ALL cards."
        },
        "pincode": {
          "type": "string",
          "description": "6‑digit Indian postal code of the applicant."
        },
        "inhandIncome": {
          "type": "integer",
          "description": "Monthly in‑hand income (salary or business profits) in INR."
        },
        "empStatus": {
          "type": "string",
          "description": "Employment status. Allowed values: \"salaried\" | \"self_employed\" | \"business\"."
        }
      }
    },
    "responseSchema": {
      "type": "object",
      "properties": {
        "status": {
          "type": "string",
          "description": "success | error"
        },
        "message": {
          "type": "string"
        },
        "data": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {
                "type": "integer",
                "description": "Internal product ID."
              },
              "card_alias": {
                "type": "string",
                "description": "Slug/alias for the card."
              },
              "seo_card_alias": {
                "type": "string",
                "description": "SEO version of alias"
              },
              "eligible": {
                "type": "boolean",
                "description": "Eligibility flag."
              },
              "rejectionReason": {
                "type": "string",
                "description": "If ineligible, primary reason (e.g., \"income\", \"location\").",
                "nullable": true
              },
              "bank_id": {
                "type": "integer",
                "description": "Bank ID (present only when not eligible).",
                "nullable": true
              },
              "product_id": {
                "type": "integer",
                "description": "Product ID (present only when not eligible).",
                "nullable": true
              },
              "redirectionFlag": {
                "type": "boolean",
                "description": "If true, redirect to bank site immediately.",
                "nullable": true
              }
            }
          }
        }
      }
    },
    "sampleRequest": {
      "pincode": "110001",
      "inhandIncome": 50000,
      "empStatus": "salaried"
    },
    "sampleResponse": {
      "status": "success",
      "message": "",
      "data": [
        {
          "card_alias": "icici-platinum-chip-credit-card",
          "id": 54,
          "seo_card_alias": "icici-platinum-chip-credit-card",
          "eligible": true
        },
        {
          "card_alias": "icici-mmt-platinum-credit-card",
          "id": 55,
          "seo_card_alias": "icici-mmt-platinum-credit-card",
          "eligible": true
        },
        {
          "card_alias": "icici-hpcl-super-saver-credit-card",
          "id": 51,
          "seo_card_alias": "icici-hpcl-super-saver-credit-card",
          "eligible": true
        },
        {
          "card_alias": "au-zenith-plus-credit-card",
          "bank_id": 7,
          "product_id": 49,
          "redirectionFlag": true,
          "seo_card_alias": "au-zenith-plus-credit-card",
          "rejectionReason": "income",
          "eligible": false
        }
      ]
    },
    "sampleResponses": [],
    "errorResponse": {
      "status": "error",
      "message": "Eligibility check failed",
      "data": null,
      "error_code": "ELIGIBILITY_001"
    },
    "errorResponses": [],
    "validationNotes": [
      "pincode must be a valid 6-digit Indian postal code",
      "inhandIncome must be a positive integer in INR",
      "empStatus must be one of: \"salaried\", \"self_employed\", \"business\"",
      "alias is optional - if provided, checks eligibility for specific card only",
      "Response includes eligibility status and rejection reasons if applicable"
    ],
    "fieldTable": [
      {
        "field": "alias",
        "type": "string",
        "required": "No",
        "description": "Card slug to evaluate. If omitted, API returns eligibility for all cards."
      },
      {
        "field": "pincode",
        "type": "string",
        "required": "Yes",
        "description": "6‑digit pincode."
      },
      {
        "field": "inhandIncome",
        "type": "integer",
        "required": "Yes",
        "description": "Monthly in‑hand income (₹)."
      },
      {
        "field": "empStatus",
        "type": "string",
        "required": "Yes",
        "description": "Employment status: salaried | self_employed | business."
      }
    ]
  },
  "/cardgenius/cards/{card_slug}": {
    "name": "Card Detail",
    "endpoint": "/cardgenius/cards/{card_slug}",
    "description": "Fetch the full specification and meta‑data for a single credit card.",
    "category": "Card APIs",
    "products": [
      "Card Genius"
    ],
    "purpose": "Used on product‑detail pages, comparison views, or pre‑filled applications to obtain every field we store for a card.",
    "methods": [
      "GET"
    ],
    "status": "live",
    "rank": 8,
    "requestSchema": {
      "type": "object",
      "properties": {
        "card_alias": {
          "type": "string",
          "description": "Path parameter: the slug/alias of the card (e.g. \"icici-platinum-chip-credit-card\")"
        }
      },
      "required": [
        "card_alias"
      ]
    },
    "responseSchema": {
      "type": "object",
      "properties": {
        "status": {
          "type": "string"
        },
        "message": {
          "type": "string"
        },
        "data": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {
                "type": "integer"
              },
              "name": {
                "type": "string"
              },
              "nick_name": {
                "type": "string"
              },
              "product_type": {
                "type": "string"
              },
              "card_type": {
                "type": "string"
              },
              "user_rating_count": {
                "type": "integer"
              },
              "rating": {
                "type": "number"
              },
              "bank_id": {
                "type": "integer"
              },
              "priority": {
                "type": "integer"
              },
              "bk_commission": {
                "type": "string"
              },
              "new_to_credit": {
                "type": "boolean"
              },
              "existing_customer": {
                "type": "boolean"
              },
              "commission_type": {
                "type": "string"
              },
              "commission": {
                "type": "string"
              },
              "commission_percent": {
                "type": "string"
              },
              "sub_agent_commission": {
                "type": "string"
              },
              "seo_card_alias": {
                "type": "string"
              },
              "card_alias": {
                "type": "string"
              },
              "image": {
                "type": "string"
              },
              "card_bg_image": {
                "type": "string"
              },
              "card_bg_gradient": {
                "type": "string"
              },
              "other_images": {
                "type": "string"
              },
              "age_criteria": {
                "type": "string"
              },
              "age_criteria_comment": {
                "type": "string"
              },
              "min_age": {
                "type": "integer"
              },
              "max_age": {
                "type": "integer"
              },
              "crif": {
                "type": "string"
              },
              "crif_comment": {
                "type": "string"
              },
              "income": {
                "type": "string"
              },
              "income_comment": {
                "type": "string"
              },
              "joining_fee_text": {
                "type": "string"
              },
              "joining_fee_offset": {
                "type": "string"
              },
              "joining_fee_comment": {
                "type": "string"
              },
              "annual_fee_text": {
                "type": "string"
              },
              "annual_fee_waiver": {
                "type": "string"
              },
              "annual_fee_comment": {
                "type": "string"
              },
              "annual_saving": {
                "type": "string"
              },
              "annual_saving_comment": {
                "type": "string"
              },
              "reward_conversion_rate": {
                "type": "string"
              },
              "redemption_options": {
                "type": "string"
              },
              "redemption_catalogue": {
                "type": "string"
              },
              "exclusion_earnings": {
                "type": "string"
              },
              "exclusion_spends": {
                "type": "string"
              },
              "network_url": {
                "type": "string"
              },
              "employment_type": {
                "type": "string"
              },
              "tnc": {
                "type": "string"
              },
              "status": {
                "type": "boolean"
              },
              "redirectionFlag": {
                "type": "boolean"
              },
              "createdAt": {
                "type": "string",
                "format": "date-time"
              },
              "updatedAt": {
                "type": "string",
                "format": "date-time"
              },
              "meta_title": {
                "type": [
                  "string",
                  "null"
                ]
              },
              "meta_description": {
                "type": [
                  "string",
                  "null"
                ]
              },
              "banks": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "integer"
                  },
                  "name": {
                    "type": "string"
                  }
                }
              },
              "product_usps": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "header": {
                      "type": "string"
                    },
                    "description": {
                      "type": "string"
                    },
                    "priority": {
                      "type": "integer"
                    },
                    "tag_id": {
                      "type": "integer"
                    }
                  }
                }
              },
              "tags": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "integer"
                    },
                    "name": {
                      "type": "string"
                    },
                    "image": {
                      "type": "string"
                    },
                    "image2": {
                      "type": "string"
                    },
                    "genius_title": {
                      "type": "string"
                    },
                    "genius_subtitle": {
                      "type": "string"
                    },
                    "genius_title2": {
                      "type": "string"
                    },
                    "genius_subtitle2": {
                      "type": "string"
                    },
                    "genius_bg_color": {
                      "type": "string"
                    },
                    "genius_image": {
                      "type": "string"
                    },
                    "genius_image_web": {
                      "type": "string"
                    },
                    "status": {
                      "type": "boolean"
                    },
                    "seo_alias": {
                      "type": "string"
                    },
                    "seo_tag_title": {
                      "type": "string"
                    },
                    "meta_title": {
                      "type": [
                        "string",
                        "null"
                      ]
                    },
                    "meta_description": {
                      "type": [
                        "string",
                        "null"
                      ]
                    },
                    "createdAt": {
                      "type": [
                        "string",
                        "null"
                      ],
                      "format": "date-time"
                    },
                    "updatedAt": {
                      "type": "string",
                      "format": "date-time"
                    },
                    "bk_product_tags": {
                      "type": "object",
                      "properties": {
                        "id": {
                          "type": "integer"
                        },
                        "priority": {
                          "type": [
                            "integer",
                            "null"
                          ]
                        }
                      }
                    }
                  }
                }
              },
              "bank_fee_structure": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "integer"
                  },
                  "product_id": {
                    "type": "integer"
                  },
                  "forex_markup": {
                    "type": "string"
                  },
                  "forex_markup_comment": {
                    "type": "string"
                  },
                  "apr_fees": {
                    "type": "string"
                  },
                  "apr_fees_comment": {
                    "type": "string"
                  },
                  "atm_withdrawal": {
                    "type": "string"
                  },
                  "atm_withdrawal_comment": {
                    "type": "string"
                  },
                  "reward_redemption_fees": {
                    "type": "string"
                  },
                  "link": {
                    "type": "string"
                  },
                  "railway_surcharge": {
                    "type": "string"
                  },
                  "railway_surcharge_comment": {
                    "type": "string"
                  },
                  "rent_payment_fees": {
                    "type": "string"
                  },
                  "check_payment_fees": {
                    "type": "string"
                  },
                  "check_payment_fees_comment": {
                    "type": "string"
                  },
                  "cash_payment_fees": {
                    "type": "string"
                  },
                  "cash_payment_fees_comment": {
                    "type": "string"
                  },
                  "late_payment_annual": {
                    "type": "string"
                  },
                  "late_payment_fine": {
                    "type": "string"
                  },
                  "late_payment_comment": {
                    "type": "string"
                  },
                  "createdAt": {
                    "type": "string",
                    "format": "date-time"
                  },
                  "updatedAt": {
                    "type": "string",
                    "format": "date-time"
                  }
                }
              },
              "product_benefits": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "integer"
                    },
                    "product_id": {
                      "type": "integer"
                    },
                    "benefit_type": {
                      "type": "string"
                    },
                    "sub_type": {
                      "type": "string"
                    },
                    "html_text": {
                      "type": "string"
                    },
                    "createdAt": {
                      "type": [
                        "string",
                        "null"
                      ],
                      "format": "date-time"
                    },
                    "updatedAt": {
                      "type": [
                        "string",
                        "null"
                      ],
                      "format": "date-time"
                    }
                  }
                }
              }
            },
            "required": [
              "id",
              "name",
              "card_alias",
              "status"
            ]
          }
        }
      },
      "required": [
        "status",
        "message",
        "data"
      ]
    },
    "sampleRequest": {},
    "sampleResponse": {
      "status": "success",
      "message": "",
      "data": [
        {
          "id": 54,
          "name": "ICICI Platinum Chip Credit Card",
          "nick_name": "ICICI Platinum Chip, Credit Card",
          "product_type": "credit_card",
          "card_type": "VISA",
          "user_rating_count": 300,
          "rating": 2.5,
          "bank_id": 14,
          "priority": 0,
          "bk_commission": "2000",
          "new_to_credit": true,
          "existing_customer": false,
          "commission_type": "Flat",
          "commission": "1800",
          "commission_percent": "90",
          "sub_agent_commission": "",
          "seo_card_alias": "icici-platinum-chip-credit-card",
          "card_alias": "icici-platinum-chip-credit-card",
          "image": "https://offline-agent-bk.s3.ap-south-1.amazonaws.com/AGB_Card%20Type%3DICICI%20Platinum.png1735906432341",
          "api_redirection_url": null,
          "card_bg_image": "https://offline-agent-bk.s3.ap-south-1.amazonaws.com/AGB_Mockup-41.webp1735906433314",
          "card_bg_gradient": "radial-gradient(99.6% 170.48% at 50% -70.48%, #B2B2B2 0%, #1B1B1B 100%)",
          "other_images": "",
          "age_criteria": "21-60",
          "age_criteria_comment": "",
          "age_self_emp": "21-60",
          "age_self_emp_comment": "",
          "min_age": 21,
          "max_age": 60,
          "crif": "700",
          "crif_comment": "",
          "income": "20000",
          "income_comment": "",
          "crif_self_emp": "700",
          "crif_self_emp_comment": "",
          "income_salaried": "2",
          "income_self_emp": "2",
          "income_self_emp_comment": "",
          "joining_fee_text": "0",
          "joining_fee_offset": "N/A",
          "joining_fee_comment": "",
          "annual_fee_text": "0",
          "annual_fee_waiver": "N/A",
          "annual_fee_comment": "",
          "annual_saving": "2601",
          "annual_saving_comment": null,
          "reward_conversion_rate": "1reward points = Rs 0.25",
          "redemption_options": "<p>You can redeem reward points by login in with your internet banking login credentials.</p>",
          "redemption_catalogue": "https://www.icicibank.com/",
          "exclusion_earnings": "Rent Payment, Insurance, Cash Withdrawls, School & Educational Services, GST Charges, Tolls",
          "exclusion_spends": "Rent Payment, Insurance, Cash Withdrawls, School & Educational Services, GST Charges, Tolls",
          "network_url": "https://secure.traqkarr.com/click?pid=10&offer_id=1389&sub2=",
          "employment_type": "both",
          "tnc": "The bank may offer a different card variant based on your eligibility. Please carefully read the features of the card offered before submitting your application || A minimum transaction of Rs.100 within 30 days is required to activate the card, otherwise, you won't be eligible for the Rewards",
          "status": true,
          "redirectionFlag": true,
          "createdAt": "2025-01-03T17:42:24.000Z",
          "updatedAt": "2025-07-08T12:44:31.000Z",
          "meta_title": null,
          "meta_description": null,
          "ck_banner_images": null,
          "ek_banner_images": null,
          "ps_banner_images": null,
          "dsa_banner_images": null,
          "card_additional_information": {},
          "banks": {
            "id": 14,
            "name": "ICICI Bank"
          },
          "product_usps": [
            {
              "header": "Earn 2 Reward Points ",
              "description": "for every ₹100 spent on retail purchases, excluding fuel transactions, and redeem them for exciting rewards",
              "priority": 1,
              "tag_id": 0
            },
            {
              "header": "Earn 1 Reward Point ",
              "description": "for every ₹100 spent on insurance, utilities, and government transactions, making every payment more rewarding",
              "priority": 2,
              "tag_id": 0
            },
            {
              "header": "Earn 2 Reward Points ",
              "description": "for every ₹100 spent on retail purchases and redeem them for exciting rewards",
              "priority": 1,
              "tag_id": 2
            }
          ],
          "tags": [
            {
              "id": 2,
              "name": "Shopping",
              "image": "https://offline-agent-bk.s3.ap-south-1.amazonaws.com/AGB_On.png1732014642228",
              "image2": "",
              "genius_title": "Shop More, Save More",
              "genius_subtitle": "Unwrap cashback and rewards with the perfect shopping cards",
              "genius_title2": "Your Best Shopping Card Awaits!",
              "genius_subtitle2": "Add your monthly shopping spend to discover the rewards you could stack on every purchase",
              "genius_bg_color": "linear-gradient( 180deg , #5E949A 0%, #274B4D 100%)",
              "genius_image": "https://offline-agent-bk.s3.ap-south-1.amazonaws.com/AGB_Shop.webp1737011649292",
              "genius_image_web": "https://offline-agent-bk.s3.ap-south-1.amazonaws.com/AGB_Shop.webp1737011649722",
              "status": true,
              "seo_alias": "best-shopping-credit-card",
              "seo_tag_title": "Best Shopping Credit Card",
              "meta_title": null,
              "meta_description": null,
              "createdAt": null,
              "updatedAt": "2025-01-24T15:22:04.000Z",
              "bk_product_tags": {
                "id": 1232,
                "priority": null
              }
            }
          ],
          "vendors": [],
          "bank_fee_structure": {
            "id": 66,
            "product_id": 54,
            "forex_markup": "3.5%",
            "forex_markup_comment": "<p>3.5% Forex Markups are levied if you use your card to make payments in any currency other than ₹ (INR). This fee applies to payments on e-commerce websites accepting foreign currencies or transactions made outside India using a POS. Below is a breakdown of forex markup for common spends:</p><ul><li>₹100 - ₹3.5</li><li>₹1,000 - ₹35</li><li>₹10,000 - ₹350</li><li>₹1,00,000 - ₹3,500</li></ul>",
            "apr_fees": " 3.4%",
            "apr_fees_comment": "<p>3.4% monthly fee. Credit cards allow you for a interest free payment period of 20-55 days. However, if you fail to make payment for your statement in due time then bank starts charging interest. A simple way to avoid heavy interest rates over long time is to convert your large spends in EMIs. Normally bank charges 16% p.a interest on EMIs however if you fail to pay in time then annual interest can reach upto 36%</p>",
            "atm_withdrawal": "2.5%",
            "atm_withdrawal_comment": "",
            "reward_redemption_fees": "₹99",
            "reward_redemption_fees_comment": "<p>₹99 plus GST per redemption request.</p>",
            "link": "",
            "railway_surcharge": "",
            "railway_surcharge_comment": "",
            "rent_payment_fees": "",
            "rent_payment_fees_comment": "",
            "check_payment_fees": "₹100",
            "check_payment_fees_comment": "",
            "cash_payment_fees": "",
            "cash_payment_fees_comment": "",
            "late_payment_annual": "₹0 - ₹100 | ₹101 - ₹500 | ₹501 - ₹10,000 | Above ₹10,000",
            "late_payment_fine": "₹0 | ₹100 | ₹500 | ₹750",
            "late_payment_comment": "<p>Late Payment charges will be applicable if Minimum Amount Due is not paid by the payment due date</p>",
            "createdAt": "2025-01-15T01:13:40.000Z",
            "updatedAt": "2025-01-15T01:13:40.000Z"
          },
          "product_benefits": [
            {
              "id": 959,
              "product_id": 54,
              "benefit_type": "all",
              "sub_type": "All Benefits",
              "html_text": "<ul><li>Earn 2 Reward Points for every ₹100 spent on retail purchases, excluding fuel transactions.</li><li>Get 1 Reward Point for every ₹100 spent on insurance, utilities, and government transactions.</li><li>Enjoy up to 15% savings at over 2,500 partner restaurants across India through ICICI's Culinary Treats program.</li><li>Save 1% on fuel surcharge for transactions between ₹500 and ₹4,000 at HPCL fuel stations, with maximum savings capped at ₹100 per billing cycle</li></ul>",
              "createdAt": "2025-01-15T01:04:18.000Z",
              "updatedAt": "2025-01-15T01:04:18.000Z"
            },
            {
              "id": 960,
              "product_id": 54,
              "benefit_type": "dining",
              "sub_type": "Dining Benefits",
              "html_text": "<p>Enjoy up to 15% savings at over 2,500 partner restaurants across India through ICICI's Culinary Treats program</p>",
              "createdAt": "2025-01-15T01:05:09.000Z",
              "updatedAt": "2025-01-15T01:05:09.000Z"
            }
          ]
        }
      ]
    },
    "sampleResponses": {
      "status": "success",
      "message": "Card details fetched successfully",
      "data": {
        "id": 27,
        "name": "SBI Cashback Credit Card",
        "card_alias": "sbi-cashback-credit-card",
        "bank_id": 3,
        "status": true
      }
    },
    "errorResponses": [],
    "validationNotes": [],
    "errorResponse": {
      "status": "error",
      "message": "Card detail request failed",
      "data": null,
      "error_code": "CARD_DETAIL_001"
    },
    "fieldTable": [
      {
        "field": "card_slug",
        "type": "string",
        "required": "Yes",
        "description": "The SEO‑friendly slug of the card (e.g. sbi-cashback-credit-card)."
      }
    ]
  },
  "/partner/token": {
    "name": "Partner Token Generation",
    "endpoint": "/partner/token",
    "description": "Generate a partner-token (JWT) that is required for authorization in subsequent API calls",
    "category": "Partner APIs",
    "products": [
      "Loan Genius"
    ],
    "purpose": "Used to generate a `partner-token` (JWT) that is required for authorization in subsequent API calls like `/partner-auth`, `/lead-details`, etc.",
    "methods": [
      "POST"
    ],
    "status": "live",
    "rank": 999,
    "requestSchema": {
      "type": "object",
      "required": [
        "x-api-key"
      ],
      "additionalProperties": false,
      "properties": {
        "x-api-key": {
          "type": "string",
          "description": "Secret API key issued by BankKaro (environment-specific)",
          "minLength": 5
        }
      }
    },
    "responseSchema": {
      "type": "object",
      "required": [
        "status",
        "message",
        "data"
      ],
      "properties": {
        "status": {
          "type": "string",
          "enum": [
            "success",
            "error"
          ],
          "description": "Overall operation status"
        },
        "message": {
          "type": "string",
          "description": "Optional human-readable message"
        },
        "data": {
          "type": "object",
          "required": [
            "jwttoken",
            "expiresAt"
          ],
          "properties": {
            "jwttoken": {
              "type": "string",
              "description": "Bearer token (JWT) to be supplied in the Authorization header"
            },
            "expiresAt": {
              "type": "string",
              "format": "date-time",
              "description": "ISO-8601 expiry timestamp (UTC)"
            }
          }
        }
      }
    },
    "sampleRequest": {
      "x-api-key": "test"
    },
    "sampleResponse": {
      "status": "success",
      "message": "",
      "data": {
        "jwttoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiOGZkYzIyYmRkMTkwZWFlNGRiMTFmZTUyYTQ5N2UyN2UxZDEwYWIyMTFiY2ZhZTVmOTYyOTUzOTZlNmFkZTA2NiIsImlhdCI6MTc1NzA1MTUzNSwiZXhwIjoxNzU3MDU1MTM1fQ.D0VNKC75y057x42DMuWBkZJ_eetC03gu-c0eYwaLs0U",
        "expiresAt": "2025-09-05T06:52:15.423Z"
      }
    },
    "sampleResponses": [
      {
        "status": "success",
        "message": "",
        "data": {
          "jwttoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.******",
          "expiresAt": "2025-07-08T12:50:24.634Z"
        }
      }
    ],
    "errorResponse": {
      "status": "error",
      "message": "Token expired"
    },
    "validationNotes": [
      "x-api-key must be a valid API key provided by BankKaro",
      "This API must only be called from the server-side to prevent leaking the x-api-key",
      "Do not expose this API in frontend JavaScript or browser tools",
      "The jwttoken is time-bound and should be refreshed before expiry"
    ],
    "fieldTable": [
      {
        "field": "x-api-key",
        "type": "string",
        "required": "Yes",
        "description": "Unique key provided by BankKaro (staging/prod specific). Must be kept secret on the backend."
      }
    ]
  },
  "/partner/cardgenius/init-bundle": {
    "name": "Initialization Bundle",
    "endpoint": "/partner/cardgenius/init-bundle",
    "description": "Returns all static data required to initialize the CardGenius app.",
    "category": "Card APIs",
    "products": [
      "Card Genius"
    ],
    "purpose": "Provides banks, categories, and other static data needed for app initialization.",
    "methods": [
      "GET"
    ],
    "status": "live",
    "rank": 3,
    "requestSchema": {},
    "responseSchema": {
      "type": "object",
      "properties": {
        "status": {
          "type": "string"
        },
        "message": {
          "type": "string"
        },
        "data": {
          "type": "object",
          "properties": {
            "bank_data": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "integer"
                  },
                  "name": {
                    "type": "string"
                  },
                  "logo": {
                    "type": "string"
                  }
                },
                "required": [
                  "id",
                  "name",
                  "logo"
                ]
              }
            },
            "tag_data": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "integer"
                  },
                  "name": {
                    "type": "string"
                  },
                  "tag_genius_fields": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "label": {
                          "type": "string"
                        },
                        "key": {
                          "type": "string"
                        },
                        "value": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "label",
                        "key",
                        "value"
                      ]
                    }
                  }
                },
                "required": [
                  "id",
                  "name",
                  "tag_genius_fields"
                ]
              }
            },
            "card_data": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "integer"
                  },
                  "name": {
                    "type": "string"
                  },
                  "card_type": {
                    "type": "string"
                  },
                  "product_usps": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "header": {
                          "type": "string"
                        },
                        "description": {
                          "type": "string"
                        },
                        "priority": {
                          "type": "integer"
                        }
                      },
                      "required": [
                        "header",
                        "description",
                        "priority"
                      ]
                    }
                  }
                },
                "required": [
                  "id",
                  "name",
                  "card_type",
                  "product_usps"
                ]
              }
            }
          },
          "required": [
            "bank_data",
            "tag_data",
            "card_data"
          ]
        }
      },
      "required": [
        "status",
        "message",
        "data"
      ]
    },
    "sampleRequest": {},
    "sampleResponse": {
      "status": "success",
      "message": "",
      "data": {
        "bank_data": [
          {
            "id": 1,
            "name": "Axis",
            "logo": "https://example.com/logo1.png"
          },
          {
            "id": 2,
            "name": "IDFC",
            "logo": "https://example.com/logo2.png"
          }
        ],
        "tag_data": [
          {
            "id": 1,
            "name": "Fuel",
            "tag_genius_fields": [
              {
                "label": "Enter monthly fuel spend",
                "key": "fuel",
                "value": "10000"
              }
            ]
          },
          {
            "id": 2,
            "name": "Shopping",
            "tag_genius_fields": [
              {
                "label": "Enter Amazon spend",
                "key": "amazon_spends",
                "value": "10000"
              }
            ]
          }
        ],
        "card_data": [
          {
            "id": 54,
            "name": "ICICI Platinum Card",
            "card_type": "VISA",
            "product_usps": [
              {
                "header": "Earn 2 Reward Points",
                "description": "For every ₹100 spent on retail purchases",
                "priority": 1
              }
            ]
          }
        ]
      }
    },
    "sampleResponses": {
      "status": "success",
      "message": "",
      "data": {
        "bank_data": [
          {
            "id": 1,
            "name": "Axis Bank",
            "criff_bank_name": "AXISBANK",
            "logo": "https://example.com/axis.png"
          },
          {
            "id": 3,
            "name": "SBI",
            "criff_bank_name": "SBIBANK",
            "logo": "https://example.com/sbi.png"
          }
        ],
        "tag_data": [
          {
            "id": 2,
            "name": "Fuel",
            "seo_alias": "fuel",
            "tag_genius_fields": [
              {
                "label": "Monthly Fuel Spend",
                "key": "monthly_fuel_spend",
                "value": "0"
              }
            ]
          },
          {
            "id": 5,
            "name": "Dining",
            "seo_alias": "dining",
            "tag_genius_fields": [
              {
                "label": "Monthly Dining Spend",
                "key": "online_food_ordering",
                "value": "0"
              }
            ]
          }
        ],
        "card_data": [
          {
            "id": 27,
            "name": "SBI Cashback Credit Card",
            "card_alias": "sbi-cashback-credit-card",
            "product_type": "credit_card",
            "card_type": "VISA,Mastercard",
            "bank_id": 3,
            "priority": 29,
            "status": true
          },
          {
            "id": 54,
            "name": "ICICI Platinum Chip Credit Card",
            "card_alias": "icici-platinum-chip-credit-card",
            "product_type": "credit_card",
            "card_type": "Mastercard",
            "bank_id": 11,
            "priority": 15,
            "status": true
          }
        ]
      }
    },
    "errorResponse": {
      "status": "error",
      "message": "Initialization bundle request failed",
      "data": null,
      "error_code": "INIT_BUNDLE_001"
    },
    "errorResponses": [],
    "validationNotes": [],
    "fieldTable": []
  },
  "/cardgenius/cards": {
    "name": "Cards Catalog (POST)",
    "endpoint": "/cardgenius/cards",
    "description": "Get a filtered list of credit cards based on request parameters.",
    "category": "Card APIs",
    "products": [
      "Card Genius"
    ],
    "purpose": "Retrieve a filtered list of credit cards based on user preferences and criteria.",
    "methods": [
      "POST"
    ],
    "status": "live",
    "rank": 6,
    "requestSchema": {
      "type": "object",
      "properties": {
        "filters": {
          "type": "object",
          "description": "Optional filters to apply to the card search",
          "properties": {
            "bank_id": {
              "type": "integer",
              "description": "Filter by specific bank ID"
            },
            "card_type": {
              "type": "string",
              "description": "Filter by card type (e.g., 'credit', 'debit')"
            },
            "annual_fee": {
              "type": "object",
              "description": "Filter by annual fee range",
              "properties": {
                "min": {
                  "type": "integer",
                  "description": "Minimum annual fee"
                },
                "max": {
                  "type": "integer",
                  "description": "Maximum annual fee"
                }
              }
            }
          }
        },
        "sort_by": {
          "type": "string",
          "description": "Sort criteria (e.g., 'name', 'annual_fee', 'rewards')",
          "enum": [
            "name",
            "annual_fee",
            "rewards",
            "popularity"
          ]
        },
        "limit": {
          "type": "integer",
          "description": "Maximum number of cards to return",
          "default": 50
        },
        "offset": {
          "type": "integer",
          "description": "Number of cards to skip for pagination",
          "default": 0
        }
      }
    },
    "responseSchema": {
      "type": "object",
      "properties": {
        "status": {
          "type": "string"
        },
        "message": {
          "type": "string"
        },
        "data": {
          "type": "object",
          "properties": {
            "cards": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "integer"
                  },
                  "name": {
                    "type": "string"
                  },
                  "card_alias": {
                    "type": "string"
                  },
                  "bank_id": {
                    "type": "integer"
                  },
                  "status": {
                    "type": "boolean"
                  },
                  "annual_fee": {
                    "type": "integer"
                  },
                  "card_type": {
                    "type": "string"
                  },
                  "rewards_rate": {
                    "type": "number"
                  }
                },
                "required": [
                  "id",
                  "name",
                  "card_alias",
                  "bank_id",
                  "status"
                ]
              }
            },
            "total_count": {
              "type": "integer"
            },
            "has_more": {
              "type": "boolean"
            }
          },
          "required": [
            "cards",
            "total_count",
            "has_more"
          ]
        }
      },
      "required": [
        "status",
        "message",
        "data"
      ]
    },
    "sampleRequest": {
      "filters": {
        "card_type": "credit",
        "annual_fee": {
          "max": 5000
        }
      },
      "sort_by": "rewards",
      "limit": 10,
      "offset": 0
    },
    "sampleResponse": {
      "status": "success",
      "message": "",
      "data": [
        {
          "id": 54,
          "name": "ICICI Platinum Chip Credit Card",
          "nick_name": "ICICI Platinum Chip, Credit Card",
          "product_type": "credit_card",
          "card_type": "VISA",
          "user_rating_count": 300,
          "rating": 2.5,
          "bank_id": 14,
          "priority": 0,
          "bk_commission": "2000",
          "new_to_credit": true,
          "existing_customer": false,
          "commission_type": "Flat",
          "commission": "1800",
          "commission_percent": "90",
          "sub_agent_commission": "",
          "seo_card_alias": "icici-platinum-chip-credit-card",
          "card_alias": "icici-platinum-chip-credit-card",
          "image": "https://offline-agent-bk.s3.ap-south-1.amazonaws.com/AGB_Card%20Type%3DICICI%20Platinum.png1735906432341",
          "api_redirection_url": null,
          "card_bg_image": "https://offline-agent-bk.s3.ap-south-1.amazonaws.com/AGB_Mockup-41.webp1735906433314",
          "card_bg_gradient": "radial-gradient(99.6% 170.48% at 50% -70.48%, #B2B2B2 0%, #1B1B1B 100%)",
          "other_images": "",
          "age_criteria": "21-60",
          "age_criteria_comment": "",
          "age_self_emp": "21-60",
          "age_self_emp_comment": "",
          "min_age": 21,
          "max_age": 60,
          "crif": "700",
          "crif_comment": "",
          "income": "20000",
          "income_comment": "",
          "crif_self_emp": "700",
          "crif_self_emp_comment": "",
          "income_salaried": "2",
          "income_self_emp": "2",
          "income_self_emp_comment": "",
          "joining_fee_text": "0",
          "joining_fee_offset": "N/A",
          "joining_fee_comment": "",
          "annual_fee_text": "0",
          "annual_fee_waiver": "N/A",
          "annual_fee_comment": "",
          "annual_saving": "2601",
          "annual_saving_comment": null,
          "reward_conversion_rate": "1reward points = Rs 0.25",
          "redemption_options": "<p>You can redeem reward points by login in with your internet banking login credentials.</p>",
          "redemption_catalogue": "https://www.icicibank.com/",
          "exclusion_earnings": "Rent Payment, Insurance, Cash Withdrawls, School & Educational Services, GST Charges, Tolls",
          "exclusion_spends": "Rent Payment, Insurance, Cash Withdrawls, School & Educational Services, GST Charges, Tolls",
          "network_url": "https://secure.traqkarr.com/click?pid=10&offer_id=1389&sub2=",
          "employment_type": "both",
          "tnc": "The bank may offer a different card variant based on your eligibility. Please carefully read the features of the card offered before submitting your application || A minimum transaction of Rs.100 within 30 days is required to activate the card, otherwise, you won't be eligible for the Rewards",
          "status": true,
          "redirectionFlag": true,
          "createdAt": "2025-01-03T17:42:24.000Z",
          "updatedAt": "2025-07-08T12:44:31.000Z",
          "meta_title": null,
          "meta_description": null,
          "ck_banner_images": null,
          "ek_banner_images": null,
          "ps_banner_images": null,
          "dsa_banner_images": null,
          "card_additional_information": {},
          "product_usps": [
            {
              "header": "Earn 2 Reward Points ",
              "description": "for every ₹100 spent on retail purchases, excluding fuel transactions, and redeem them for exciting rewards",
              "priority": 1,
              "tag_id": 0
            },
            {
              "header": "Earn 1 Reward Point ",
              "description": "for every ₹100 spent on insurance, utilities, and government transactions, making every payment more rewarding",
              "priority": 2,
              "tag_id": 0
            },
            {
              "header": "Earn 2 Reward Points ",
              "description": "for every ₹100 spent on retail purchases and redeem them for exciting rewards",
              "priority": 1,
              "tag_id": 2
            }
          ]
        }
      ]
    },
    "sampleResponses": {
      "status": "success",
      "message": "Cards filtered successfully",
      "data": {
        "cards": [
          {
            "id": 27,
            "name": "SBI Cashback Credit Card",
            "card_alias": "sbi-cashback-credit-card",
            "bank_id": 3,
            "status": true,
            "annual_fee": 999,
            "card_type": "credit",
            "rewards_rate": 5
          }
        ],
        "total_count": 1,
        "has_more": false
      }
    },
    "errorResponse": {
      "status": "error",
      "message": "Cards catalog request failed",
      "data": null,
      "error_code": "CARDS_CATALOG_001"
    },
    "errorResponses": [],
    "validationNotes": [
      "Filters are optional - if not provided, all cards will be returned",
      "Sort criteria must be one of the allowed values",
      "Limit and offset are used for pagination",
      "Partner token is required for authentication"
    ],
    "fieldTable": [
      {
        "field": "filters",
        "type": "object",
        "required": "No",
        "description": "Optional filters to apply to the card search"
      },
      {
        "field": "sort_by",
        "type": "string",
        "required": "No",
        "description": "Sort criteria (name, annual_fee, rewards, popularity)"
      },
      {
        "field": "limit",
        "type": "integer",
        "required": "No",
        "description": "Maximum number of cards to return (default: 50)"
      },
      {
        "field": "offset",
        "type": "integer",
        "required": "No",
        "description": "Number of cards to skip for pagination (default: 0)"
      }
    ]
  },
  "/partner/autoAuth": {
    "name": "Partner Auto Authentication (using Mobile)",
    "endpoint": "/partner/autoAuth",
    "description": "Auto-authenticate partners using mobile number or exit_id without UI",
    "category": "Partner APIs",
    "products": [
      "Loan Genius"
    ],
    "purpose": "If a partner has their own login system, they can directly pass the mobile number or a valid exit_id to this endpoint. This will create or log in the user at BankKaro without showing any UI.",
    "methods": [
      "POST"
    ],
    "status": "live",
    "rank": 999,
    "requestSchema": {
      "type": "object",
      "properties": {
        "mobile": {
          "type": "string",
          "description": "Mobile number to auto login user (if no exit_id used)",
          "required": false,
          "validation": "Must be a valid 10-digit mobile number"
        },
        "exit_id": {
          "type": "string",
          "description": "Used for login via CK or PS if mobile not provided",
          "required": false,
          "validation": "Must be a valid exit_id format for the specified vendor"
        },
        "vendor": {
          "type": "string",
          "description": "Must be either CK or PS with valid exit_id",
          "required": false,
          "validation": "Must be either \"CK\" (CashKaro) or \"PS\" (ProfitShare)"
        }
      }
    },
    "responseSchema": {
      "type": "object",
      "properties": {
        "status": {
          "type": "string",
          "description": "Response status (success/error)"
        },
        "message": {
          "type": "string",
          "description": "Response message"
        },
        "data": {
          "type": "object",
          "properties": {
            "message": {
              "type": "string",
              "description": "Auto login success message"
            },
            "token": {
              "type": "string",
              "description": "Authentication token"
            },
            "user_id": {
              "type": "string",
              "description": "User identifier"
            },
            "partner": {
              "type": "string",
              "description": "Partner name"
            },
            "newUser": {
              "type": "boolean",
              "description": "Whether this is a new user"
            },
            "user_data": {
              "type": "object",
              "description": "Complete user data including mobile, email, and partner info"
            }
          }
        }
      }
    },
    "sampleRequest": {
      "mobile": "7011048697"
    },
    "sampleResponse": {
      "status": "success",
      "message": "",
      "data": {
        "message": "Auto Login Success",
        "token": "90a41fcf6509799e96bbcc040a71426cbebdb9f10013601ebf557a4efb279da9951a286a333f732ed2538f2ae2b45871e2e5302d72ac2fda126350bb60f2b4f7d2a5d46f971b79c442a15f664e72de4f247682c87a52af6791eb6c54f59d9bb611dfdcd0ba4c1d231f14f219347056117928c313553fc28a70dce8b599cc3d20cb5376a0c61e8433e7263f755ce6452e6c080834af5b2ed08af06c1189d58fad",
        "user_id": "287",
        "partner": "EXAMPLE_PARTNER",
        "newUser": false,
        "user_data": {
          "status": "success",
          "message": "",
          "data": {
            "user_data": {
              "title_name": "",
              "first_name": "",
              "middle_name": "",
              "last_name": "",
              "full_name": "",
              "nameOnPan": "",
              "email": null,
              "personal_email": null,
              "office_email": null,
              "education_level": null,
              "aka": "",
              "gender": "",
              "dob": "",
              "father_name": "",
              "mother_name": "",
              "spouse_name": "",
              "updatedAt": null,
              "marital_status": "",
              "pincode": null,
              "currentAddressLineOne": null,
              "currentAddressLineTwo": null,
              "currentAddressLineThree": null,
              "landmark": null,
              "ownership_status": null,
              "is_this_your_communication_address": null,
              "permanentAddressLineOne": null,
              "permanentAddressLineTwo": null,
              "permanentAddressLineThree": null,
              "inhandIncome": null,
              "employmentStatus": null,
              "designation": null,
              "companyType": null,
              "officeAddressLineOne": null,
              "officeAddressLineTwo": null,
              "officeAddressLineThree": null,
              "loan_amount_required": null,
              "already_existing_credit": null,
              "salary_recieved_in": null,
              "city": null,
              "state": null,
              "pan": null,
              "fetch_credit_consent": null,
              "office_pincode": null,
              "office_city": null,
              "office_state": null,
              "company_name": null,
              "employer_sector": null,
              "know_your_credit_score": null,
              "credit_range": null,
              "total_emis": null,
              "loan_alias": "",
              "card_alias": "",
              "ek_user_id": "",
              "latest_vendor": null,
              "latest_exit_id": null,
              "partner": "EXAMPLE_PARTNER",
              "total_work_experience": null,
              "total_work_experience_current_organization": null,
              "business_name": null,
              "business_nature": null,
              "residence_type": null,
              "source_of_funds": null,
              "total_work_experience_current_business": null,
              "mother_salutation": null,
              "father_first_name": "",
              "father_middle_name": "",
              "father_last_name": "",
              "mother_first_name": "",
              "mother_middle_name": "",
              "mother_last_name": "",
              "spouse_first_name": "",
              "spouse_middle_name": "",
              "spouse_last_name": "",
              "father_salutation": null,
              "spouse_salutation": null,
              "card_delivery_location": null,
              "createdAt": "2025-09-03T09:14:32.445Z",
              "id": "287",
              "mobile": "8010431423"
            },
            "spendingHabits": [],
            "tag_genius_data": []
          }
        }
      }
    },
    "sampleResponses": [],
    "errorResponse": {
      "status": "error",
      "message": "Token expired"
    },
    "validationNotes": [
      "One of mobile or exit_id + vendor must be provided",
      "mobile must be a valid 10-digit number if provided",
      "vendor must be either 'CK' (CashKaro) or 'PS' (ProfitShare) if exit_id is used",
      "exit_id must be in valid format for the specified vendor",
      "partner-token header is required from /partner-token API"
    ],
    "fieldTable": [
      {
        "field": "mobile",
        "type": "string",
        "required": "Optional",
        "description": "Mobile number to auto login user (10 digits, if no exit_id used)"
      },
      {
        "field": "exit_id",
        "type": "string",
        "required": "Optional",
        "description": "Used for login via CK or PS if mobile not provided"
      },
      {
        "field": "vendor",
        "type": "string",
        "required": "Optional",
        "description": "Must be either \"CK\" (CashKaro) or \"PS\" (ProfitShare) with valid exit_id"
      }
    ]
  },
  "partner-auth": {
    "name": "Partner Auto Authentication ",
    "endpoint": "/partner/auth",
    "description": "Authenticate a partner and get access token",
    "category": "Partner APIs",
    "products": [
      "Loan Genius"
    ],
    "purpose": "Authenticate a partner using mobile number and OTP to obtain access token for API operations",
    "methods": [
      "POST"
    ],
    "status": "live",
    "rank": 999,
    "requestSchema": {
      "type": "object",
      "properties": {
        "mobile": {
          "type": "string",
          "description": "Mobile number for authentication",
          "required": true,
          "validation": "Must be a valid 10-digit mobile number"
        },
        "otp": {
          "type": "string",
          "description": "One-time password for verification",
          "required": true,
          "validation": "Must be a 6-digit OTP"
        }
      }
    },
    "responseSchema": {
      "type": "object",
      "properties": {
        "status": {
          "type": "string",
          "description": "Response status (success/error)"
        },
        "message": {
          "type": "string",
          "description": "Response message"
        },
        "data": {
          "type": "object",
          "properties": {
            "auth_token": {
              "type": "string",
              "description": "JWT authentication token"
            },
            "user_data": {
              "type": "object",
              "properties": {
                "mobile": {
                  "type": "string",
                  "description": "User mobile number"
                },
                "name": {
                  "type": "string",
                  "description": "User name"
                }
              }
            }
          }
        }
      }
    },
    "sampleRequest": {
      "mobile": "9999999999",
      "otp": "123456"
    },
    "sampleResponse": {
      "status": "success",
      "message": " ",
      "data": {
        "message": " ",
        "newToken": "1388944772587d0f091004aa7d4202583d1e2897a11646050fa0e02dc1faa53abd19482855136fe144e7ea7ff0bf99470f3c4b5f37e6c0885dbe0f81217827f057150fd6f2fccbdf435fb8c2d1de9a7bd984c4ed9739ed2aa59b2fc3df51a3bb42db203bf41baf0db032f7ab55a493d6af7bd0c3a8cccdd0b2f28ba294c377fee4d37c51640dae08000538f9880ff89b57df070246273625",
        "newUser": " "
      }
    },
    "sampleResponses": [],
    "errorResponse": {
      "status": "error",
      "message": "An error occurred",
      "error": {
        "data": {
          "message": "Otp Expired. Please Try Again.",
          "otpExpired": true,
          "newToken": "1388944772587d0f091004aa7d4202583d1e2897a11646050fa0e02dc1faa53abd19482855136fe144e7ea7ff0bf99470f3c4b5f37e6c0885dbe0f81217827f057150fd6f2fccbdf435fb8c2d1de9a7bd984c4ed9739ed2aa59b2fc3df51a3bb42db203bf41baf0db032f7ab55a493d6af7bd0c3a8cccdd0b2f28ba294c377fee4d37c51640dae08000538f9880ff89b57df070246273625",
          "newUser": false
        },
        "statusCode": 403
      }
    },
    "validationNotes": [
      "mobile must be a valid 10-digit number",
      "otp must be exactly 6 digits",
      "Authorization header with partner token is required",
      "OTP expires after 5 minutes"
    ],
    "fieldTable": [
      {
        "field": "mobile",
        "type": "string",
        "required": "Yes",
        "description": "Mobile number for authentication (10 digits)"
      },
      {
        "field": "otp",
        "type": "string",
        "required": "Yes",
        "description": "One-time password for verification (6 digits)"
      }
    ]
  },
  "/partner/loangenius/loan-tags": {
    "name": "Loan Tags",
    "endpoint": "/partner/loangenius/loan-tags",
    "description": "Submit a complete loan application",
    "category": "Partner APIs",
    "products": [
      "Loan Genius"
    ],
    "purpose": "Submit comprehensive loan application with personal, employment, and document information",
    "methods": [
      "GET"
    ],
    "status": "live",
    "rank": 999,
    "requestSchema": {},
    "responseSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema#",
      "$id": "https://example.com/schemas/loan-features-response.schema.json",
      "title": "Loan Features Response",
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "status": {
          "type": "string",
          "enum": [
            "success",
            "error"
          ]
        },
        "message": {
          "type": "string"
        },
        "data": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "id": {
                "type": "integer",
                "minimum": 1
              },
              "name": {
                "$ref": "#/$defs/nonEmptyString"
              },
              "image": {
                "$ref": "#/$defs/uri"
              },
              "status": {
                "type": "integer",
                "enum": [
                  0,
                  1
                ]
              },
              "createdAt": {
                "$ref": "#/$defs/dateTime"
              },
              "updatedAt": {
                "$ref": "#/$defs/dateTime"
              },
              "image2": {
                "type": "string"
              },
              "genius_title": {
                "type": "string"
              },
              "genius_subtitle": {
                "type": [
                  "string",
                  "null"
                ]
              },
              "genius_title2": {
                "type": "string"
              },
              "genius_subtitle2": {
                "type": [
                  "string",
                  "null"
                ]
              },
              "genius_bg_color": {
                "type": "string"
              },
              "genius_image": {
                "type": [
                  "string",
                  "null"
                ]
              },
              "seo_alias": {
                "type": [
                  "string",
                  "null"
                ]
              },
              "seo_tag_title": {
                "type": [
                  "string",
                  "null"
                ]
              }
            },
            "required": [
              "id",
              "name",
              "image",
              "status",
              "createdAt",
              "updatedAt",
              "image2",
              "genius_title",
              "genius_subtitle",
              "genius_title2",
              "genius_subtitle2",
              "genius_bg_color",
              "genius_image",
              "seo_alias",
              "seo_tag_title"
            ]
          }
        }
      },
      "required": [
        "status",
        "data"
      ],
      "$defs": {
        "nonEmptyString": {
          "type": "string",
          "minLength": 1
        },
        "uri": {
          "type": "string",
          "format": "uri"
        },
        "dateTime": {
          "type": "string",
          "format": "date-time"
        }
      }
    },
    "sampleRequest": {},
    "sampleResponse": {
      "status": "success",
      "message": "",
      "data": [
        {
          "id": 18,
          "name": "Instant Approval",
          "image": "https://offline-agent-bk.s3.ap-south-1.amazonaws.com/BankKaro_Instant%20Disbursal%20logo.png",
          "status": 1,
          "createdAt": "2025-02-25T19:16:50.000Z",
          "updatedAt": "2025-08-31T22:40:29.000Z",
          "image2": "",
          "genius_title": "",
          "genius_subtitle": null,
          "genius_title2": "",
          "genius_subtitle2": null,
          "genius_bg_color": "",
          "genius_image": null,
          "seo_alias": null,
          "seo_tag_title": null
        },
        {
          "id": 19,
          "name": "Pre-Approved Loans",
          "image": "https://offline-agent-bk.s3.ap-south-1.amazonaws.com/BankKaro_BankKaro_user-tick.png",
          "status": 1,
          "createdAt": "2025-02-25T19:26:20.000Z",
          "updatedAt": "2025-08-31T22:42:32.000Z",
          "image2": "",
          "genius_title": "",
          "genius_subtitle": null,
          "genius_title2": "",
          "genius_subtitle2": null,
          "genius_bg_color": "",
          "genius_image": null,
          "seo_alias": null,
          "seo_tag_title": null
        },
        {
          "id": 20,
          "name": "Flexible Rates",
          "image": "https://offline-agent-bk.s3.ap-south-1.amazonaws.com/BankKaro_BankKaro_calendar-tick.png",
          "status": 1,
          "createdAt": "2025-02-25T19:26:55.000Z",
          "updatedAt": "2025-08-31T22:43:15.000Z",
          "image2": "",
          "genius_title": "",
          "genius_subtitle": null,
          "genius_title2": "",
          "genius_subtitle2": null,
          "genius_bg_color": "",
          "genius_image": null,
          "seo_alias": null,
          "seo_tag_title": null
        },
        {
          "id": 21,
          "name": "100% Digital Process",
          "image": "https://offline-agent-bk.s3.ap-south-1.amazonaws.com/BankKaro_BankKaro_monitor-mobbile.png",
          "status": 1,
          "createdAt": "2025-02-25T19:27:21.000Z",
          "updatedAt": "2025-07-06T16:55:51.000Z",
          "image2": "",
          "genius_title": "",
          "genius_subtitle": null,
          "genius_title2": "",
          "genius_subtitle2": null,
          "genius_bg_color": "",
          "genius_image": null,
          "seo_alias": null,
          "seo_tag_title": null
        }
      ]
    },
    "sampleResponses": [],
    "errorResponse": {
      "status": "error",
      "message": "Token expired"
    },
    "validationNotes": [
      "leadId must be a valid UUID and must exist",
      "dateOfBirth must be in YYYY-MM-DD format",
      "panNumber must be exactly 10 characters",
      "aadharNumber must be exactly 12 digits",
      "employmentType must be one of the allowed values",
      "monthlyIncome must be a positive number",
      "At least one document URL is required"
    ],
    "fieldTable": [
      {
        "field": "leadId",
        "type": "string",
        "required": "Yes",
        "description": "Lead identifier from lead-details (UUID format)"
      },
      {
        "field": "personalInfo.dateOfBirth",
        "type": "string",
        "required": "Yes",
        "description": "Date of birth in YYYY-MM-DD format"
      },
      {
        "field": "personalInfo.panNumber",
        "type": "string",
        "required": "Yes",
        "description": "PAN card number (10 characters)"
      },
      {
        "field": "personalInfo.aadharNumber",
        "type": "string",
        "required": "Yes",
        "description": "Aadhar card number (12 digits)"
      },
      {
        "field": "employmentInfo.employmentType",
        "type": "string",
        "required": "Yes",
        "description": "Type of employment (salaried, self-employed, business)"
      },
      {
        "field": "employmentInfo.monthlyIncome",
        "type": "number",
        "required": "Yes",
        "description": "Monthly income (positive number)"
      },
      {
        "field": "employmentInfo.companyName",
        "type": "string",
        "required": "No",
        "description": "Company or business name"
      },
      {
        "field": "documents",
        "type": "array",
        "required": "Yes",
        "description": "Array of document URLs (at least one required)"
      }
    ]
  },
  "/partner/loangenius/lead-details": {
    "name": "Lead offer Details ",
    "endpoint": "/partner/loangenius/lead-details",
    "description": "Submit customer lead information for loan processing",
    "category": "Partner APIs",
    "products": [
      "Loan Genius"
    ],
    "purpose": "Create a new lead with customer details and loan requirements",
    "methods": [
      "POST"
    ],
    "status": "live",
    "rank": 3,
    "requestSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema#",
      "title": "Lead Create/Update Request",
      "type": "object",
      "required": [
        "leadType",
        "payload"
      ],
      "additionalProperties": false,
      "properties": {
        "leadType": {
          "type": "string",
          "minLength": 1
        },
        "payload": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "lead_id": {
              "type": "string",
              "format": "uuid"
            },
            "first_name": {
              "$ref": "#/$defs/nonEmptyString"
            },
            "last_name": {
              "$ref": "#/$defs/nonEmptyString"
            },
            "gender": {
              "type": "string",
              "enum": [
                "male",
                "female",
                "other",
                "prefer_not_to_say"
              ]
            },
            "dob": {
              "type": "string",
              "format": "date"
            },
            "loan_amount_required": {
              "$ref": "#/$defs/moneyLike"
            },
            "already_existing_credit": {
              "type": "boolean"
            },
            "employmentStatus": {
              "type": "string",
              "enum": [
                "salaried",
                "self_employed",
                "business",
                "student",
                "unemployed",
                "retired",
                "other"
              ]
            },
            "inhandIncome": {
              "$ref": "#/$defs/moneyLike"
            },
            "salary_recieved_in": {
              "type": "string",
              "enum": [
                "bank",
                "cash",
                "cheque",
                "other"
              ]
            },
            "company_name": {
              "type": "string"
            },
            "pincode": {
              "$ref": "#/$defs/pincodeIN"
            },
            "office_pincode": {
              "$ref": "#/$defs/pincodeIN"
            },
            "city": {
              "$ref": "#/$defs/nonEmptyString"
            },
            "state": {
              "$ref": "#/$defs/nonEmptyString"
            },
            "pan": {
              "type": "string",
              "pattern": "^[A-Z]{5}\d{4}[A-Z]$"
            },
            "email": {
              "type": "string",
              "format": "email"
            },
            "fetch_credit_consent": {
              "type": "boolean"
            },
            "know_your_credit_score": {
              "type": "boolean"
            },
            "credit_range": {
              "oneOf": [
                {
                  "type": "integer",
                  "minimum": 300,
                  "maximum": 900
                },
                {
                  "type": "string",
                  "pattern": "^\d{3}$"
                }
              ]
            },
            "total_emis": {
              "type": "integer",
              "minimum": 0
            }
          },
          "required": [
            "first_name",
            "last_name",
            "gender",
            "dob",
            "loan_amount_required",
            "already_existing_credit",
            "employmentStatus",
            "inhandIncome",
            "salary_recieved_in",
            "pincode",
            "city",
            "state",
            "pan",
            "email",
            "fetch_credit_consent",
            "know_your_credit_score",
            "credit_range",
            "total_emis"
          ]
        }
      },
      "$defs": {
        "nonEmptyString": {
          "type": "string",
          "minLength": 1
        },
        "moneyLike": {
          "oneOf": [
            {
              "type": "integer",
              "minimum": 0
            },
            {
              "type": "number",
              "minimum": 0
            },
            {
              "type": "string",
              "pattern": "^\d+(\.\d{1,2})?$"
            }
          ]
        },
        "pincodeIN": {
          "type": "string",
          "pattern": "^\d{6}$"
        }
      }
    },
    "responseSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema#",
      "title": "Update Lead Response",
      "type": "object",
      "required": [
        "status",
        "data"
      ],
      "additionalProperties": false,
      "properties": {
        "status": {
          "type": "string",
          "enum": [
            "success",
            "error"
          ]
        },
        "message": {
          "type": "string"
        },
        "data": {
          "type": "object",
          "required": [
            "success",
            "message",
            "lead_id"
          ],
          "additionalProperties": false,
          "properties": {
            "success": {
              "type": "integer",
              "enum": [
                0,
                1
              ]
            },
            "message": {
              "type": "string"
            },
            "lead_id": {
              "type": "string",
              "format": "uuid"
            }
          }
        }
      }
    },
    "sampleRequest": {
      "leadType": "PL",
      "payload": {
        "lead_id": "bdcefd36-623d-4009-a8ef-88498b1d5271",
        "first_name": "kartik",
        "last_name": "rawat",
        "gender": "male",
        "dob": "2000-01-21",
        "loan_amount_required": "120000",
        "already_existing_credit": true,
        "employmentStatus": "salaried",
        "inhandIncome": "120000",
        "salary_recieved_in": "bank",
        "company_name": "pouring pounds",
        "pincode": "201301",
        "office_pincode": "201301",
        "city": "Noida",
        "state": "Uttar Pradesh",
        "pan": "KMRPS1234Q",
        "email": "testtest234@gmail.com",
        "fetch_credit_consent": true,
        "know_your_credit_score": true,
        "credit_range": "850",
        "total_emis": 0
      }
    },
    "sampleResponse": {
      "status": "success",
      "message": "",
      "data": {
        "success": 1,
        "message": "Lead Updated Successfully",
        "lead_id": "bdcefd36-623d-4009-a8ef-88498b1d5271"
      }
    },
    "sampleResponses": [],
    "errorResponse": {
      "status": "error",
      "message": "Token expired"
    },
    "validationNotes": [],
    "fieldTable": []
  },
  "/partner/loangenius/pl-lead-details": {
    "name": "Lead Details",
    "endpoint": "/partner/loangenius/pl-lead-details",
    "description": "Retrieve or create lead information",
    "category": "Partner APIs",
    "products": [
      "Loan Genius"
    ],
    "purpose": "Manage lead information including customer details and loan requirements",
    "methods": [
      "GET"
    ],
    "status": "live",
    "rank": 999,
    "requestSchema": {},
    "responseSchema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema#",
      "$id": "https://example.com/schemas/loan-response.schema.json",
      "title": "Loan API Response",
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "status": {
          "type": "string",
          "enum": [
            "success",
            "error"
          ]
        },
        "message": {
          "type": "string"
        },
        "data": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "first_name": {
              "$ref": "#/$defs/nonEmptyString"
            },
            "middle_name": {
              "type": "string"
            },
            "last_name": {
              "$ref": "#/$defs/nonEmptyString"
            },
            "gender": {
              "type": "string",
              "enum": [
                "male",
                "female",
                "other",
                "prefer_not_to_say"
              ]
            },
            "dob": {
              "$ref": "#/$defs/dateISO"
            },
            "loan_amount_required": {
              "$ref": "#/$defs/moneyLike"
            },
            "already_existing_credit": {
              "type": "boolean"
            },
            "employmentStatus": {
              "type": "string",
              "enum": [
                "salaried",
                "self_employed",
                "business",
                "student",
                "unemployed",
                "retired",
                "other"
              ]
            },
            "inhandIncome": {
              "$ref": "#/$defs/moneyLike"
            },
            "salary_recieved_in": {
              "type": "string",
              "enum": [
                "bank",
                "cash",
                "cheque",
                "other"
              ]
            },
            "company_name": {
              "type": "string"
            },
            "pincode": {
              "$ref": "#/$defs/pincodeIN"
            },
            "office_pincode": {
              "$ref": "#/$defs/pincodeIN"
            },
            "city": {
              "$ref": "#/$defs/nonEmptyString"
            },
            "state": {
              "$ref": "#/$defs/nonEmptyString"
            },
            "pan": {
              "$ref": "#/$defs/panIN"
            },
            "email": {
              "$ref": "#/$defs/email"
            },
            "fetch_credit_consent": {
              "type": "boolean"
            },
            "know_your_credit_score": {
              "type": "boolean"
            },
            "credit_range": {
              "oneOf": [
                {
                  "type": "integer",
                  "minimum": 300,
                  "maximum": 900
                },
                {
                  "type": "string",
                  "pattern": "^\d{3}$"
                }
              ]
            },
            "total_emis": {
              "type": "integer",
              "minimum": 0
            },
            "userId": {
              "$ref": "#/$defs/idFlex"
            },
            "loan_alias": {
              "type": "string"
            },
            "ek_user_id": {
              "type": "string"
            }
          },
          "required": [
            "first_name",
            "last_name",
            "gender",
            "dob",
            "loan_amount_required",
            "already_existing_credit",
            "employmentStatus",
            "inhandIncome",
            "salary_recieved_in",
            "pincode",
            "city",
            "state",
            "pan",
            "email",
            "fetch_credit_consent",
            "know_your_credit_score",
            "credit_range",
            "total_emis",
            "userId"
          ]
        }
      },
      "required": [
        "status",
        "data"
      ],
      "$defs": {
        "nonEmptyString": {
          "type": "string",
          "minLength": 1
        },
        "moneyLike": {
          "oneOf": [
            {
              "type": "integer",
              "minimum": 0
            },
            {
              "type": "number",
              "minimum": 0
            },
            {
              "type": "string",
              "pattern": "^\d+(\.\d{1,2})?$"
            }
          ]
        },
        "pincodeIN": {
          "type": "string",
          "pattern": "^\d{6}$"
        },
        "panIN": {
          "type": "string",
          "pattern": "^[A-Z]{5}\d{4}[A-Z]$"
        },
        "dateISO": {
          "type": "string",
          "format": "date"
        },
        "email": {
          "type": "string",
          "format": "email"
        },
        "idFlex": {
          "oneOf": [
            {
              "type": "integer",
              "minimum": 1
            },
            {
              "type": "string",
              "pattern": "^\d+$"
            }
          ]
        }
      }
    },
    "sampleRequest": {},
    "sampleResponse": {
      "status": "success",
      "message": "",
      "data": {
        "first_name": "kartik",
        "middle_name": "",
        "last_name": "rawat",
        "gender": "male",
        "dob": "2000-01-21",
        "loan_amount_required": "120000",
        "already_existing_credit": true,
        "employmentStatus": "salaried",
        "inhandIncome": "120000",
        "salary_recieved_in": "bank",
        "company_name": "pouring pounds",
        "pincode": "201301",
        "office_pincode": "201301",
        "city": "Noida",
        "state": "Uttar Pradesh",
        "pan": "KMRPS1234Q",
        "email": "testtest234@gmail.com",
        "fetch_credit_consent": true,
        "know_your_credit_score": true,
        "credit_range": "850",
        "total_emis": 0,
        "userId": "287",
        "loan_alias": "",
        "ek_user_id": ""
      }
    },
    "sampleResponses": [],
    "errorResponse": {
      "status": "success",
      "message": "Token expired"
    },
    "validationNotes": [],
    "fieldTable": []
  }
};
