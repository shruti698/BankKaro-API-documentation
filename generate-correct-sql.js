import { apiData } from './src/data/apiData.js';
import fs from 'fs';

function generateCorrectSQL() {
  console.log('🔧 Generating SQL with correct column names and data types...\n');
  
  const endpoints = Object.values(apiData);
  console.log(`📊 Processing ${endpoints.length} endpoints...\n`);
  
  let sqlStatements = [];
  
  endpoints.forEach((endpoint, index) => {
    console.log(`🔄 Processing: ${endpoint.endpoint}`);
    
    // Generate status codes
    const statusCodes = {
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
    
    // Generate headers
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
    
    // Generate additional examples
    const additionalExamples = [];
    
    // Add sample request example
    if (endpoint.sampleRequest) {
      additionalExamples.push({
        "name": "Sample Request",
        "summary": "Example request body",
        "value": endpoint.sampleRequest
      });
    }
    
    // Add sample response example
    if (endpoint.sampleResponses && endpoint.sampleResponses.length > 0) {
      endpoint.sampleResponses.forEach((response, idx) => {
        additionalExamples.push({
          "name": `Sample Response ${idx + 1}`,
          "summary": "Example response",
          "value": response
        });
      });
    }
    
    // Add error response examples
    if (endpoint.errorResponses && endpoint.errorResponses.length > 0) {
      endpoint.errorResponses.forEach((error, idx) => {
        additionalExamples.push({
          "name": `Error Response ${idx + 1}`,
          "summary": "Example error response",
          "value": error
        });
      });
    }
    
    // Convert arrays to proper PostgreSQL array syntax
    const methodsArray = endpoint.methods && endpoint.methods.length > 0 
      ? `ARRAY[${endpoint.methods.map(m => `'${escapeSQL(m)}'`).join(', ')}]`
      : `ARRAY[]::text[]`;
    
    const productsArray = endpoint.products && endpoint.products.length > 0 
      ? `ARRAY[${endpoint.products.map(p => `'${escapeSQL(p)}'`).join(', ')}]`
      : `ARRAY[]::text[]`;
    
    // Generate SQL UPDATE statement with correct column names and data types
    const sql = `
-- Update endpoint: ${endpoint.endpoint}
UPDATE api_endpoints 
SET 
  name = '${escapeSQL(endpoint.name)}',
  description = '${escapeSQL(endpoint.description)}',
  category = '${escapeSQL(endpoint.category)}',
  purpose = '${escapeSQL(endpoint.purpose || '')}',
  status = '${escapeSQL(endpoint.status || 'live')}',
  rank = ${endpoint.rank || 999},
  methods = ${methodsArray},
  products = ${productsArray},
  request_schema = '${JSON.stringify(endpoint.requestSchema || {}).replace(/'/g, "''")}'::jsonb,
  response_schema = '${JSON.stringify(endpoint.responseSchema || {}).replace(/'/g, "''")}'::jsonb,
  sample_request = '${JSON.stringify(endpoint.sampleRequest || {}).replace(/'/g, "''")}'::jsonb,
  sample_response = '${JSON.stringify(endpoint.sampleResponses || []).replace(/'/g, "''")}'::jsonb,
  error_responses = '${JSON.stringify(endpoint.errorResponses || []).replace(/'/g, "''")}'::jsonb,
  curl_examples = '${JSON.stringify({ curl: endpoint.curlExample || '' }).replace(/'/g, "''")}'::jsonb,
  validation_notes = '${JSON.stringify(endpoint.validationNotes || []).replace(/'/g, "''")}'::jsonb,
  field_table = '${JSON.stringify(endpoint.fieldTable || []).replace(/'/g, "''")}'::jsonb,
  sample_responses = '${JSON.stringify(endpoint.sampleResponses || []).replace(/'/g, "''")}'::jsonb,
  status_codes = '${JSON.stringify(statusCodes).replace(/'/g, "''")}'::jsonb,
  headers = '${JSON.stringify(baseHeaders).replace(/'/g, "''")}'::jsonb,
  additional_examples = '${JSON.stringify(additionalExamples).replace(/'/g, "''")}'::jsonb,
  updated_at = NOW()
WHERE endpoint = '${endpoint.endpoint}';
`;
    
    sqlStatements.push(sql);
  });
  
  // Write to file
  const sqlContent = sqlStatements.join('\n');
  fs.writeFileSync('final-migration.sql', sqlContent);
  
  console.log('\n📊 FINAL MIGRATION SQL GENERATED!');
  console.log('===================================');
  console.log(`✅ Generated ${endpoints.length} UPDATE statements`);
  console.log(`📁 Saved to: final-migration.sql`);
  console.log('\n🚀 Next steps:');
  console.log('1. Open Supabase SQL Editor');
  console.log('2. Copy and paste the contents of final-migration.sql');
  console.log('3. Run the SQL to complete the migration to 100%!');
  console.log('\n📋 Data types used:');
  console.log('- Text fields: name, description, category, purpose, status');
  console.log('- Integer fields: rank');
  console.log('- Text arrays: methods, products');
  console.log('- JSONB fields: request_schema, response_schema, sample_request, sample_response, error_responses, curl_examples, validation_notes, field_table, sample_responses, status_codes, headers, additional_examples');
}

function escapeSQL(str) {
  if (!str) return '';
  return str.replace(/'/g, "''").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
}

generateCorrectSQL(); 