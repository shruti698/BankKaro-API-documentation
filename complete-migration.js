import { createClient } from '@supabase/supabase-js';
import { apiData } from './src/data/apiData.js';

// Supabase configuration
const supabaseUrl = 'https://qjqjqjqjqjqjqjqjqjq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcWpxanFqcWpxanFqcWpxanFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2OTM4MzQsImV4cCI6MjA2OTI2OTgzNH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function completeMigration() {
  console.log('🚀 Starting complete migration to 100%...\n');
  
  try {
    // Get all endpoints from apiData
    const endpoints = Object.values(apiData);
    console.log(`📊 Processing ${endpoints.length} endpoints...\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const endpoint of endpoints) {
      console.log(`🔄 Processing: ${endpoint.endpoint}`);
      
      try {
        // Prepare the complete data object
        const completeData = {
          endpoint: endpoint.endpoint,
          title: endpoint.name || '',
          description: endpoint.description || '',
          category: endpoint.category || '',
          subcategory: endpoint.subcategory || '',
          rank: endpoint.rank || 999,
          method: endpoint.method || '',
          methods: Array.isArray(endpoint.methods) ? endpoint.methods : [endpoint.methods].filter(Boolean),
          products: Array.isArray(endpoint.products) ? endpoint.products : [],
          request_schema: endpoint.requestSchema || {},
          response_schema: endpoint.responseSchema || {},
          curl_examples: endpoint.curlExample || '',
          notes: Array.isArray(endpoint.validationNotes) ? endpoint.validationNotes : [],
          status_codes: generateStatusCodes(endpoint),
          headers: generateHeaders(endpoint),
          additional_examples: generateAdditionalExamples(endpoint)
        };
        
        // Upsert the data
        const { data, error } = await supabase
          .from('api_endpoints')
          .upsert(completeData, { 
            onConflict: 'endpoint',
            ignoreDuplicates: false 
          });
        
        if (error) {
          console.log(`❌ Error updating ${endpoint.endpoint}:`, error.message);
          errorCount++;
        } else {
          console.log(`✅ Updated ${endpoint.endpoint}`);
          successCount++;
        }
        
      } catch (err) {
        console.log(`❌ Error processing ${endpoint.endpoint}:`, err.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 MIGRATION SUMMARY:');
    console.log('=====================');
    console.log(`✅ Successful updates: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📊 Total processed: ${endpoints.length}`);
    
    if (errorCount === 0) {
      console.log('\n🎉 MIGRATION COMPLETE! All endpoints updated to 100%!');
    } else {
      console.log('\n⚠️  Migration completed with some errors. Please check the logs above.');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Helper function to generate status codes
function generateStatusCodes(endpoint) {
  const defaultStatusCodes = {
    "200": {
      "description": "Success",
      "content": {
        "application/json": {
          "schema": endpoint.responseSchema || {}
        }
      }
    },
    "400": {
      "description": "Bad Request",
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "properties": {
              "status": { "type": "string", "example": "error" },
              "message": { "type": "string", "example": "Invalid request parameters" }
            }
          }
        }
      }
    },
    "401": {
      "description": "Unauthorized",
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "properties": {
              "status": { "type": "string", "example": "error" },
              "message": { "type": "string", "example": "Authentication required" }
            }
          }
        }
      }
    },
    "500": {
      "description": "Internal Server Error",
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "properties": {
              "status": { "type": "string", "example": "error" },
              "message": { "type": "string", "example": "Internal server error" }
            }
          }
        }
      }
    }
  };
  
  return defaultStatusCodes;
}

// Helper function to generate headers
function generateHeaders(endpoint) {
  const baseHeaders = {
    "Content-Type": {
      "description": "Content type",
      "required": true,
      "schema": {
        "type": "string",
        "example": "application/json"
      }
    }
  };
  
  // Add authentication headers for partner APIs
  if (endpoint.endpoint.startsWith('/partner/')) {
    baseHeaders["partner-token"] = {
      "description": "Partner authentication token",
      "required": true,
      "schema": {
        "type": "string",
        "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    };
    
    if (endpoint.endpoint !== '/partner/auth') {
      baseHeaders["Authorization"] = {
        "description": "User authentication token",
        "required": true,
        "schema": {
          "type": "string",
          "example": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
      };
    }
  }
  
  return baseHeaders;
}

// Helper function to generate additional examples
function generateAdditionalExamples(endpoint) {
  const examples = [];
  
  // Add sample request example
  if (endpoint.sampleRequest) {
    examples.push({
      "name": "Sample Request",
      "summary": "Example request body",
      "value": endpoint.sampleRequest
    });
  }
  
  // Add sample response example
  if (endpoint.sampleResponses && endpoint.sampleResponses.length > 0) {
    endpoint.sampleResponses.forEach((response, index) => {
      examples.push({
        "name": `Sample Response ${index + 1}`,
        "summary": "Example response",
        "value": response
      });
    });
  }
  
  // Add error response examples
  if (endpoint.errorResponses && endpoint.errorResponses.length > 0) {
    endpoint.errorResponses.forEach((error, index) => {
      examples.push({
        "name": `Error Response ${index + 1}`,
        "summary": "Example error response",
        "value": error
      });
    });
  }
  
  return examples;
}

completeMigration(); 