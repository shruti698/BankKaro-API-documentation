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
  },
  'initial-data': {
    name: 'Initialization Bundle',
    endpoint: '/cardgenius/initial-data',
    methods: ['GET'],
    description: 'Returns all static data required to initialize the CardGenius app.',
    category: 'Card APIs',
    purpose: 'Provides banks, categories, and other static data needed for app initialization.',
    responseSchema: {
      type: 'object',
      properties: {
        banks: {
          type: 'array',
          description: 'List of all available banks'
        },
        categories: {
          type: 'array', 
          description: 'List of all card categories'
        },
        tags: {
          type: 'array',
          description: 'List of all available tags'
        }
      }
    },
    sampleResponse: {
      "banks": [
        {
          "id": 1,
          "name": "HDFC Bank",
          "logo_url": "https://example.com/hdfc-logo.png"
        },
        {
          "id": 2, 
          "name": "SBI",
          "logo_url": "https://example.com/sbi-logo.png"
        }
      ],
      "categories": [
        {
          "id": 1,
          "name": "Shopping",
          "icon": "shopping_cart"
        },
        {
          "id": 2,
          "name": "Travel",
          "icon": "flight"
        }
      ],
      "tags": [
        {
          "id": 1,
          "name": "Cashback",
          "color": "#4CAF50"
        },
        {
          "id": 2,
          "name": "Rewards",
          "color": "#2196F3"
        }
      ]
    },
    curlExample: `curl --location 'https://api.bankkaro.com/cardgenius/initial-data' \\
--header 'Authorization: Bearer <jwt>'`
  },
  'banks': {
    name: 'Banks List',
    endpoint: '/cardgenius/banks',
    methods: ['GET'],
    description: 'Get a list of all available banks.',
    category: 'Card APIs',
    purpose: 'Retrieve all banks that offer credit cards through the platform.',
    responseSchema: {
      type: 'object',
      properties: {
        banks: {
          type: 'array',
          description: 'List of banks',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'Bank ID' },
              name: { type: 'string', description: 'Bank name' },
              logo_url: { type: 'string', description: 'Bank logo URL' }
            }
          }
        }
      }
    },
    sampleResponse: {
      "banks": [
        {
          "id": 1,
          "name": "HDFC Bank",
          "logo_url": "https://example.com/hdfc-logo.png"
        },
        {
          "id": 2,
          "name": "SBI",
          "logo_url": "https://example.com/sbi-logo.png"
        }
      ]
    },
    curlExample: `curl --location 'https://api.bankkaro.com/cardgenius/banks' \\
--header 'Authorization: Bearer <jwt>'`
  },
  'categories': {
    name: 'Categories List',
    endpoint: '/cardgenius/categories',
    methods: ['GET'],
    description: 'Get a list of all card categories.',
    category: 'Card APIs',
    purpose: 'Retrieve all available card categories for filtering and organization.',
    responseSchema: {
      type: 'object',
      properties: {
        categories: {
          type: 'array',
          description: 'List of categories',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'Category ID' },
              name: { type: 'string', description: 'Category name' },
              icon: { type: 'string', description: 'Category icon' }
            }
          }
        }
      }
    },
    sampleResponse: {
      "categories": [
        {
          "id": 1,
          "name": "Shopping",
          "icon": "shopping_cart"
        },
        {
          "id": 2,
          "name": "Travel",
          "icon": "flight"
        }
      ]
    },
    curlExample: `curl --location 'https://api.bankkaro.com/cardgenius/categories' \\
--header 'Authorization: Bearer <jwt>'`
  },
  'cards': {
    name: 'Cards Catalog',
    endpoint: '/cardgenius/cards',
    methods: ['GET'],
    description: 'Get a paginated list of all available credit cards.',
    category: 'Card APIs',
    purpose: 'Retrieve a comprehensive list of credit cards with filtering and pagination options.',
    requestSchema: {
      type: 'object',
      properties: {
        page: {
          type: 'integer',
          description: 'Page number for pagination',
          required: false,
          validation: 'Must be a positive integer'
        },
        limit: {
          type: 'integer',
          description: 'Number of cards per page',
          required: false,
          validation: 'Must be between 1 and 100'
        },
        bank_id: {
          type: 'integer',
          description: 'Filter by bank ID',
          required: false
        },
        category_id: {
          type: 'integer',
          description: 'Filter by category ID',
          required: false
        }
      }
    },
    responseSchema: {
      type: 'object',
      properties: {
        cards: {
          type: 'array',
          description: 'List of credit cards',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'Card ID' },
              name: { type: 'string', description: 'Card name' },
              bank_name: { type: 'string', description: 'Bank name' },
              image_url: { type: 'string', description: 'Card image URL' },
              annual_fee: { type: 'string', description: 'Annual fee' },
              joining_fee: { type: 'string', description: 'Joining fee' }
            }
          }
        },
        pagination: {
          type: 'object',
          properties: {
            current_page: { type: 'integer', description: 'Current page number' },
            total_pages: { type: 'integer', description: 'Total number of pages' },
            total_cards: { type: 'integer', description: 'Total number of cards' }
          }
        }
      }
    },
    sampleResponse: {
      "cards": [
        {
          "id": 1,
          "name": "HDFC Regalia Credit Card",
          "bank_name": "HDFC Bank",
          "image_url": "https://example.com/hdfc-regalia.png",
          "annual_fee": "₹2,500",
          "joining_fee": "₹2,500"
        },
        {
          "id": 2,
          "name": "SBI Cashback Credit Card",
          "bank_name": "SBI",
          "image_url": "https://example.com/sbi-cashback.png",
          "annual_fee": "₹999",
          "joining_fee": "₹999"
        }
      ],
      "pagination": {
        "current_page": 1,
        "total_pages": 10,
        "total_cards": 100
      }
    },
    curlExample: `curl --location 'https://api.bankkaro.com/cardgenius/cards?page=1&limit=20' \\
--header 'Authorization: Bearer <jwt>'`
  },
  'card': {
    name: 'Card Detail',
    endpoint: '/cardgenius/cards/{card_slug}',
    methods: ['GET'],
    description: 'Fetch the full specification and meta‑data for a single credit card.',
    category: 'Card APIs',
    purpose: 'Used on product‑detail pages, comparison views, or pre‑filled applications to obtain every field we store for a card.',
    fieldTable: [
      { field: 'card_slug', type: 'string', required: 'Yes', description: 'The SEO‑friendly slug of the card (e.g. sbi-cashback-credit-card).' }
    ],
    sampleResponse: {
      "status": "success",
      "message": "",
      "data": {
        "cards": [],
        "filteredCards": [],
        "tag_slug": false,
        "card_slug": true,
        "tag": {},
        "card_details": {
          "id": 27,
          "name": "SBI Cashback Credit Card",
          "nick_name": "SBI Cashback,Credit Card",
          "product_type": "credit_card",
          "card_type": "VISA,Mastercard",
          "user_rating_count": 413,
          "rating": 4,
          "bank_id": 3,
          "priority": 29,
          "bk_commission": "2000",
          "new_to_credit": true,
          "existing_customer": false,
          "commission_type": "Flat",
          "commission": "1800",
          "commission_percent": "90",
          "sub_agent_commission": "0",
          "seo_card_alias": "sbi-cashback-credit-card",
          "card_alias": "sbi-cashback-credit-card",
          "image": "https://offline-agent-bk.s3.ap-south-1.amazonaws.com/AGB_SBI%20Cashback.png1732257446742",
          "card_bg_image": "https://offline-agent-bk.s3.ap-south-1.amazonaws.com/AGB_Mockup-24.webp1736921642945",
          "card_bg_gradient": "radial-gradient(99.6% 170.48% at 50% -70.48%, #B79DE8 0%, #1B1B1B 100%)",
          "other_images": "",
          "age_criteria": "21-60",
          "age_criteria_comment": "While the bank permits a minimum age of 18 and a maximum age of 70 for eligibility, our experts advice believe that higher chances of approval for the people falling in the age group of 21-60",
          "age_self_emp": "25-60",
          "age_self_emp_comment": "",
          "min_age": 21,
          "max_age": 60,
          "crif": "720",
          "crif_comment": "",
          "income": "20000",
          "income_comment": "",
          "crif_self_emp": "720",
          "crif_self_emp_comment": "",
          "income_salaried": "4",
          "income_self_emp": "4",
          "income_self_emp_comment": "Banks asks for an annual income of Rs 4 LPA for business owners but BankKaro suggests a salary of 4.8 LPA for a better approval rate",
          "joining_fee_text": "999",
          "joining_fee_offset": "No joining fee offset",
          "joining_fee_comment": "While the card is not free for first year with an average spend of just Rs 20,000 per month you can save upto Rs 12,000 which can easily cover your joining fee",
          "annual_fee_text": "999",
          "annual_fee_waiver": "Annual fee can be waived off if you spend Rs 2 lakh annually on your card",
          "annual_fee_comment": "Annual fee can be waived off if you spend Rs 2 lakh annually on your card. Which comes to roughly 17k per month. Also compared to similar cards in category like Axis Flipkart card which gives annual fee waiver at Rs 3.5 Lakh this is a much better deal",
          "annual_saving": "60000",
          "annual_saving_comment": "",
          "reward_conversion_rate": "1 reward point = ₹0.25",
          "redemption_options": "<p>The rewards you earn are auto adjusted within two working days of your next month's statement.&nbsp;</p>",
          "redemption_catalogue": "N/A",
          "exclusion_earnings": "Rent payment, Fuel, Insurance, EMI Transactions, Cash Withdrawals, Jewellery, School & Educational Services, Government related transactions, Wallet transactions - Load money, Fees, GST charges, All Reversals, Gambling, Tolls, Security Broker Services, Charity, Railways, Utility Bill Payments, Balance Transfer, Financial Charges (Late Fee, dishonored cheque charges, transaction charges & etc), Payments made using standard instructions",
          "exclusion_spends": "Rent payment, Fuel, Insurance, EMI Transactions, Cash Withdrawals, Jewellery, School & Educational Services, Government related transactions, Wallet transactions - Load money, Fees, GST charges, All Reversals, Gambling, Tolls, Security Broker Services, Charity, Railways, Utility Bill Payments, Balance Transfer, Financial Charges (Late Fee, dishonored cheque charges, transaction charges & etc), Payments made using standard instructions",
          "network_url": "https://secure.traqkarr.com/click?pid=10&offer_id=1049&sub2=",
          "employment_type": "both",
          "tnc": "The bank may offer a different card variant based on your eligibility. Please carefully read the features of the card offered before submitting your application || A minimum transaction of Rs.100 within 30 days is required to activate the card, otherwise, you won't be eligible for the Rewards",
          "status": true,
          "redirectionFlag": true,
          "createdAt": "2024-02-13T17:09:06.000Z",
          "updatedAt": "2025-03-18T12:08:10.000Z",
          "meta_title": "",
          "meta_description": "",
          "banks": {
            "id": 3,
            "name": "SBI"
          },
          "product_usps": [
            { "header": "5% Cashback ", "description": "on all online spends including Amazon, Flipkart, Myntra, Ajio, Makemytrip", "priority": 1, "tag_id": 0 },
            { "header": "Flat 1%", "description": "cashback on all offline spends", "priority": 2, "tag_id": 0 },
            { "header": "5% Cashback", "description": "on all online spends capped at ₹5,000 per statement cycle", "priority": 1, "tag_id": 2 }
          ],
          "tags": [
            { "id": 2, "name": "Shopping" },
            { "id": 5, "name": "Online Food Ordering" },
            { "id": 6, "name": "Dining" },
            { "id": 7, "name": "Grocery Shopping" }
          ],
          "bank_fee_structure": {
            "id": 24,
            "product_id": 27,
            "forex_markup": "3.5%",
            "forex_markup_comment": "<p>3.5% Forex Markups... (truncated)</p>",
            "apr_fees": "3.5%",
            "apr_fees_comment": "<p>3.5% monthly fee... (truncated)</p>",
            "atm_withdrawal": "2.5%",
            "atm_withdrawal_comment": "<p>For every withdraw money transaction... (truncated)</p>",
            "reward_redemption_fees": "₹99",
            "reward_redemption_fees_comment": "",
            "link": "https://www.sbicard.com/sbi-card-en/assets/docs/pdf/ekit-tncs/cashback-tnc-ekit.pdf",
            "railway_surcharge": "1%",
            "railway_surcharge_comment": "<p>A surcharge of 1% is applied...</p>",
            "rent_payment_fees": "1%",
            "rent_payment_fees_comment": "",
            "check_payment_fees": "₹100",
            "check_payment_fees_comment": "<p>₹100 will be charged for all payments done via Check</p>",
            "cash_payment_fees": "₹250",
            "cash_payment_fees_comment": "<p>₹250 + taxes will be charged for all payments done via Cash</p>",
            "late_payment_annual": "₹0 - ₹500| ₹501 - ₹1000| ...",
            "late_payment_fine": "₹0 | ₹400 | ₹ 750 | ...",
            "late_payment_comment": "<p>An additional Late Payment Charge...</p>",
            "createdAt": "2024-10-28T12:34:26.000Z",
            "updatedAt": "2025-01-16T17:34:49.000Z"
          },
          "product_benefits": [
            { "id": 359, "product_id": 27, "benefit_type": "all", "sub_type": "All Benefits", "html_text": "<ul><li>&nbsp;5% Cashback on all online spends and 1% Cashback on offline spends. Max Cashback per statement cycle is Rs 5000</li><li>Get 1% fuel surcharge waiver upto Rs 100 in a statement cycle. You can get waiver upto Rs 10,000 fuel purchases in a statement cycle.&nbsp;</li></ul>" },
            { "id": 368, "product_id": 27, "benefit_type": "dining", "sub_type": "Dining Benefits", "html_text": "<ul><li>5% Cashback on online dining payments..." }
          ]
        }
      }
    },
    curlExample: `curl --location 'https://bk-api.bankkaro.com/cardgenius/cards/sbi-cashback-credit-card' \\
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
  },
  'v1-eligibility': {
    name: 'Eligibility',
    endpoint: '/v1/cards/eligibility',
    methods: ['POST'],
    description: 'Check if a user can apply for one or more cards.',
    category: 'Card APIs',
    purpose: 'Show only cards the user can apply for before they start an application.',
    requestSchema: {
      type: 'object',
      properties: {
        card_slug: { type: 'string', description: 'The slug of the card to check eligibility for.' },
      }
    },
    sampleResponse: { "card_slug": "sbi-cashback-credit-card", "eligible": true, "criteria": { "income": true, "location": true, "employment": true } },
    curlExample: `curl --location 'https://api.bankkaro.com/v1/cards/eligibility' \\
--header 'Authorization: Bearer <jwt>' \\
--header 'Content-Type: application/json' \\
--data '{"card_slug": "sbi-cashback-credit-card"}'`
  },
  'v1-redemption-planner': {
    name: 'Redemption Planner',
    endpoint: '/v1/redemptions/calculate',
    methods: ['POST'],
    description: 'Calculate the best way to redeem reward points.',
    category: 'Card APIs',
    purpose: 'Help users maximize the value of their accumulated reward points.',
    requestSchema: {
      type: 'object',
      properties: {
        points: { type: 'integer', description: 'The number of points to calculate redemption options for.' },
        preferred_redemption_types: { type: 'array', items: { type: 'string' }, description: 'An array of preferred redemption types (e.g., "cash").' }
      }
    },
    sampleResponse: {
      "best_option": {
        "type": "cash",
        "conversion_rate": 0.25,
        "estimated_value_inr": 8750,
        "redeem_url": "https://example.com/redeem?pts=35000"
      },
      "options": [
        { "type": "cash", "conversion_rate": 0.25, "estimated_value_inr": 8750 },
        { "type": "amazon_voucher", "conversion_rate": 0.20, "estimated_value_inr": 7000 },
        { "type": "air_miles", "conversion_rate": 0.30, "estimated_value_inr": 10500 }
      ]
    },
    curlExample: `curl --location 'https://api.bankkaro.com/v1/cards/redemptions/calculate' \\
--header 'Authorization: Bearer <jwt>' \\
--header 'Content-Type: application/json' \\
--data '{"points": 35000}'`
  },
  'v1-instant-offers': {
    name: 'Instant Offers',
    endpoint: '/v1/cards/{card_slug}/offers',
    methods: ['GET'],
    description: 'Get live issuer–brand promotions for a specific card.',
    category: 'Card APIs',
    purpose: 'Display relevant, real-time offers and deals associated with a card.',
    sampleResponse: { "offers": [ { "merchant": "Swiggy", "headline": "15% off Tue", "valid_till": "2025-12-31" } ] },
    curlExample: `curl --location 'https://api.bankkaro.com/v1/cards/sbi-cashback-credit-card/offers' \\
--header 'Authorization: Bearer <jwt>'`
  },
  'v1-lounge-finder': {
    name: 'Lounge Finder',
    endpoint: '/v1/cards/{card_slug}/lounges',
    methods: ['GET'],
    description: 'Get airport and railway lounge access details for a specific card.',
    category: 'Card APIs',
    purpose: 'Provide users with information about their travel lounge benefits.',
    sampleResponse: { "domestic_lounges_per_quarter": 4, "international_lounges_per_year": 2, "railway_lounges_per_quarter": 4, "lounge_networks": ["Priority Pass"], "terms": "Primary only" },
    curlExample: `curl --location 'https://api.bankkaro.com/v1/cards/sbi-cashback-credit-card/lounges' \\
--header 'Authorization: Bearer <jwt>'`
  },
  'v1-omni': {
    name: 'Omni Endpoint',
    endpoint: '/v1/cards/omni',
    methods: ['POST'],
    description: 'A single endpoint to get nested data from multiple modules.',
    category: 'Card APIs',
    purpose: 'Enable low-development integrations by fetching multiple data types in one API call.',
    sampleResponse: { "banks": [], "categories": [], "cards": [], "recommendations": [], "offers": [], "lounges": [], "redemptions": {} },
    curlExample: `curl --location 'https://api.bankkaro.com/v1/cards/omni' \\
--header 'Authorization: Bearer <jwt>' \\
--header 'Content-Type: application/json' \\
--data '{}'`
  },
  'v1-webhooks': {
    name: 'Webhooks Subscription',
    endpoint: '/v1/webhooks',
    methods: ['POST'],
    description: 'Subscribe to webhook events for real-time notifications.',
    category: 'Card APIs',
    purpose: 'Allow partners to receive real-time updates on events like application status changes.',
    requestSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'The URL to send webhook events to.' },
        events: { type: 'array', items: { type: 'string' }, description: 'An array of event names to subscribe to (e.g., "application.approved").' }
      }
    },
    sampleResponse: { "success": true, "message": "Webhook subscription created successfully.", "webhook_id": "wh_1a2b3c4d5e" },
    curlExample: `curl --location 'https://api.bankkaro.com/v1/webhooks' \\
--header 'Authorization: Bearer <jwt>' \\
--header 'Content-Type: application/json' \\
--data '{"url": "https://partner.com/hook", "events": ["application.approved", "reward.posted"]}'`
  }
};

// Export CardGenius endpoints as cardGeniusApiData
export const cardGeniusApiData = {
  'initial-data': apiData['initial-data'],
  'banks': apiData['banks'],
  'categories': apiData['categories'],
  'cards': apiData['cards'],
  'card': apiData['card'],
  'card-genius-calculator': apiData['v1-card-genius-calculator'],
  'eligibility': apiData['v1-eligibility'],
  'redemption-planner': apiData['v1-redemption-planner'],
  'instant-offers': apiData['v1-instant-offers'],
  'lounge-finder': apiData['v1-lounge-finder'],
  'omni': apiData['v1-omni'],
  'webhooks': apiData['v1-webhooks']
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
    dashboard: true
  }
};
