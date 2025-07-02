// Mock API Server for Sandbox Testing
// This simulates API responses for the sandbox environment

const mockResponses = {
  // Partner Authentication
  '/sp/api/partner-auth': {
    POST: {
      success: {
        status: 'success',
        message: 'Authentication successful',
        data: {
          auth_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiI5ODc2NTQzMjEwIiwibmFtZSI6IlJhaHVsIFNoYXJtYSIsImlhdCI6MTYzNTY4OTYwMCwiZXhwIjoxNjM1NjkzMjAwfQ.sandbox_token_12345',
          user_data: {
            mobile: '9876543210',
            name: 'Rahul Sharma',
            partner_id: 'PARTNER_001',
            status: 'active'
          }
        }
      },
      error: {
        status: 'error',
        message: 'Invalid OTP or mobile number',
        data: null
      }
    }
  },

  // Lead Details
  '/sp/api/lead-details': {
    GET: {
      success: {
        status: 'success',
        message: 'Lead retrieved successfully',
        data: {
          leadId: '550e8400-e29b-41d4-a716-446655440001',
          customerDetails: {
            name: 'Rahul Sharma',
            email: 'rahul.sharma@example.com',
            phone: '9876543210',
            pan: 'ABCDE1234F',
            aadhar: '123456789012'
          },
          loanDetails: {
            amount: 500000,
            purpose: 'Home Renovation',
            status: 'pending',
            appliedDate: '2024-01-15T10:30:00Z'
          },
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        }
      },
      error: {
        status: 'error',
        message: 'Lead not found',
        data: null
      }
    },
    POST: {
      success: {
        status: 'success',
        message: 'Lead created successfully',
        data: {
          leadId: '550e8400-e29b-41d4-a716-446655440002',
          customerDetails: {
            name: 'Priya Patel',
            email: 'priya.patel@example.com',
            phone: '9876543211',
            pan: 'FGHIJ5678K',
            aadhar: '123456789013'
          },
          loanDetails: {
            amount: 750000,
            purpose: 'Business Expansion',
            status: 'created',
            appliedDate: '2024-01-15T11:00:00Z'
          },
          createdAt: '2024-01-15T11:00:00Z',
          updatedAt: '2024-01-15T11:00:00Z'
        }
      },
      error: {
        status: 'error',
        message: 'Invalid customer details',
        data: null
      }
    }
  },

  // Card Recommendations
  '/card-genius/recommendations': {
    POST: {
      success: {
        status: 'success',
        message: 'Card recommendations generated successfully',
        data: {
          recommendations: [
            {
              cardId: 'card_001',
              name: 'HDFC Regalia Credit Card',
              bank: 'HDFC Bank',
              matchScore: 95,
              features: ['Rewards', 'Travel Insurance', 'Airport Lounge Access'],
              annualFee: '₹2,500',
              creditLimit: '₹500,000',
              reason: 'High credit score and income match this premium card'
            },
            {
              cardId: 'card_003',
              name: 'ICICI Amazon Pay Credit Card',
              bank: 'ICICI Bank',
              matchScore: 88,
              features: ['Amazon Rewards', 'No Annual Fee', 'Contactless'],
              annualFee: '₹0',
              creditLimit: '₹300,000',
              reason: 'Good for online shopping and no annual fee'
            },
            {
              cardId: 'card_002',
              name: 'SBI SimplyCLICK Credit Card',
              bank: 'State Bank of India',
              matchScore: 82,
              features: ['Online Shopping Rewards', 'Fuel Surcharge Waiver'],
              annualFee: '₹999',
              creditLimit: '₹200,000',
              reason: 'Affordable option with good rewards'
            }
          ],
          totalRecommendations: 3,
          generatedAt: '2024-01-15T12:00:00Z'
        }
      },
      error: {
        status: 'error',
        message: 'Unable to generate recommendations',
        data: null
      }
    }
  },

  // Bank List
  '/banks': {
    GET: {
      success: {
        status: 'success',
        message: 'Banks retrieved successfully',
        data: {
          banks: [
            {
              id: 'bank_001',
              name: 'HDFC Bank',
              code: 'HDFC0000001',
              type: 'Private',
              rating: 4.5,
              features: ['Digital Banking', '24/7 Support', 'Wide Network'],
              branches: 5500,
              atms: 15000
            },
            {
              id: 'bank_002',
              name: 'State Bank of India',
              code: 'SBIN0000001',
              type: 'Public',
              rating: 4.2,
              features: ['Government Backed', 'Rural Presence', 'Low Charges'],
              branches: 22000,
              atms: 58000
            },
            {
              id: 'bank_003',
              name: 'ICICI Bank',
              code: 'ICIC0000001',
              type: 'Private',
              rating: 4.3,
              features: ['Digital First', 'Innovative Products', 'Good Customer Service'],
              branches: 5200,
              atms: 15000
            },
            {
              id: 'bank_004',
              name: 'Axis Bank',
              code: 'UTIB0000001',
              type: 'Private',
              rating: 4.1,
              features: ['Corporate Banking', 'Investment Services', 'International Presence'],
              branches: 4500,
              atms: 12000
            }
          ],
          totalBanks: 4,
          retrievedAt: '2024-01-15T12:00:00Z'
        }
      },
      error: {
        status: 'error',
        message: 'Unable to retrieve banks',
        data: null
      }
    }
  },

  // Loan Application
  '/loan/apply': {
    POST: {
      success: {
        status: 'success',
        message: 'Loan application submitted successfully',
        data: {
          applicationId: 'LOAN_APP_001',
          customerId: 'CUST_001',
          loanType: 'Personal Loan',
          amount: 500000,
          tenure: 36,
          interestRate: 12.5,
          emi: 16750,
          status: 'submitted',
          submittedAt: '2024-01-15T13:00:00Z',
          estimatedProcessingTime: '3-5 business days'
        }
      },
      error: {
        status: 'error',
        message: 'Loan application failed',
        data: null
      }
    }
  }
};

