import { apiData } from './src/data/apiData.js';
import fs from 'fs';

function generateCompleteSQL() {
  console.log('🔧 Generating complete SQL for 100% migration...\n');
  
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
    
    // Prepare the complete data
    const completeData = {
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
      status_codes: statusCodes,
      headers: baseHeaders,
      additional_examples: additionalExamples
    };
    
    // Convert arrays to proper PostgreSQL array syntax
    const methodsArray = completeData.methods.length > 0 
      ? `ARRAY[${completeData.methods.map(m => `'${escapeSQL(m)}'`).join(', ')}]`
      : `ARRAY[]::text[]`;
    
    const productsArray = completeData.products.length > 0 
      ? `ARRAY[${completeData.products.map(p => `'${escapeSQL(p)}'`).join(', ')}]`
      : `ARRAY[]::text[]`;
    
    const notesArray = completeData.notes.length > 0 
      ? `ARRAY[${completeData.notes.map(n => `'${escapeSQL(n)}'`).join(', ')}]`
      : `ARRAY[]::text[]`;
    
    // Generate SQL UPDATE statement
    const sql = `
-- Update endpoint: ${endpoint.endpoint}
UPDATE api_endpoints 
SET 
  title = '${escapeSQL(completeData.title)}',
  description = '${escapeSQL(completeData.description)}',
  category = '${escapeSQL(completeData.category)}',
  subcategory = '${escapeSQL(completeData.subcategory || '')}',
  rank = ${completeData.rank},
  method = '${escapeSQL(completeData.method)}',
  methods = ${methodsArray},
  products = ${productsArray},
  request_schema = '${JSON.stringify(completeData.request_schema).replace(/'/g, "''")}'::jsonb,
  response_schema = '${JSON.stringify(completeData.response_schema).replace(/'/g, "''")}'::jsonb,
  curl_examples = '${escapeSQL(completeData.curl_examples)}',
  notes = ${notesArray},
  status_codes = '${JSON.stringify(completeData.status_codes).replace(/'/g, "''")}'::jsonb,
  headers = '${JSON.stringify(completeData.headers).replace(/'/g, "''")}'::jsonb,
  additional_examples = '${JSON.stringify(completeData.additional_examples).replace(/'/g, "''")}'::jsonb,
  updated_at = NOW()
WHERE endpoint = '${endpoint.endpoint}';
`;
    
    sqlStatements.push(sql);
  });
  
  // Write to file
  const sqlContent = sqlStatements.join('\n');
  fs.writeFileSync('complete-migration-fixed.sql', sqlContent);
  
  console.log('\n📊 MIGRATION SQL GENERATED!');
  console.log('============================');
  console.log(`✅ Generated ${endpoints.length} UPDATE statements`);
  console.log(`📁 Saved to: complete-migration-fixed.sql`);
  console.log('\n🚀 Next steps:');
  console.log('1. Open Supabase SQL Editor');
  console.log('2. Copy and paste the contents of complete-migration-fixed.sql');
  console.log('3. Run the SQL to complete the migration to 100%!');
}

function escapeSQL(str) {
  if (!str) return '';
  return str.replace(/'/g, "''").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
}

generateCompleteSQL(); 