export const apiData = {
  "partner-auth": {
    "name": "Partner Authentication - TEST 5:05:30 PM",
    "endpoint": "/partner/auth",
    "methods": ["POST"],
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
    "curlExample": "curl --location https://uat-partner.bankkaro.com/partner/auth --header Authorization: Bearer {{JWT_TOKEN}} --header x-epoch: <your_epoch_token> --header Content-Type: application/json --data { mobile: 7028333370, otp: 661801 }",
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
    "products": ["Loan Genius"],
    "sampleResponses": [],
    "errorResponse": {
      "status": "error",
      "message": "Authentication failed",
      "data": null,
      "error_code": "AUTH_001"
    },
    "errorResponses": [
      {
        "title": "Invalid Mobile Number",
        "statusCode": 400,
        "response": {
          "status": "error",
          "message": "Invalid mobile number format",
          "data": null,
          "error_code": "AUTH_002"
        }
      },
      {
        "title": "Invalid OTP",
        "statusCode": 400,
        "response": {
          "status": "error",
          "message": "Invalid OTP format",
          "data": null,
          "error_code": "AUTH_003"
        }
      },
      {
        "title": "OTP Expired",
        "statusCode": 400,
        "response": {
          "status": "error",
          "message": "OTP has expired",
          "data": null,
          "error_code": "AUTH_004"
        }
      }
    ]
  }
};