// Mock API Server Class
class MockApiServer {
  constructor() {
    this.delay = 1000; // Simulate network delay
  }

  async handleRequest(endpoint, method, requestData = {}) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, this.delay));

    // Find the endpoint in mock responses
    const endpointData = mockResponses[endpoint];
    if (!endpointData) {
      throw new Error(`Endpoint ${endpoint} not found`);
    }

    const methodData = endpointData[method];
    if (!methodData) {
      throw new Error(`Method ${method} not supported for ${endpoint}`);
    }

    // Simulate success/error based on request data
    // For demo purposes, we'll return success for most cases
    // In a real implementation, you might want to add more sophisticated logic
    
    // Check for specific error conditions
    if (endpoint === '/sp/api/partner-auth') {
      const { mobile, otp } = requestData;
      if (mobile === '9999999999' && otp === '000000') {
        return {
          status: 400,
          data: methodData.error
        };
      }
    }

    if (endpoint === '/sp/api/lead-details' && method === 'GET') {
      const { leadId } = requestData;
      if (leadId === 'invalid-lead-id') {
        return {
          status: 404,
          data: methodData.error
        };
      }
    }

    // Return success response
    return {
      status: 200,
      data: methodData.success
    };
  }

  // Method to simulate API call
  async makeRequest(url, options = {}) {
    const { method = 'GET', body } = options;
    
    // Parse the endpoint from the URL
    const urlObj = new URL(url);
    const endpoint = urlObj.pathname;
    
    // Parse request data
    let requestData = {};
    if (body && method !== 'GET') {
      try {
        requestData = typeof body === 'string' ? JSON.parse(body) : body;
      } catch (error) {
        console.warn('Failed to parse request body:', error);
      }
    }

    // Add query parameters for GET requests
    if (method === 'GET') {
      urlObj.searchParams.forEach((value, key) => {
        requestData[key] = value;
      });
    }

    try {
      const response = await this.handleRequest(endpoint, method, requestData);
      
      return {
        ok: response.status >= 200 && response.status < 300,
        status: response.status,
        statusText: response.status >= 200 && response.status < 300 ? 'OK' : 'Error',
        headers: new Map([
          ['content-type', 'application/json'],
          ['access-control-allow-origin', '*'],
          ['access-control-allow-methods', 'GET, POST, PUT, DELETE, OPTIONS'],
          ['access-control-allow-headers', 'Content-Type, Authorization']
        ]),
        json: async () => response.data
      };
    } catch (error) {
      return {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Map([
          ['content-type', 'application/json']
        ]),
        json: async () => ({
          status: 'error',
          message: error.message,
          data: null
        })
      };
    }
  }
}

// Create and export a singleton instance
const mockApiServer = new MockApiServer();

export default mockApiServer; 