export const apiData = {
  'partner-auth': {
  "name": "Partner Authentication",
  "endpoint": "/partner/auth",
  "methods": [
    "POST"
  ],
  "status": "live",
  "description": "Authenticate a partner and get access token",
  "category": "Partner APIs",
  "purpose": "Authenticate a partner using mobile number and OTP to obtain access token for API operations",
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
  "curlExample": "curl --location 'https://{{BASE_URL}}/partner/auth' \\\n--header 'partner-token: {{PARTNER_TOKEN}}' \\\n--header 'x-epoch: <your_epoch_token>' \\\n--header 'Content-Type: application/json' \\\n--data '{\n  \"mobile\": \"7028333370\",\n  \"otp\": \"661801\"\n}'",
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
  ],
  "products": [
    "Loan Genius"
  ],
  "sampleResponses": [],
  "errorResponses": []
},
  'lead-details': {
  "name": "Lead Details",
  "endpoint": "/partner/api/lead-details",
  "methods": [
    "GET",
    "POST"
  ],
  "description": "Retrieve or create lead information",
  "category": "Partner APIs",
  "purpose": "Manage lead information including customer details and loan requirements",
  "get": {
    "requestSchema": {
      "type": "object",
      "properties": {
        "leadId": {
          "type": "string",
          "description": "Lead identifier to retrieve",
          "required": true,
          "validation": "Must be a valid UUID format"
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
            "leadId": {
              "type": "string",
              "description": "Lead identifier"
            },
            "customerDetails": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string",
                  "description": "Customer name"
                },
                "email": {
                  "type": "string",
                  "description": "Customer email"
                },
                "phone": {
                  "type": "string",
                  "description": "Customer phone"
                }
              }
            },
            "loanDetails": {
              "type": "object",
              "properties": {
                "amount": {
                  "type": "number",
                  "description": "Loan amount"
                },
                "purpose": {
                  "type": "string",
                  "description": "Loan purpose"
                },
                "status": {
                  "type": "string",
                  "description": "Lead status"
                }
              }
            },
            "createdAt": {
              "type": "string",
              "description": "Lead creation timestamp"
            }
          }
        }
      }
    },
    "sampleRequest": {
      "leadId": "550e8400-e29b-41d4-a716-446655440001"
    },
    "sampleResponse": {
      "status": "success",
      "message": "Lead retrieved successfully",
      "data": {
        "leadId": "550e8400-e29b-41d4-a716-446655440001",
        "customerDetails": {
          "name": "John Doe",
          "email": "john.doe@example.com",
          "phone": "9876543210"
        },
        "loanDetails": {
          "amount": 500000,
          "purpose": "personal",
          "status": "pending"
        },
        "createdAt": "2024-01-15T10:30:00Z"
      }
    },
    "errorResponse": {
      "status": "error",
      "message": "Lead not found or access denied.",
      "data": null
    },
    "curlExample": "curl --location 'https://yourdomain.com/partner/api/lead-details?leadId=550e8400-e29b-41d4-a716-446655440001' \\\n--header 'Authorization: Bearer <auth_token>'",
    "validationNotes": [
      "leadId must be a valid UUID format",
      "leadId must exist in the system",
      "Authorization header with auth token is required"
    ],
    "fieldTable": [
      {
        "field": "leadId",
        "type": "string",
        "required": "Yes",
        "description": "Lead identifier to retrieve (UUID format)"
      }
    ]
  },
  "post": {
    "requestSchema": {
      "type": "object",
      "properties": {
        "customerName": {
          "type": "string",
          "description": "Full name of the customer",
          "required": true,
          "validation": "Must be 2-100 characters"
        },
        "email": {
          "type": "string",
          "description": "Customer email address",
          "required": true,
          "validation": "Must be a valid email format"
        },
        "phone": {
          "type": "string",
          "description": "Customer phone number",
          "required": true,
          "validation": "Must be 10 digits"
        },
        "loanAmount": {
          "type": "number",
          "description": "Requested loan amount",
          "required": true,
          "validation": "Must be between 10,000 and 50,00,000"
        },
        "purpose": {
          "type": "string",
          "description": "Purpose of the loan",
          "required": true,
          "validation": "Must be one of: personal, business, home, vehicle"
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
            "leadId": {
              "type": "string",
              "description": "Generated lead identifier"
            },
            "status": {
              "type": "string",
              "description": "Lead creation status"
            },
            "customerDetails": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string",
                  "description": "Customer name"
                },
                "email": {
                  "type": "string",
                  "description": "Customer email"
                },
                "phone": {
                  "type": "string",
                  "description": "Customer phone"
                }
              }
            },
            "loanDetails": {
              "type": "object",
              "properties": {
                "amount": {
                  "type": "number",
                  "description": "Loan amount"
                },
                "purpose": {
                  "type": "string",
                  "description": "Loan purpose"
                },
                "status": {
                  "type": "string",
                  "description": "Lead status"
                }
              }
            },
            "createdAt": {
              "type": "string",
              "description": "Lead creation timestamp"
            }
          }
        }
      }
    },
    "sampleRequest": {
      "customerName": "John Doe",
      "email": "john.doe@example.com",
      "phone": "9876543210",
      "loanAmount": 500000,
      "purpose": "personal"
    },
    "sampleResponse": {
      "status": "success",
      "message": "Lead created successfully",
      "data": {
        "leadId": "550e8400-e29b-41d4-a716-446655440001",
        "status": "created",
        "createdAt": "2024-01-15T10:30:00Z",
        "customerDetails": {
          "name": "John Doe",
          "email": "john.doe@example.com",
          "phone": "9876543210"
        },
        "loanDetails": {
          "amount": 500000,
          "purpose": "personal",
          "status": "pending"
        }
      }
    },
    "errorResponse": {
      "status": "error",
      "message": "Invalid customer data provided.",
      "data": null
    },
    "curlExample": "curl --location 'https://yourdomain.com/partner/api/lead-details' \\\n--header 'Authorization: Bearer <auth_token>' \\\n--header 'Content-Type: application/json' \\\n--data '{\n  \"customerName\": \"John Doe\",\n  \"email\": \"john.doe@example.com\",\n  \"phone\": \"9876543210\",\n  \"loanAmount\": 500000,\n  \"purpose\": \"personal\"\n}'",
    "validationNotes": [
      "customerName must be 2-100 characters",
      "email must be a valid email format",
      "phone must be exactly 10 digits",
      "loanAmount must be between 10,000 and 50,00,000",
      "purpose must be one of the allowed values"
    ],
    "fieldTable": [
      {
        "field": "customerName",
        "type": "string",
        "required": "Yes",
        "description": "Full name of the customer (2-100 characters)"
      },
      {
        "field": "email",
        "type": "string",
        "required": "Yes",
        "description": "Customer email address (valid email format)"
      },
      {
        "field": "phone",
        "type": "string",
        "required": "Yes",
        "description": "Customer phone number (10 digits)"
      },
      {
        "field": "loanAmount",
        "type": "number",
        "required": "Yes",
        "description": "Requested loan amount (10,000 - 50,00,000)"
      },
      {
        "field": "purpose",
        "type": "string",
        "required": "Yes",
        "description": "Purpose of the loan (personal, business, home, vehicle)"
      }
    ]
  },
  "products": [
    "Loan Genius"
  ],
  "requestSchema": {},
  "responseSchema": {},
  "sampleRequest": {},
  "sampleResponses": [],
  "errorResponses": [],
  "curlExample": "",
  "validationNotes": [],
  "fieldTable": []
},
  'application': {
  "name": "Loan Application",
  "endpoint": "/partner/api/application",
  "methods": [
    "POST"
  ],
  "description": "Submit a complete loan application",
  "category": "Partner APIs",
  "purpose": "Submit comprehensive loan application with personal, employment, and document information",
  "requestSchema": {
    "type": "object",
    "properties": {
      "leadId": {
        "type": "string",
        "description": "Lead identifier from lead-details",
        "required": true,
        "validation": "Must be a valid UUID format"
      },
      "personalInfo": {
        "type": "object",
        "description": "Personal information",
        "required": true,
        "properties": {
          "dateOfBirth": {
            "type": "string",
            "description": "Date of birth in YYYY-MM-DD format",
            "required": true
          },
          "panNumber": {
            "type": "string",
            "description": "PAN card number",
            "required": true,
            "validation": "Must be 10 characters"
          },
          "aadharNumber": {
            "type": "string",
            "description": "Aadhar card number",
            "required": true,
            "validation": "Must be 12 digits"
          }
        }
      },
      "employmentInfo": {
        "type": "object",
        "description": "Employment details",
        "required": true,
        "properties": {
          "employmentType": {
            "type": "string",
            "description": "Type of employment",
            "required": true,
            "validation": "Must be one of: salaried, self-employed, business"
          },
          "monthlyIncome": {
            "type": "number",
            "description": "Monthly income",
            "required": true,
            "validation": "Must be positive number"
          },
          "companyName": {
            "type": "string",
            "description": "Company or business name",
            "required": false
          }
        }
      },
      "documents": {
        "type": "array",
        "description": "Document URLs",
        "required": true,
        "items": {
          "type": "string",
          "description": "Document URL"
        }
      }
    }
  },
  "responseSchema": {
    "type": "object",
    "properties": {
      "status": {
        "type": "string",
        "description": "Application submission success status"
      },
      "message": {
        "type": "string",
        "description": "Response message"
      },
      "data": {
        "type": "object",
        "properties": {
          "applicationId": {
            "type": "string",
            "description": "Generated application identifier"
          },
          "status": {
            "type": "string",
            "description": "Application status"
          },
          "submittedAt": {
            "type": "string",
            "description": "Application submission timestamp"
          },
          "estimatedProcessingTime": {
            "type": "string",
            "description": "Estimated processing time"
          },
          "nextSteps": {
            "type": "array",
            "description": "Next steps in the process",
            "items": {
              "type": "string"
            }
          }
        }
      }
    }
  },
  "sampleRequest": {
    "leadId": "550e8400-e29b-41d4-a716-446655440001",
    "personalInfo": {
      "dateOfBirth": "1990-05-15",
      "panNumber": "ABCDE1234F",
      "aadharNumber": "123456789012"
    },
    "employmentInfo": {
      "employmentType": "salaried",
      "monthlyIncome": 75000,
      "companyName": "Tech Solutions Ltd"
    },
    "documents": [
      "https://example.com/pan-card.pdf",
      "https://example.com/aadhar-card.pdf",
      "https://example.com/salary-slip.pdf"
    ]
  },
  "curlExample": "curl --location 'https://yourdomain.com/partner/api/application' \\\n--header 'Authorization: Bearer <auth_token>' \\\n--header 'Content-Type: application/json' \\\n--data '{\n  \"leadId\": \"550e8400-e29b-41d4-a716-446655440001\",\n  \"personalInfo\": {\n    \"dateOfBirth\": \"1990-05-15\",\n    \"panNumber\": \"ABCDE1234F\",\n    \"aadharNumber\": \"123456789012\"\n  },\n  \"employmentInfo\": {\n    \"employmentType\": \"salaried\",\n    \"monthlyIncome\": 75000,\n    \"companyName\": \"Tech Solutions Ltd\"\n  },\n  \"documents\": [\n    \"https://example.com/pan-card.pdf\",\n    \"https://example.com/aadhar-card.pdf\",\n    \"https://example.com/salary-slip.pdf\"\n  ]\n}'",
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
  ],
  "products": [
    "Loan Genius"
  ],
  "sampleResponses": [],
  "errorResponses": []
},
  'partner-autoAuth': {
  "name": "Partner Auto Authentication",
  "endpoint": "/partner/autoAuth",
  "methods": [
    "POST"
  ],
  "description": "Auto-authenticate partners using mobile number or exit_id without UI",
  "category": "Partner APIs",
  "purpose": "If a partner has their own login system, they can directly pass the mobile number or a valid exit_id to this endpoint. This will create or log in the user at BankKaro without showing any UI.",
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
  "curlExample": "curl --location 'https://{{BASE_URL}}/partner/autoAuth' \\\n--header 'partner-token: {{PARTNER_TOKEN}}' \\\n--header 'Content-Type: application/json' \\\n--data '{\n    \"mobile\": \"7028333370\"\n}'",
  "validationNotes": [
    "One of mobile or exit_id + vendor must be provided",
    "mobile must be a valid 10-digit number if provided",
    "vendor must be either 'CK' (CashKaro) or 'PS' (ProfitShare) if exit_id is used",
    "exit_id must be in valid format for the specified vendor",
    "partner-token header is required from /partner-token API"
  ],
  "importantNotes": [
    "🔐 This API allows partners to auto-authenticate users without showing BankKaro UI.",
    "📱 Can authenticate using mobile number or exit_id from CashKaro/ProfitShare.",
    "🎯 Perfect for partners with their own login systems.",
    "📋 Response includes complete user data and authentication token."
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
  ],
  "headers": [
    {
      "header": "Host",
      "value": "Partner domain (e.g., abc.example-partner.com)",
      "required": true
    },
    {
      "header": "origin",
      "value": "Partner origin",
      "required": true
    },
    {
      "header": "partner-token",
      "value": "JWT token from /partner-token API",
      "required": true
    },
    {
      "header": "Content-Type",
      "value": "application/json",
      "required": true
    }
  ],
  "additionalExamples": [
    {
      "title": "Auto Auth using Exit ID (CashKaro)",
      "description": "Authenticate using CashKaro exit_id",
      "curl": "curl --location 'https://{{BASE_URL}}/partner/autoAuth' \\\n--header 'partner-token: {{PARTNER_TOKEN}}' \\\n--header 'Content-Type: application/json' \\\n--data '{\n  \"exit_id\": \"CHKR20241125A336129939\",\n  \"vendor\": \"CK\"\n}'"
    },
    {
      "title": "Auto Auth using Exit ID (ProfitShare)",
      "description": "Authenticate using ProfitShare exit_id",
        "curl": "curl --location 'https://{{BASE_URL}}/partner/autoAuth' \\\n--header 'partner-token: {{PARTNER_TOKEN}}' \\\n--header 'Content-Type: application/json' \\\n--data '{\n  \"exit_id\": \"CHKR20241125A336129939\",\n  \"vendor\": \"CK\"\n}'"
    }
  ],
  "products": [
    "Loan Genius"
  ],
  "sampleResponses": [],
  "errorResponses": []
},
  'partner-token': {
  "name": "Partner Token Generation",
  "endpoint": "/partner/token",
  "methods": [
    "POST"
  ],
  "description": "Generate a partner-token (JWT) that is required for authorization in subsequent API calls",
  "category": "Partner APIs",
  "purpose": "Used to generate a `partner-token` (JWT) that is required for authorization in subsequent API calls like `/partner-auth`, `/lead-details`, etc.",
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
  "curlExample": "curl --location 'https://api.bankkaro.com/partner/api/partner-token' \\\n--header 'Content-Type: application/json' \\\n--data '{\n  \"x-api-key\": \"test\"\n}'",
  "curlExampleStaging": "curl --location 'https://uat-platform.bankkaro.com/partner/token' \\\n--header 'Content-Type: application/json' \\\n--data '{\n  \"x-api-key\": \"test\"\n}'",
  "curlExampleProduction": "curl --location 'https://prod-platform.bankkaro.com/partner/token' \\\n--header 'Content-Type: application/json' \\\n--data '{\n  \"x-api-key\": \"YOUR_PROD_KEY\"\n}'",
  "validationNotes": [
    "x-api-key must be a valid API key provided by BankKaro",
    "This API must only be called from the server-side to prevent leaking the x-api-key",
    "Do not expose this API in frontend JavaScript or browser tools",
    "The jwttoken is time-bound and should be refreshed before expiry"
  ],
  "importantNotes": [
    "🔐 This API must only be called from the server-side to prevent leaking the x-api-key.",
    "⚠️ Do not expose this API in frontend JavaScript or browser tools.",
    "⏱ The jwttoken is time-bound and should be refreshed before expiry.",
    "📎 To use it in subsequent requests, include in headers: Authorization: Bearer <jwttoken>"
  ],
  "fieldTable": [
    {
      "field": "x-api-key",
      "type": "string",
      "required": "Yes",
      "description": "Unique key provided by BankKaro (staging/prod specific). Must be kept secret on the backend."
    }
  ],
  "products": [
    "Loan Genius"
  ],
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
  "errorResponses": []
},
  'v1-redemption-planner': {
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
    "preferred_redemption_types": ["cash", "amazon_voucher", "air_miles"]
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
  "curlExample": "curl --location 'https://api.bankkaro.com/v1/cards/redemptions/calculate' \\\n--header 'Authorization: Bearer <jwt>' \\\n--header 'Content-Type: application/json' \\\n--data '{\"points\": 35000}'",
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
  "errorResponse": {},
  "validationNotes": [],
  "fieldTable": []
},
  'v1-instant-offers': {
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
  "curlExample": "curl --location 'https://api.bankkaro.com/v1/cards/sbi-cashback-credit-card/offers' \\\n--header 'Authorization: Bearer <jwt>'",
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
  "errorResponse": {},
  "validationNotes": [],
  "fieldTable": []
},
  'v1-lounge-finder': {
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
  "curlExample": "curl --location 'https://api.bankkaro.com/v1/cards/sbi-cashback-credit-card/lounges' \\\n--header 'Authorization: Bearer <jwt>'",
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
  "errorResponse": {},
  "validationNotes": [],
  "fieldTable": []
},
  'v1-omni': {
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
      "redemption_options": ["cash", "vouchers"]
    }
  },
  "curlExample": "curl --location 'https://api.bankkaro.com/v1/cards/omni' \\\n--header 'Authorization: Bearer <jwt>' \\\n--header 'Content-Type: application/json' \\\n--data '{\"include_banks\": true, \"include_categories\": true}'",
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
  "errorResponse": {},
  "validationNotes": [],
  "fieldTable": []
},
  'v1-webhooks': {
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
    "events": ["application.approved", "reward.posted", "card.activated"]
  },
  "sampleResponse": {
    "success": true,
    "message": "Webhook subscription created successfully.",
    "webhook_id": "wh_1a2b3c4d5e"
  },
  "curlExample": "curl --location 'https://api.bankkaro.com/v1/webhooks' \\\n--header 'Authorization: Bearer <jwt>' \\\n--header 'Content-Type: application/json' \\\n--data '{\"url\": \"https://partner.com/hook\", \"events\": [\"application.approved\", \"reward.posted\"]}'",
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
  "errorResponse": {},
  "validationNotes": [],
  "fieldTable": []
},
  'partner/token': {
  "name": "Partner Token Generation",
  "endpoint": "/partner/token",
  "methods": [
    "POST"
  ],
  "description": "Generate a partner-token (JWT) that is required for authorization in subsequent Card Genius API calls",
  "category": "Partner APIs",
  "purpose": "Used to generate a `partner-token` (JWT) that is required for authorization in subsequent Card Genius API calls like `/cardgenius/initial-data`, `/cardgenius/cards`, etc.",
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
  "curlExample": "curl --location 'https://{{BASE_URL}}/partner/token' \\\n--header 'Content-Type: application/json' \\\n--data '{\n  \"x-api-key\": \"{{API_KEY}}\"\n}'",
  "curlExampleStaging": "curl --location 'https://uat-platform.bankkaro.com/partner/token' \\\n--header 'Content-Type: application/json' \\\n--data '{\n  \"x-api-key\": \"test\"\n}'",
  "curlExampleProduction": "curl --location 'https://prod-platform.bankkaro.com/partner/token' \\\n--header 'Content-Type: application/json' \\\n--data '{\n  \"x-api-key\": \"YOUR_PROD_KEY\"\n}'",
  "validationNotes": [
    "x-api-key must be a valid API key provided by BankKaro",
    "This API must only be called from the server-side to prevent leaking the x-api-key",
    "Do not expose this API in frontend JavaScript or browser tools",
    "The jwttoken is time-bound and should be refreshed before expiry"
  ],
  "importantNotes": [
    "🔐 This API must only be called from the server-side to prevent leaking the x-api-key.",
    "⚠️ Do not expose this API in frontend JavaScript or browser tools.",
    "⏱ The jwttoken is time-bound and should be refreshed before expiry.",
    "📎 To use it in subsequent requests, include in headers: Authorization: Bearer <jwttoken>"
  ],
  "fieldTable": [
    {
      "field": "x-api-key",
      "type": "string",
      "required": "Yes",
      "description": "Unique key provided by BankKaro (staging/prod specific). Must be kept secret on the backend."
    }
  ],
  "products": [
    "Card Genius"
  ],
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
  "errorResponses": [],
  "status": "live",
  "sampleResponse": {},
  "errorResponse": {},
  "headers": [],
  "additionalExamples": [],
  "rank": 2
},
  'cardgenius/initial-data': {
  "name": "Initialization Bundle",
  "endpoint": "/partner/cardgenius/init-bundle",
  "methods": [
    "GET"
  ],
  "status": "live",
  "description": "Returns all static data required to initialize the CardGenius app.",
  "category": "Card APIs",
  "purpose": "Provides banks, categories, and other static data needed for app initialization.",
  "responseSchema": {
    "status": "string",
    "message": "string",
    "data": {
      "bank_data": [
        {
          "id": 0,
          "name": "string",
          "criff_bank_name": "string",
          "logo": "string"
        }
      ],
      "tag_data": [
        {
          "id": 0,
          "name": "string",
          "seo_alias": "string",
          "tag_genius_fields": [
            {
              "label": "string",
              "key": "string",
              "value": "string"
            }
          ]
        }
      ],
      "card_data": [
        {
          "id": 0,
          "name": "string",
          "card_alias": "string",
          "product_type": "string",
          "card_type": "string",
          "bank_id": 0,
          "priority": 0,
          "status": true
        }
      ]
    }
  },
  "sampleResponse": {
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
  "curlExample": "curl --location 'https://{{BASE_URL}}/partner/cardgenius/init-bundle' \\  \n--header 'partner-token: <your_jwt_token>'",
  "requestSchema": {},
  "sampleRequest": {},
  "errorResponse": {},
  "validationNotes": [],
  "fieldTable": [],
  "products": [
    "Card Genius"
  ],
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
  "errorResponses": [],
  "curlExampleStaging": "curl --location 'https://uat-platform.bankkaro.com/partner/cardgenius/init-bundle' \\  \n--header 'partner-token: <your_jwt_token>'\n",
  "curlExampleProduction": "curl --location 'https://prod-platform.bankkaro.com/partner/cardgenius/init-bundle' \\  \n--header 'partner-token: <your_jwt_token>'\n",
  "importantNotes": [],
  "headers": [],
  "additionalExamples": [],
  "rank": 3
},
  'cardgenius/cards': {
  "name": "Cards Catalog (GET)",
  "endpoint": "/partner/cardgenius/cards",
  "methods": [
    "GET"
  ],
  "description": "Get a list of all available credit cards with no request parameters.",
  "category": "Card APIs",
  "purpose": "Retrieve a comprehensive list of credit cards with no filtering.",
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
  "sampleResponse": {},
  "curlExample": "curl --location 'https://{{BASE_URL}}/partner/cardgenius/cards' \\\n  --header 'partner-token: {{PARTNER_TOKEN}}'\n",
  "sampleRequest": {},
  "validationNotes": [],
  "fieldTable": [],
  "products": [
    "Card Genius"
  ],
  "methodDescriptions": {},
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
  "errorResponses": [],
  "curlExampleStaging": "curl --location 'https://{{BASE_URL}}/partner/cardgenius/cards' \\\n  --header 'partner-token: {{PARTNER_TOKEN}}'\n",
  "curlExampleProduction": "curl --location 'https://{{BASE_URL}}/partner/cardgenius/cards' \\\n  --header 'partner-token: {{PARTNER_TOKEN}}'\n",
  "status": "live",
  "rank": 6,
  "errorResponse": {},
  "importantNotes": [],
  "headers": [],
  "additionalExamples": []
},
  'cardgenius/cards-post': {
  "name": "Cards Catalog (POST)",
  "endpoint": "/partner/cardgenius/cards",
  "methods": [
    "POST"
  ],
  "description": "Get a filtered list of credit cards based on user preferences and eligibility criteria.",
  "category": "Card APIs",
  "purpose": "Retrieve a filtered list of credit cards that match user-supplied preferences and eligibility.",
  "requestSchema": {
    "type": "object",
    "description": "Generate a filtered list of credit cards based on user preferences and eligibility criteria.",
    "properties": {
      "slug": {
        "type": "string",
        "description": "Card-category slug (e.g. \"best-fuel-credit-card\"). Optional when you want an unfiltered catalogue."
      },
      "banks_ids": {
        "type": "array",
        "items": {
          "type": "integer"
        },
        "description": "Restrict results to these bank IDs. Can be obtained from the banks endpoint."
      },
      "card_networks": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": ["VISA", "Mastercard", "RuPay", "AmericanExpress"]
        },
        "description": "Restrict results to these card networks. Available options: VISA, Mastercard, RuPay, AmericanExpress."
      },
      "annualFees": {
        "type": "string",
        "description": "Annual fee range filter (e.g., \"0-15000\", \"0-5000\"). Empty string means no filter."
      },
      "credit_score": {
        "type": "integer",
        "description": "Credit score filter. Available options: 600 (Below 600), 650 (Upto 650), 750 (Upto 750), 800 (Upto 800)."
      },
      "sort_by": {
        "type": "string",
        "enum": ["recommended", "annual_savings", "annual_fees"],
        "description": "Sort order for results. Options: recommended (default), annual_savings (highest savings first), annual_fees (lowest fees first)."
      },
      "free_cards": {
        "type": "boolean",
        "description": "Filter for lifetime-free cards only. true for free cards only, false or omit for all cards."
      },
      "eligiblityPayload": {
        "type": "object",
        "properties": {
          "pincode": {
            "type": "string",
            "description": "User's pincode for location-based eligibility"
          },
          "inhandIncome": {
            "type": "string",
            "description": "User's monthly in-hand income"
          },
          "empStatus": {
            "type": "string",
            "enum": [
              "salaried",
              "self-employed"
            ],
            "description": "Employment status of the user"
          }
        },
        "required": [
          "pincode",
          "inhandIncome",
          "empStatus"
        ]
      },
      "cardGeniusPayload": {
        "type": "object",
        "properties": {
          "tag_id": {
            "type": "string",
            "description": "Tag ID for specific card category filtering"
          },
          "fuel": {
            "type": "string",
            "description": "₹ value of monthly fuel spend (example field—others may be added)."
          }
        }
      }
    },
    "required": [
      "eligiblityPayload",
      "cardGeniusPayload"
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
  "sampleRequest": {
    "slug": "best-fuel-credit-card",
    "banks_ids": [],
    "card_networks": [],
    "annualFees": "",
    "credit_score": "",
    "sort_by": "",
    "free_cards": "",
    "eligiblityPayload": {
      "pincode": "110001",
      "inhandIncome": "50000",
      "empStatus": "salaried"
    },
    "cardGeniusPayload": {
      "tag_id": "1",
      "fuel": "5000"
    }
  },
  "sampleResponse": {
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
  "curlExample": "curl --location 'https://{{BASE_URL}}/partner/cardgenius/cards' \\\n  --header 'Content-Type: application/json' \\\n  --header 'partner-token: {{PARTNER_TOKEN}}' \\\n  --data '{\n    \"slug\": \"best-fuel-credit-card\",\n    \"banks_ids\": [],\n    \"card_networks\": [],\n    \"annualFees\": \"\",\n    \"credit_score\": \"\",\n    \"sort_by\": \"\",\n    \"free_cards\": \"\",\n    \"eligiblityPayload\": {\n      \"pincode\": \"110001\",\n      \"inhandIncome\": \"50000\",\n      \"empStatus\": \"salaried\"\n    },\n    \"cardGeniusPayload\": {\n      \"tag_id\": \"1\",\n      \"fuel\": \"100\"\n    }\n  }'\n",
  "curlExampleStaging": "curl --location 'https://uat-platform.bankkaro.com/partner/cardgenius/cards' \\\n  --header 'Content-Type: application/json' \\\n  --header 'partner-token: <your_token_here>' \\\n  --data '{\n    \"slug\": \"best-fuel-credit-card\",\n    \"banks_ids\": [3,11],\n    \"card_networks\": [\"VISA\",\"Mastercard\",\"RuPay\"],\n    \"annualFees\": \"0-15000\",\n    \"credit_score\": 750,\n    \"sort_by\": \"annual_savings\",\n    \"free_cards\": true,\n    \"eligiblityPayload\": {\n      \"pincode\": \"110001\",\n      \"inhandIncome\": \"50000\",\n      \"empStatus\": \"salaried\"\n    },\n    \"cardGeniusPayload\": {\n      \"tag_id\": \"1\",\n      \"fuel\": \"5000\"\n    }\n  }'\n",
  "curlExampleProduction": "curl --location 'https://prod-platform.bankkaro.com/partner/cardgenius/cards' \\\n  --header 'partner-token: <your_partner_token>' \\\n  --header 'Content-Type: application/json' \\\n  --data '{\n    \"slug\": \"best-fuel-credit-card\",\n    \"banks_ids\": [3,7],\n    \"card_networks\": [\"VISA\",\"Mastercard\",\"RuPay\"],\n    \"annualFees\": \"0-15000\",\n    \"credit_score\": 750,\n    \"sort_by\": \"annual_fees\",\n    \"free_cards\": true,\n    \"eligiblityPayload\": {\n      \"pincode\": \"110001\",\n      \"inhandIncome\": \"50000\",\n      \"empStatus\": \"salaried\"\n    },\n    \"cardGeniusPayload\": {\n      \"tag_id\": \"2\",\n      \"fuel\": \"3000\"\n    }\n  }'\n",
  "status": "live",
  "rank": 6.5,
  "validationNotes": [
    "credit_score must be one of: 600, 650, 750, 800",
    "sort_by must be one of: recommended, annual_savings, annual_fees",
    "card_networks must be one or more of: VISA, Mastercard, RuPay, AmericanExpress",
    "annualFees should be in format 'min-max' (e.g., '0-15000')",
    "free_cards should be boolean (true/false) or omitted"
  ],
  "fieldTable": [
    {
      "field": "slug",
      "type": "string",
      "required": "No",
      "description": "Card category slug (e.g., 'best-fuel-credit-card'). Optional for unfiltered catalogue."
    },
    {
      "field": "banks_ids",
      "type": "array[integer]",
      "required": "No",
      "description": "Array of bank IDs to filter results. Can be obtained from the banks endpoint."
    },
    {
      "field": "card_networks",
      "type": "array[string]",
      "required": "No",
      "description": "Card networks to filter by. Options: VISA, Mastercard, RuPay, AmericanExpress."
    },
    {
      "field": "annualFees",
      "type": "string",
      "required": "No",
      "description": "Annual fee range filter (e.g., '0-15000', '0-5000'). Empty for no filter."
    },
    {
      "field": "credit_score",
      "type": "integer",
      "required": "No",
      "description": "Credit score filter. Options: 600 (Below 600), 650 (Upto 650), 750 (Upto 750), 800 (Upto 800)."
    },
    {
      "field": "sort_by",
      "type": "string",
      "required": "No",
      "description": "Sort order. Options: recommended (default), annual_savings, annual_fees."
    },
    {
      "field": "free_cards",
      "type": "boolean",
      "required": "No",
      "description": "Filter for lifetime-free cards only. true for free cards, false/omit for all cards."
    },
    {
      "field": "eligiblityPayload.pincode",
      "type": "string",
      "required": "Yes",
      "description": "User's 6-digit pincode for location-based eligibility."
    },
    {
      "field": "eligiblityPayload.inhandIncome",
      "type": "string",
      "required": "Yes",
      "description": "User's monthly in-hand income in INR."
    },
    {
      "field": "eligiblityPayload.empStatus",
      "type": "string",
      "required": "Yes",
      "description": "Employment status. Options: salaried, self-employed."
    },
    {
      "field": "cardGeniusPayload.tag_id",
      "type": "string",
      "required": "No",
      "description": "Tag ID for specific card category filtering."
    },
    {
      "field": "cardGeniusPayload.fuel",
      "type": "string",
      "required": "No",
      "description": "Monthly fuel spend in INR (example field)."
    }
  ],
  "products": [
    "Card Genius"
  ],
  "sampleResponses": [],
  "errorResponses": [],
  "errorResponse": {},
  "importantNotes": [],
  "headers": [],
  "additionalExamples": []
},
  'cardgenius/eligibility': {
  "name": "Eligibility",
  "endpoint": "/cardgenius/eligibility",
  "methods": [
    "POST"
  ],
  "description": "Check if a user qualifies for one or more cards based on pincode, in‑hand salary and employment type.",
  "category": "Card APIs",
  "purpose": "Surface only cards the user is eligible for before they start the application flow.",
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
  ],
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
  "errorResponse": {
    "status": "error",
    "message": "Invalid pincode or employment status.",
    "data": null
  },
  "sampleResponseBulk": {
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
  "sampleResponseSingle": {
    "status": "success",
    "message": "",
    "data": [
      {
        "card_alias": "sbi-cashback-credit-card",
        "id": 27,
        "seo_card_alias": "sbi-cashback-credit-card",
        "eligible": true
      }
    ]
  },
  "validationNotes": [
    "pincode must be a valid 6-digit Indian postal code",
    "inhandIncome must be a positive integer in INR",
    "empStatus must be one of: \"salaried\", \"self_employed\", \"business\"",
    "alias is optional - if provided, checks eligibility for specific card only",
    "Response includes eligibility status and rejection reasons if applicable"
  ],
  "curlExample": "curl --location 'https://{{BASE_URL}}/partner/cardgenius/eligibility' \\\n--header 'Content-Type: application/json' \\\n--data '{\n  \"pincode\": \"110001\",\n  \"inhandIncome\": 50000,\n  \"empStatus\": \"salaried\"\n}'",
  "curlExampleProd": "curl --location 'https://{{BASE_URL}}/partner/cardgenius/eligibility' \\\n--header 'Content-Type: application/json' \\\n--data '{\"pincode\":\"110001\",\"inhandIncome\":\"50000\",\"empStatus\":\"salaried\"}'",
  "curlExampleStaging": "curl --location 'https://{{BASE_URL}}/partner/cardgenius/eligibility' \\\n--header 'Content-Type: application/json' \\\n--data '{\"alias\":\"sbi-cashback-credit-card\",\"pincode\":\"560001\",\"inhandIncome\":\"35000\",\"empStatus\":\"salaried\"}'",
  "products": [
    "Card Genius"
  ],
  "status": "live",
  "rank": 7,
  "sampleResponses": [],
  "errorResponses": [],
  "curlExampleProduction": "",
  "importantNotes": [],
  "headers": [],
  "additionalExamples": []
},
  'cardgenius/cards/{card_slug}': {
  "name": "Card Detail",
  "endpoint": "/cardgenius/cards/{card_slug}",
  "methods": [
    "GET"
  ],
  "description": "Fetch the full specification and meta‑data for a single credit card.",
  "category": "Card APIs",
  "purpose": "Used on product‑detail pages, comparison views, or pre‑filled applications to obtain every field we store for a card.",
  "fieldTable": [
    {
      "field": "card_slug",
      "type": "string",
      "required": "Yes",
      "description": "The SEO‑friendly slug of the card (e.g. sbi-cashback-credit-card)."
    }
  ],
  "curlExample": "curl --location 'https://{{BASE_URL}}/partner/cardgenius/cards/icici-platinum-chip-credit-card' \\\n  --header 'Content-Type: application/json' \\\n  --header 'partner-token: {{PARTNER_TOKEN}}'\n",
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
  "validationNotes": [],
  "products": [
    "Card Genius"
  ],
  "methodDescriptions": {},
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
  "curlExampleStaging": "curl --location 'https://uat-platform.bankkaro.com/partner/cardgenius/cards/icici-platinum-chip-credit-card' \\\n  --header 'Content-Type: application/json' \\\n  --header 'partner-token: <your_token_here>'\n",
  "curlExampleProduction": "curl --location 'https://prod-platform.bankkaro.com/partner/cardgenius/cards/icici-platinum-chip-credit-card' \\\n  --header 'Content-Type: application/json' \\\n  --header 'partner-token: <your_token_here>'\n",
  "status": "live",
  "rank": 8,
  "sampleResponse": {},
  "errorResponse": {},
  "importantNotes": [],
  "headers": [],
  "additionalExamples": []
},
  'partner/health': {
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
    "type": "array",
    "items": {
      "type": "object",
      "properties": {
        "message": {
          "type": "string",
          "description": "Health check status message"
        }
      },
      "required": [
        "message"
      ]
    }
  },
  "sampleRequest": {},
  "sampleResponse": [
    {
      "message": "Up and Running"
    }
  ],
  "sampleResponses": [],
  "errorResponses": [],
  "curlExample": "curl --location 'https://{{BASE_URL}}/partner/health'\n",
  "curlExampleStaging": "curl --location 'https://uat-platform.bankkaro.com/partner/health'\n",
  "curlExampleProduction": "curl --location 'https://prod-platform.bankkaro.com/partner/health'\n",
  "validationNotes": [],
  "fieldTable": []
},
  'cardgenius/cards/calculate': {
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
  "curlExample": "curl --location 'https://{{BASE_URL}}/partner/cardgenius/calculate' \\\n  --header 'Content-Type: application/json' \\\n  --header 'partner-token: {{PARTNER_TOKEN}}' \\\n  --data '{\n    \"amazon_spends\": 15000,\n    \"flipkart_spends\": 25000,\n    \"other_online_spends\": 0,\n    \"other_offline_spends\": 0,\n    \"grocery_spends_online\": 0,\n    \"online_food_ordering\": 0,\n    \"fuel\": 0,\n    \"dining_or_going_out\": 0,\n    \"flights_annual\": 0,\n    \"hotels_annual\": 0,\n    \"domestic_lounge_usage_quarterly\": 0,\n    \"international_lounge_usage_quarterly\": 0,\n    \"mobile_phone_bills\": 0,\n    \"electricity_bills\": 0,\n    \"water_bills\": 0,\n    \"insurance_health_annual\": 0,\n    \"insurance_car_or_bike_annual\": 0,\n    \"rent\": 0,\n    \"school_fees\": 30000\n}'",
  "curlExampleStaging": "curl --location 'https://uat-platform.bankkaro.com/partner/cardgenius/calculate' \\\n  --header 'Content-Type: application/json' \\\n  --header 'partner-token: <your_token_here>' \\\n  --data '{\n    \"amazon_spends\": 15000,\n    \"flipkart_spends\": 25000,\n    \"other_online_spends\": 0,\n    \"other_offline_spends\": 0,\n    \"grocery_spends_online\": 0,\n    \"online_food_ordering\": 0,\n    \"fuel\": 0,\n    \"dining_or_going_out\": 0,\n    \"flights_annual\": 0,\n    \"hotels_annual\": 0,\n    \"domestic_lounge_usage_quarterly\": 0,\n    \"international_lounge_usage_quarterly\": 0,\n    \"mobile_phone_bills\": 0,\n    \"electricity_bills\": 0,\n    \"water_bills\": 0,\n    \"insurance_health_annual\": 0,\n    \"insurance_car_or_bike_annual\": 0,\n    \"rent\": 0,\n    \"school_fees\": 30000\n}'",
  "curlExampleProduction": "curl --location 'https://prod-platform.bankkaro.com/partner/cardgenius/calculate' \\\n  --header 'Content-Type: application/json' \\\n  --header 'partner-token: <your_token_here>' \\\n  --data '{\n    \"amazon_spends\": 15000,\n    \"flipkart_spends\": 25000,\n    \"other_online_spends\": 0,\n    \"other_offline_spends\": 0,\n    \"grocery_spends_online\": 0,\n    \"online_food_ordering\": 0,\n    \"fuel\": 0,\n    \"dining_or_going_out\": 0,\n    \"flights_annual\": 0,\n    \"hotels_annual\": 0,\n    \"domestic_lounge_usage_quarterly\": 0,\n    \"international_lounge_usage_quarterly\": 0,\n    \"mobile_phone_bills\": 0,\n    \"electricity_bills\": 0,\n    \"water_bills\": 0,\n    \"insurance_health_annual\": 0,\n    \"insurance_car_or_bike_annual\": 0,\n    \"rent\": 0,\n    \"school_fees\": 30000\n}'",
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
  ]
},
  'partner/logout': {
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
  "curlExample": "curl --location 'https://{{BASE_URL}}/partner/logout' \\\n--header 'partner-token: {{PARTNER_TOKEN}}' \\\n--header 'Authorization: <your_auth_token>'",
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
}
};

export const cardGeniusApiData = {
  // Card Genius specific data
};

export const projects = {
  // Project data
};

