import { apiData } from './src/data/apiData.js';
import fs from 'fs';

// Convert existing API data to OpenAPI 3.0 specification
function convertToOpenAPI() {
  const openapi = {
    openapi: "3.0.0",
    info: {
      title: "BankKaro Partner API",
      description: "API documentation for BankKaro Partner services including CardGenius, LoanGenius, and EducationGenius",
      version: "1.0.0",
      contact: {
        name: "BankKaro API Support",
        email: "support@bankkaro.com"
      }
    },
    servers: [
      {
        url: "https://uat-partner.bankkaro.com",
        description: "UAT Environment"
      },
      {
        url: "https://prod-partner.bankkaro.com", 
        description: "Production Environment"
      }
    ],
    components: {
      securitySchemes: {
        partnerToken: {
          type: "apiKey",
          in: "header",
          name: "partner-token",
          description: "JWT token obtained from /partner/token endpoint"
        }
      },
      schemas: {},
      responses: {
        UnauthorizedError: {
          description: "Access token is missing or invalid",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "error" },
                  message: { type: "string", example: "Unauthorized access" }
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        partnerToken: []
      }
    ],
    paths: {}
  };

  // Convert each API endpoint
  Object.entries(apiData).forEach(([key, api]) => {
    const path = api.endpoint;
    const method = api.methods[0]?.toLowerCase() || 'get';
    
    if (!openapi.paths[path]) {
      openapi.paths[path] = {};
    }

    const operation = {
      tags: [api.category || "Partner APIs"],
      summary: api.name,
      description: api.description,
      operationId: key,
      parameters: [],
      responses: {
        "200": {
          description: "Successful response",
          content: {
            "application/json": {
              schema: api.responseSchema || {
                type: "object",
                properties: {
                  status: { type: "string" },
                  message: { type: "string" },
                  data: { type: "object" }
                }
              }
            }
          }
        },
        "401": {
          $ref: "#/components/responses/UnauthorizedError"
        }
      }
    };

    // Add request body for POST/PUT methods
    if (['post', 'put', 'patch'].includes(method) && api.requestSchema) {
      operation.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: api.requestSchema,
            examples: api.sampleRequest ? {
              "Sample Request": {
                summary: "Sample request body",
                value: api.sampleRequest
              }
            } : undefined
          }
        }
      };
    }

    // Add parameters for GET methods
    if (method === 'get' && api.requestSchema?.properties) {
      Object.entries(api.requestSchema.properties).forEach(([paramName, paramSchema]) => {
        operation.parameters.push({
          name: paramName,
          in: "query",
          required: paramSchema.required || false,
          schema: {
            type: paramSchema.type || "string"
          },
          description: paramSchema.description || ""
        });
      });
    }

    // Add cURL example as description
    if (api.curlExample) {
      operation.description += `\n\n**cURL Example:**\n\`\`\`bash\n${api.curlExample}\n\`\`\``;
    }

    // Add validation notes
    if (api.validationNotes && api.validationNotes.length > 0) {
      operation.description += `\n\n**Validation Notes:**\n${api.validationNotes.map(note => `- ${note}`).join('\n')}`;
    }

    openapi.paths[path][method] = operation;
  });

  return openapi;
}

// Generate the OpenAPI specification
const openapiSpec = convertToOpenAPI();

// Write to file
fs.writeFileSync('openapi-spec.json', JSON.stringify(openapiSpec, null, 2));
fs.writeFileSync('openapi-spec.yaml', JSON.stringify(openapiSpec, null, 2).replace(/"/g, ''));

console.log('✅ OpenAPI specification generated successfully!');
console.log('📁 Files created:');
console.log('   - openapi-spec.json');
console.log('   - openapi-spec.yaml');
console.log('');
console.log('📊 Migration Summary:');
console.log(`   - Total endpoints migrated: ${Object.keys(apiData).length}`);
console.log(`   - Total paths in OpenAPI: ${Object.keys(openapiSpec.paths).length}`);
console.log('');
console.log('🚀 Next steps:');
console.log('   1. Copy openapi-spec.json to your project');
console.log('   2. Set up Swagger UI to display the spec');
console.log('   3. Deploy and test the documentation'); 