export const apiData = {
  'partner-auth': {
    name: 'Partner Authentication',
    endpoint: '/sp/api/partner-auth',
    methods: ['POST'],
    description: 'Authenticate a partner and get access token',
    category: 'Partner APIs',
    purpose: 'Authenticate a partner using mobile number and OTP to obtain access token for API operations',
    requestSchema: {
      type: 'object',
      properties: {
        mobile: {
          type: 'string',
          description: 'Mobile number for authentication',
          required: true,
          validation: 'Must be a valid 10-digit mobile number'
        },
        otp: {
          type: 'string',
          description: 'One-time password for verification',
          required: true,
          validation: 'Must be a 6-digit OTP'
        }
      }
    },
    responseSchema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          description: 'Response status (success/error)'
        },
        message: {
          type: 'string',
          description: 'Response message'
        },
        data: {
          type: 'object',
          properties: {
            auth_token: {
              type: 'string',
              description: 'JWT authentication token'
            },
            user_data: {
              type: 'object',
              properties: {
                mobile: {
                  type: 'string',
                  description: 'User mobile number'
                },
                name: {
                  type: 'string',
                  description: 'User name'
                }
              }
            }
          }
        }
      }
    },
    sampleRequest: {
      mobile: "9999999999",
      otp: "123456"
    },
    sampleResponse: {
      status: 'success',
      message: '',
      data: {
        auth_token: 'eyJhbGciOiJIUzI1NiIs...',
        user_data: {
          mobile: '9999999999',
          name: 'John Doe'
        }
      }
    },
    errorResponse: {
      status: 'error',
      message: 'Invalid OTP or mobile number.',
      data: null
    },
    curlExample: `curl --location 'https://yourdomain.com/sp/api/partner-auth' \\
--header 'Authorization: Bearer <partner_token>' \\
--header 'Content-Type: application/json' \\
--data '{
  "mobile": "9999999999",
  "otp": "123456"
}'`,
    validationNotes: [
      'mobile must be a valid 10-digit number',
      'otp must be exactly 6 digits',
      'Authorization header with partner token is required',
      'OTP expires after 5 minutes'
    ],
    fieldTable: [
      {
        field: 'mobile',
        type: 'string',
        required: 'Yes',
        description: 'Mobile number for authentication (10 digits)'
      },
      {
        field: 'otp',
        type: 'string',
        required: 'Yes',
        description: 'One-time password for verification (6 digits)'
      }
    ]
  },
  'lead-details': {
    name: 'Lead Details',
    endpoint: '/sp/api/lead-details',
    methods: ['GET', 'POST'],
    description: 'Retrieve or create lead information',
    category: 'Partner APIs',
    purpose: 'Manage lead information including customer details and loan requirements',
    get: {
      requestSchema: {
        type: 'object',
        properties: {
          leadId: {
            type: 'string',
            description: 'Lead identifier to retrieve',
            required: true,
            validation: 'Must be a valid UUID format'
          }
        }
      },
      responseSchema: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            description: 'Response status (success/error)'
          },
          message: {
            type: 'string',
            description: 'Response message'
          },
          data: {
            type: 'object',
            properties: {
              leadId: {
                type: 'string',
                description: 'Lead identifier'
              },
              customerDetails: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Customer name'
                  },
                  email: {
                    type: 'string',
                    description: 'Customer email'
                  },
                  phone: {
                    type: 'string',
                    description: 'Customer phone'
                  }
                }
              },
              loanDetails: {
                type: 'object',
                properties: {
                  amount: {
                    type: 'number',
                    description: 'Loan amount'
                  },
                  purpose: {
                    type: 'string',
                    description: 'Loan purpose'
                  },
                  status: {
                    type: 'string',
                    description: 'Lead status'
                  }
                }
              },
              createdAt: {
                type: 'string',
                description: 'Lead creation timestamp'
              }
            }
          }
        }
      },
      sampleRequest: {
        leadId: "550e8400-e29b-41d4-a716-446655440001"
      },
      sampleResponse: {
        status: 'success',
        message: 'Lead retrieved successfully',
        data: {
          leadId: "550e8400-e29b-41d4-a716-446655440001",
          customerDetails: {
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "9876543210"
          },
          loanDetails: {
            amount: 500000,
            purpose: "personal",
            status: "pending"
          },
          createdAt: "2024-01-15T10:30:00Z"
        }
      },
      errorResponse: {
        status: 'error',
        message: 'Lead not found or access denied.',
        data: null
      },
      curlExample: `curl --location 'https://yourdomain.com/sp/api/lead-details?leadId=550e8400-e29b-41d4-a716-446655440001' \\
--header 'Authorization: Bearer <auth_token>'`,
      validationNotes: [
        "leadId must be a valid UUID format",
        "leadId must exist in the system",
        "Authorization header with auth token is required"
      ],
      fieldTable: [
        {
          field: 'leadId',
          type: 'string',
          required: 'Yes',
          description: 'Lead identifier to retrieve (UUID format)'
        }
      ]
    },
    post: {
      requestSchema: {
        type: 'object',
        properties: {
          customerName: {
            type: 'string',
            description: 'Full name of the customer',
            required: true,
            validation: 'Must be 2-100 characters'
          },
          email: {
            type: 'string',
            description: 'Customer email address',
            required: true,
            validation: 'Must be a valid email format'
          },
          phone: {
            type: 'string',
            description: 'Customer phone number',
            required: true,
            validation: 'Must be 10 digits'
          },
          loanAmount: {
            type: 'number',
            description: 'Requested loan amount',
            required: true,
            validation: 'Must be between 10,000 and 50,00,000'
          },
          purpose: {
            type: 'string',
            description: 'Purpose of the loan',
            required: true,
            validation: 'Must be one of: personal, business, home, vehicle'
          }
        }
      },
      responseSchema: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            description: 'Response status (success/error)'
          },
          message: {
            type: 'string',
            description: 'Response message'
          },
          data: {
            type: 'object',
            properties: {
              leadId: {
                type: 'string',
                description: 'Generated lead identifier'
              },
              status: {
                type: 'string',
                description: 'Lead creation status'
              },
              customerDetails: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Customer name'
                  },
                  email: {
                    type: 'string',
                    description: 'Customer email'
                  },
                  phone: {
                    type: 'string',
                    description: 'Customer phone'
                  }
                }
              },
              loanDetails: {
                type: 'object',
                properties: {
                  amount: {
                    type: 'number',
                    description: 'Loan amount'
                  },
                  purpose: {
                    type: 'string',
                    description: 'Loan purpose'
                  },
                  status: {
                    type: 'string',
                    description: 'Lead status'
                  }
                }
              },
              createdAt: {
                type: 'string',
                description: 'Lead creation timestamp'
              }
            }
          }
        }
      },
      sampleRequest: {
        customerName: "John Doe",
        email: "john.doe@example.com",
        phone: "9876543210",
        loanAmount: 500000,
        purpose: "personal"
      },
      sampleResponse: {
        status: 'success',
        message: 'Lead created successfully',
        data: {
          leadId: "550e8400-e29b-41d4-a716-446655440001",
          status: "created",
          createdAt: "2024-01-15T10:30:00Z",
          customerDetails: {
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "9876543210"
          },
          loanDetails: {
            amount: 500000,
            purpose: "personal",
            status: "pending"
          }
        }
      },
      errorResponse: {
        status: 'error',
        message: 'Invalid customer data provided.',
        data: null
      },
      curlExample: `curl --location 'https://yourdomain.com/sp/api/lead-details' \\
--header 'Authorization: Bearer <auth_token>' \\
--header 'Content-Type: application/json' \\
--data '{
  "customerName": "John Doe",
  "email": "john.doe@example.com",
  "phone": "9876543210",
  "loanAmount": 500000,
  "purpose": "personal"
}'`,
      validationNotes: [
        "customerName must be 2-100 characters",
        "email must be a valid email format",
        "phone must be exactly 10 digits",
        "loanAmount must be between 10,000 and 50,00,000",
        "purpose must be one of the allowed values"
      ],
      fieldTable: [
        {
          field: 'customerName',
          type: 'string',
          required: 'Yes',
          description: 'Full name of the customer (2-100 characters)'
        },
        {
          field: 'email',
          type: 'string',
          required: 'Yes',
          description: 'Customer email address (valid email format)'
        },
        {
          field: 'phone',
          type: 'string',
          required: 'Yes',
          description: 'Customer phone number (10 digits)'
        },
        {
          field: 'loanAmount',
          type: 'number',
          required: 'Yes',
          description: 'Requested loan amount (10,000 - 50,00,000)'
        },
        {
          field: 'purpose',
          type: 'string',
          required: 'Yes',
          description: 'Purpose of the loan (personal, business, home, vehicle)'
        }
      ]
    }
  },
  'application': {
    name: 'Loan Application',
    endpoint: '/sp/api/application',
    methods: ['POST'],
    description: 'Submit a complete loan application',
    category: 'Partner APIs',
    purpose: 'Submit comprehensive loan application with personal, employment, and document information',
    requestSchema: {
      type: 'object',
      properties: {
        leadId: {
          type: 'string',
          description: 'Lead identifier from lead-details',
          required: true,
          validation: 'Must be a valid UUID format'
        },
        personalInfo: {
          type: 'object',
          description: 'Personal information',
          required: true,
          properties: {
            dateOfBirth: {
              type: 'string',
              description: 'Date of birth in YYYY-MM-DD format',
              required: true
            },
            panNumber: {
              type: 'string',
              description: 'PAN card number',
              required: true,
              validation: 'Must be 10 characters'
            },
            aadharNumber: {
              type: 'string',
              description: 'Aadhar card number',
              required: true,
              validation: 'Must be 12 digits'
            }
          }
        },
        employmentInfo: {
          type: 'object',
          description: 'Employment details',
          required: true,
          properties: {
            employmentType: {
              type: 'string',
              description: 'Type of employment',
              required: true,
              validation: 'Must be one of: salaried, self-employed, business'
            },
            monthlyIncome: {
              type: 'number',
              description: 'Monthly income',
              required: true,
              validation: 'Must be positive number'
            },
            companyName: {
              type: 'string',
              description: 'Company or business name',
              required: false
            }
          }
        },
        documents: {
          type: 'array',
          description: 'Document URLs',
          required: true,
          items: {
            type: 'string',
            description: 'Document URL'
          }
        }
      }
    },
    responseSchema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          description: 'Application submission success status'
        },
        message: {
          type: 'string',
          description: 'Response message'
        },
        data: {
          type: 'object',
          properties: {
            applicationId: {
              type: 'string',
              description: 'Generated application identifier'
            },
            status: {
              type: 'string',
              description: 'Application status'
            },
            submittedAt: {
              type: 'string',
              description: 'Application submission timestamp'
            },
            estimatedProcessingTime: {
              type: 'string',
              description: 'Estimated processing time'
            },
            nextSteps: {
              type: 'array',
              description: 'Next steps in the process',
              items: {
                type: 'string'
              }
            }
          }
        }
      }
    },
    sampleRequest: {
      leadId: "550e8400-e29b-41d4-a716-446655440001",
      personalInfo: {
        dateOfBirth: "1990-05-15",
        panNumber: "ABCDE1234F",
        aadharNumber: "123456789012"
      },
      employmentInfo: {
        employmentType: "salaried",
        monthlyIncome: 75000,
        companyName: "Tech Solutions Ltd"
      },
      documents: [
        "https://example.com/pan-card.pdf",
        "https://example.com/aadhar-card.pdf",
        "https://example.com/salary-slip.pdf"
      ]
    },
    sampleResponse: {
      status: 'success',
      message: 'Application submitted successfully',
      data: {
        applicationId: "app_1234567890abcdef",
        status: "submitted",
        submittedAt: "2024-01-15T10:30:00Z",
        estimatedProcessingTime: "3-5 business days",
        nextSteps: [
          "Document verification",
          "Credit check",
          "Loan approval"
        ]
      }
    },
    errorResponse: {
      status: 'error',
      message: 'Invalid application data or missing required documents.',
      data: null
    },
    curlExample: `curl --location 'https://yourdomain.com/sp/api/application' \\
--header 'Authorization: Bearer <auth_token>' \\
--header 'Content-Type: application/json' \\
--data '{
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
}'`,
    validationNotes: [
      "leadId must be a valid UUID and must exist",
      "dateOfBirth must be in YYYY-MM-DD format",
      "panNumber must be exactly 10 characters",
      "aadharNumber must be exactly 12 digits",
      "employmentType must be one of the allowed values",
      "monthlyIncome must be a positive number",
      "At least one document URL is required"
    ],
    fieldTable: [
      {
        field: 'leadId',
        type: 'string',
        required: 'Yes',
        description: 'Lead identifier from lead-details (UUID format)'
      },
      {
        field: 'personalInfo.dateOfBirth',
        type: 'string',
        required: 'Yes',
        description: 'Date of birth in YYYY-MM-DD format'
      },
      {
        field: 'personalInfo.panNumber',
        type: 'string',
        required: 'Yes',
        description: 'PAN card number (10 characters)'
      },
      {
        field: 'personalInfo.aadharNumber',
        type: 'string',
        required: 'Yes',
        description: 'Aadhar card number (12 digits)'
      },
      {
        field: 'employmentInfo.employmentType',
        type: 'string',
        required: 'Yes',
        description: 'Type of employment (salaried, self-employed, business)'
      },
      {
        field: 'employmentInfo.monthlyIncome',
        type: 'number',
        required: 'Yes',
        description: 'Monthly income (positive number)'
      },
      {
        field: 'employmentInfo.companyName',
        type: 'string',
        required: 'No',
        description: 'Company or business name'
      },
      {
        field: 'documents',
        type: 'array',
        required: 'Yes',
        description: 'Array of document URLs (at least one required)'
      }
    ]
  },
  'partner-autoAuth': {
    name: 'Partner Auto Authentication',
    endpoint: '/sp/api/partner-autoAuth',
    methods: ['POST'],
    description: 'Auto-authenticate partners using mobile number or exit_id without UI',
    category: 'Partner APIs',
    purpose: 'If a partner has their own login system, they can directly pass the mobile number or a valid exit_id to this endpoint. This will create or log in the user at BankKaro without showing any UI.',
    requestSchema: {
      type: 'object',
      properties: {
        mobile: {
          type: 'string',
          description: 'Mobile number to auto login user (if no exit_id used)',
          required: false,
          validation: 'Must be a valid 10-digit mobile number'
        },
        exit_id: {
          type: 'string',
          description: 'Used for login via CK or PS if mobile not provided',
          required: false,
          validation: 'Must be a valid exit_id format for the specified vendor'
        },
        vendor: {
          type: 'string',
          description: 'Must be either CK or PS with valid exit_id',
          required: false,
          validation: 'Must be either "CK" (CashKaro) or "PS" (ProfitShare)'
        }
      }
    },
    responseSchema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          description: 'Response status (success/error)'
        },
        message: {
          type: 'string',
          description: 'Response message'
        },
        data: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Auto login success message'
            },
            token: {
              type: 'string',
              description: 'Authentication token'
            },
            user_id: {
              type: 'string',
              description: 'User identifier'
            },
            partner: {
              type: 'string',
              description: 'Partner name'
            },
            newUser: {
              type: 'boolean',
              description: 'Whether this is a new user'
            },
            user_data: {
              type: 'object',
              description: 'Complete user data including mobile, email, and partner info'
            }
          }
        }
      }
    },
    sampleRequest: {
      mobile: "7011048697"
    },
    sampleResponse: {
      status: "success",
      message: "",
      data: {
        message: "Auto Login Success",
        token: "<auth_token>",
        user_id: "197",
        partner: "EXAMPLE_PARTNER",
        newUser: false,
        user_data: {
          status: "success",
          message: "",
          data: {
            user_data: {
              mobile: "7011048697",
              email: null,
              partner: "EXAMPLE_PARTNER"
            },
            spendingHabits: [],
            tag_genius_data: []
          }
        }
      }
    },
    errorResponses: [
      {
        title: 'Invalid Payload',
        statusCode: 400,
        response: {
          status: "error",
          message: "An error occurred",
          error: {
            data: {
              message: "Invalid Payload"
            },
            statusCode: 400
          }
        }
      },
      {
        title: 'CK ID not found',
        statusCode: 500,
        response: {
          status: "error",
          message: "An error occurred",
          error: {
            data: {
              message: "ck id not found"
            },
            statusCode: 500
          }
        }
      },
      {
        title: 'Invalid PS exit id',
        statusCode: 500,
        response: {
          status: "error",
          message: "An error occurred",
          error: {
            data: {
              message: "Invalid exit id format"
            },
            statusCode: 500
          }
        }
      }
    ],
    curlExample: `curl --location 'https://bk-api.bankkaro.com/sp/api/partner-autoAuth' \\
--header 'Host: abc.example-partner.com' \\
--header 'origin: abc.example-partner.com' \\
--header 'partner-token: <partner_token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "mobile": "7011048697"
}'`,
    validationNotes: [
      "One of mobile or exit_id + vendor must be provided",
      "mobile must be a valid 10-digit number if provided",
      "vendor must be either 'CK' (CashKaro) or 'PS' (ProfitShare) if exit_id is used",
      "exit_id must be in valid format for the specified vendor",
      "partner-token header is required from /partner-token API"
    ],
    importantNotes: [
      '🔐 This API allows partners to auto-authenticate users without showing BankKaro UI.',
      '📱 Can authenticate using mobile number or exit_id from CashKaro/ProfitShare.',
      '🎯 Perfect for partners with their own login systems.',
      '📋 Response includes complete user data and authentication token.'
    ],
    fieldTable: [
      {
        field: 'mobile',
        type: 'string',
        required: 'Optional',
        description: 'Mobile number to auto login user (10 digits, if no exit_id used)'
      },
      {
        field: 'exit_id',
        type: 'string',
        required: 'Optional',
        description: 'Used for login via CK or PS if mobile not provided'
      },
      {
        field: 'vendor',
        type: 'string',
        required: 'Optional',
        description: 'Must be either "CK" (CashKaro) or "PS" (ProfitShare) with valid exit_id'
      }
    ],
    headers: [
      {
        header: 'Host',
        value: 'Partner domain (e.g., abc.example-partner.com)',
        required: true
      },
      {
        header: 'origin',
        value: 'Partner origin',
        required: true
      },
      {
        header: 'partner-token',
        value: 'JWT token from /partner-token API',
        required: true
      },
      {
        header: 'Content-Type',
        value: 'application/json',
        required: true
      }
    ],
    additionalExamples: [
      {
        title: 'Auto Auth using Exit ID (CashKaro)',
        description: 'Authenticate using CashKaro exit_id',
        curl: `curl --location 'https://bk-api.bankkaro.com/sp/api/partner-autoAuth' \\
--header 'partner-token: <partner_token>' \\
--header 'Content-Type: application/json' \\
--data '{
  "exit_id": "A VALID CHKR",
  "vendor": "CK"
}'`
      },
      {
        title: 'Auto Auth using Exit ID (ProfitShare)',
        description: 'Authenticate using ProfitShare exit_id',
        curl: `curl --location 'https://bk-api.bankkaro.com/sp/api/partner-autoAuth' \\
--header 'partner-token: <partner_token>' \\
--header 'Content-Type: application/json' \\
--data '{
  "exit_id": "A VALID PS exit",
  "vendor": "PS"
}'`
      }
    ]
  },
  'partner-token': {
    name: 'Partner Token Generation',
    endpoint: '/sp/api/partner-token',
    methods: ['POST'],
    description: 'Generate a partner-token (JWT) that is required for authorization in subsequent API calls',
    category: 'Partner APIs',
    purpose: 'Used to generate a `partner-token` (JWT) that is required for authorization in subsequent API calls like `/partner-auth`, `/lead-details`, etc.',
    requestSchema: {
      type: 'object',
      properties: {
        'x-api-key': {
          type: 'string',
          description: 'Unique key provided by BankKaro (staging/prod specific). Must be kept secret on the backend.',
          required: true,
          validation: 'Must be a valid API key provided by BankKaro'
        }
      }
    },
    responseSchema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          description: 'Response status (success/error)'
        },
        message: {
          type: 'string',
          description: 'Response message'
        },
        data: {
          type: 'object',
          properties: {
            jwttoken: {
              type: 'string',
              description: 'JWT token to be sent in the Authorization header of other APIs'
            },
            expiresAt: {
              type: 'string',
              description: 'ISO timestamp showing when this token expires'
            }
          }
        }
      }
    },
    sampleRequest: {
      'x-api-key': 'test'
    },
    sampleResponse: {
      status: 'success',
      message: '',
      data: {
        jwttoken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        expiresAt: '2025-06-20T13:21:57.283Z'
      }
    },
    errorResponse: {
      status: 'error',
      message: 'Invalid API key provided.',
      data: null
    },
    errorResponses: [
      {
        title: 'Invalid x-api-key',
        statusCode: 403,
        response: {
          status: 'error',
          message: "Invalid partner API secret"
        }
      },
      {
        title: 'Missing x-api-key',
        statusCode: 403,
        response: {
          status: 'error',
          message: "Partner API secret missing"
        }
      }
    ],
    curlExample: `curl --location 'http://localhost:8000/sp/api/partner-token' \\
--header 'Host: abc.example-partner.com' \\
--header 'origin: abc.example-partner.com' \\
--header 'Content-Type: application/json' \\
--data '{
    "x-api-key": "test"
}'`,
    validationNotes: [
      'x-api-key must be a valid API key provided by BankKaro',
      'This API must only be called from the server-side to prevent leaking the x-api-key',
      'Do not expose this API in frontend JavaScript or browser tools',
      'The jwttoken is time-bound and should be refreshed before expiry'
    ],
    importantNotes: [
      '🔐 This API must only be called from the server-side to prevent leaking the x-api-key.',
      '⚠️ Do not expose this API in frontend JavaScript or browser tools.',
      '⏱ The jwttoken is time-bound and should be refreshed before expiry.',
      '📎 To use it in subsequent requests, include in headers: Authorization: Bearer <jwttoken>'
    ],
    fieldTable: [
      {
        field: 'x-api-key',
        type: 'string',
        required: 'Yes',
        description: 'Unique key provided by BankKaro (staging/prod specific). Must be kept secret on the backend.'
      }
    ]
  }
};

export const cardGeniusApiData = {
  'v1-banks': {
    name: 'Banks',
    endpoint: '/v1/banks',
    methods: ['GET'],
    description: 'Lists all available banks for filtering.',
    category: 'Card APIs',
    purpose: 'Retrieve a list of all banks to populate filter options in the user interface.',
    responseSchema: {
      type: 'object',
      properties: {
        banks: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              bank_id: { type: 'integer', description: 'Unique identifier for the bank.' },
              bank_name: { type: 'string', description: 'Name of the bank.' },
              logo_url: { type: 'string', description: 'URL for the bank\'s logo.' },
              status: { type: 'string', description: 'Status of the bank (e.g., "active").' }
            }
          }
        }
      }
    },
    sampleResponse: {
      "banks": [
        {
          "bank_id": 1,
          "bank_name": "Axis Bank",
          "logo_url": "https://example.com/axis.png",
          "status": "active"
        }
      ]
    },
    curlExample: `curl --location 'https://api.bankkaro.com/v1/banks' \\
--header 'Authorization: Bearer <jwt>'`
  },
  'v1-categories': {
    name: 'Categories',
    endpoint: '/v1/categories',
    methods: ['GET'],
    description: 'Lists all available card categories for filtering.',
    category: 'Card APIs',
    purpose: 'Retrieve a list of all card categories to populate filter options in the user interface.',
    responseSchema: {
      type: 'object',
      properties: {
        categories: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              category_id: { type: 'integer', description: 'Unique identifier for the category.' },
              category_slug: { type: 'string', description: 'URL-friendly slug for the category.' },
              name: { type: 'string', description: 'Name of the category.' },
              description: { type: 'string', description: 'Description of the category.' },
              image_url: { type: 'string', description: 'URL for the category image.' },
              highlight_color: { type: 'string', description: 'Hex color code for UI highlights.' }
            }
          }
        }
      }
    },
    sampleResponse: {
      "categories": [
        {
          "category_id": 1,
          "category_slug": "fuel",
          "name": "Fuel",
          "description": "Cards with fuel surcharge waiver & cashback",
          "image_url": "https://example.com/fuel.png",
          "highlight_color": "#274B4D"
        }
      ]
    },
    curlExample: `curl --location 'https://api.bankkaro.com/v1/categories' \\
--header 'Authorization: Bearer <jwt>'`
  },
  'v1-cards-catalog': {
    name: 'Cards Catalog',
    endpoint: '/v1/cards',
    methods: ['GET'],
    description: 'Browse or search for credit cards with powerful filtering.',
    category: 'Card APIs',
    purpose: 'Retrieve a paginated list of credit cards based on various filter criteria.',
    fieldTable: [
      { field: 'bank_id[]', type: 'integer', required: 'No', description: 'Filter by one or more bank IDs.' },
      { field: 'category_slug', type: 'string', required: 'No', description: 'Filter by category slug.' },
      { field: 'card_network', type: 'string', required: 'No', description: 'Filter by card network (e.g., Visa).' },
      { field: 'max_annual_fee', type: 'integer', required: 'No', description: 'Filter by maximum annual fee.' },
      { field: 'is_lifetime_free', type: 'boolean', required: 'No', description: 'Filter for lifetime free cards.' },
      { field: 'sort', type: 'string', required: 'No', description: 'Sort order (recommended, annual_savings, annual_fee).' },
      { field: 'page_size', type: 'integer', required: 'No', description: 'Number of results per page (default 50).' },
      { field: 'page_token', type: 'string', required: 'No', description: 'Token for fetching the next page.' },
      { field: 'field_mask', type: 'string', required: 'No', description: 'Mask for specifying which fields to return.' },
    ],
    sampleResponse: {
      "cards": [
        {
          "card_id": 27,
          "card_slug": "sbi-cashback-credit-card",
          "card_name": "SBI Cashback Credit Card",
          "bank": { "bank_id": 11, "bank_name": "SBI Card" },
          "card_image_url": "https://example.com/sbi.png",
          "card_bg_url": "https://example.com/sbi_bg.webp",
          "card_network": "Visa",
          "joining_fee": 999,
          "annual_fee": 999,
          "fee_summary": "₹999 annual (waiver on ₹2 L spend)",
          "top_usp": "5 % cashback on online spends",
          "rating": 4.0,
          "user_rating_count": 413,
          "tags": ["shopping", "dining", "utility"]
        }
      ],
      "next_page_token": "eyJpZCI6Mjh9"
    },
    curlExample: `curl --location 'https://api.bankkaro.com/v1/cards?category_slug=fuel&is_lifetime_free=true' \\
--header 'Authorization: Bearer <jwt>'`
  },
  'v1-card-detail': {
    name: 'Card Detail',
    endpoint: '/v1/cards/{card_slug}',
    methods: ['GET'],
    description: 'Get the full specifications of a single credit card.',
    category: 'Card APIs',
    purpose: 'Retrieve all details for a specific card, identified by its slug.',
    responseSchema: {
      type: 'object',
      properties: {
        card: {
          type: 'object',
          properties: {
            card_id: { type: 'integer' },
            card_slug: { type: 'string' },
            card_name: { type: 'string' },
            bank: { type: 'object', properties: { bank_id: { type: 'integer' }, bank_name: { type: 'string' } } },
            card_image_url: { type: 'string' },
            card_network: { type: 'string' },
            joining_fee: { type: 'integer' },
            annual_fee: { type: 'integer' },
            fee_summary: { type: 'string' },
            partner_commission: { type: 'integer' },
            eligibility: { type: 'object', properties: { /* ... */ } },
            features: { type: 'object', properties: { /* ... */ } },
            fees_and_charges: { type: 'object', properties: { /* ... */ } },
            rating: { type: 'number' },
            user_rating_count: { type: 'integer' },
            tags: { type: 'array', items: { type: 'string' } }
          }
        }
      }
    },
    sampleResponse: {
      "card": {
        "card_id": 27,
        "card_slug": "sbi-cashback-credit-card",
        "card_name": "SBI Cashback Credit Card",
        "bank": { "bank_id": 11, "bank_name": "SBI Card" },
        "card_image_url": "https://example.com/sbi.png",
        "card_network": "Visa",
        "joining_fee": 999,
        "annual_fee": 999,
        "fee_summary": "₹999 annual (waiver on ₹2 L spend)",
        "partner_commission": 650,
        "eligibility": {
          "age_range": "18 70 yrs",
          "monthly_income_min": 30000,
          "credit_score_min": 700
        },
        "features": {
          "welcome_benefits": ["₹500 cashback on first ₹5k spend"],
          "milestone_benefits": ["Annual fee waiver on ₹2 L spend"],
          "rewards": ["5 % on online, 1 % offline"],
          "other_benefits": ["4 domestic lounge visits/qtr"]
        },
        "fees_and_charges": {
          "finance_charge_pct_monthly": 3.5,
          "late_payment_fee": "₹0 ₹1300 slab",
          "forex_markup_pct": 1
        },
        "rating": 4.0,
        "user_rating_count": 413,
        "tags": ["shopping", "dining", "utility"]
      }
    },
    curlExample: `curl --location 'https://api.bankkaro.com/v1/cards/sbi-cashback-credit-card' \\
--header 'Authorization: Bearer <jwt>'`
  },
  'v1-card-genius-calculator': {
    name: 'Card Genius Calculator',
    endpoint: '/v1/cards/calculate',
    methods: ['POST'],
    description: 'Recommends the best cards based on a user\'s spending profile.',
    category: 'Card APIs',
    purpose: 'Calculate and rank credit cards by potential monetary savings for the user.',
    requestSchema: {
      type: 'object',
      description: 'A full spend profile. See Appendix A in the main documentation for all keys. Missing keys default to 0.',
      properties: {
        monthly_amazon_spend: { type: 'integer', description: 'Monthly spend on Amazon.' },
        monthly_fuel_spend: { type: 'integer', description: 'Monthly spend on fuel.' },
      }
    },
    sampleResponse: {
      "recommendations": [
        {
          "card_slug": "sbi-cashback-credit-card",
          "card_name": "SBI Cashback Credit Card",
          "card_image_url": "https://example.com/sbi.png",
          "total_savings_yearly": 19668,
          "net_savings_after_fees": 18669,
          "spend_breakdown": {
            "monthly_amazon_spend": { "spend": 10000, "savings": 500, "rate_pct": 5 },
            "monthly_fuel_spend": { "spend": 3000, "savings": 0, "note": "surcharge waiver" }
          }
        }
      ]
    },
    curlExample: `curl --location 'https://api.bankkaro.com/v1/cards/calculate' \\
--header 'Authorization: Bearer <jwt>' \\
--header 'Content-Type: application/json' \\
--data '{
    "monthly_amazon_spend": 10000,
    "monthly_fuel_spend": 3000
}'`
  }
};

export const projects = {
  bankkaro: {
    name: 'BankKaro for Business',
    description: 'APIs for loan and financial product distribution.',
    apis: apiData,
    dashboard: true
  },
  cardGenius: {
    name: 'CardGenius Suite',
    description: 'REST endpoints for credit card discovery and personalization.',
    apis: cardGeniusApiData,
    dashboard: false
  }
};
