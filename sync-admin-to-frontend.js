import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'db.json');
const apiDataPath = path.join(__dirname, 'src', 'data', 'apiData.js');

// Read the current db.json (admin data)
let adminData = { endpoints: [] };
if (fs.existsSync(dbPath)) {
  try {
    adminData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (error) {
    console.error('Error reading db.json:', error.message);
    process.exit(1);
  }
}

// Read the current apiData.js file
let apiDataContent = '';
if (fs.existsSync(apiDataPath)) {
  try {
    apiDataContent = fs.readFileSync(apiDataPath, 'utf8');
  } catch (error) {
    console.error('Error reading apiData.js:', error.message);
    process.exit(1);
  }
}

// Extract the existing apiData object structure
const extractApiData = (content) => {
  // Remove export statements
  let processedContent = content.replace('export const apiData =', 'const apiData =');
  processedContent = processedContent.replace('export const cardGeniusApiData =', 'const cardGeniusApiData =');
  processedContent = processedContent.replace('export const projects =', 'const projects =');
  
  // Create a safe evaluation context
  const sandbox = {};
  const script = new Function('exports', 'module', processedContent + '; module.exports = { apiData, cardGeniusApiData, projects };');
  script({}, { exports: {} });
  
  // For safety, manually parse the structure
  const endpoints = {};
  
  // Define the endpoint keys we expect
  const endpointKeys = [
    'partner-auth',
    'lead-details', 
    'application',
    'partner-autoAuth',
    'partner-token',
    'initial-data',
    'banks',
    'categories',
    'cards',
    'card',
    'v1-card-genius-calculator',
    'v1-eligibility',
    'v1-redemption-planner',
    'v1-instant-offers',
    'v1-lounge-finder',
    'v1-omni',
    'v1-webhooks'
  ];

  // Function to extract data from the file content
  function extractEndpointData(content, key) {
    const startMarker = `'${key}': {`;
    const startIndex = content.indexOf(startMarker);
    if (startIndex === -1) return null;
    
    let braceCount = 0;
    let inString = false;
    let escapeNext = false;
    let endIndex = startIndex + startMarker.length - 1;
    
    for (let i = startIndex + startMarker.length - 1; i < content.length; i++) {
      const char = content[i];
      
      if (escapeNext) {
        escapeNext = false;
        continue;
      }
      
      if (char === '\\') {
        escapeNext = true;
        continue;
      }
      
      if (char === '"' || char === "'") {
        inString = !inString;
        continue;
      }
      
      if (!inString) {
        if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIndex = i;
            break;
          }
        }
      }
    }
    
    const endpointContent = content.substring(startIndex, endIndex + 1);
    
    try {
      const endpointData = eval('(' + endpointContent.replace(`'${key}': `, '') + ')');
      return endpointData;
    } catch (error) {
      console.error(`Error parsing endpoint ${key}:`, error.message);
      return null;
    }
  }

  // Extract each endpoint
  endpointKeys.forEach(key => {
    const data = extractEndpointData(content, key);
    if (data) {
      endpoints[key] = data;
    }
  });

  return endpoints;
};

const existingApiData = extractApiData(apiDataContent);

// Function to merge admin changes into apiData structure
const mergeAdminChanges = (existingData, adminEndpoints) => {
  const mergedData = { ...existingData };
  
  adminEndpoints.forEach(adminEndpoint => {
    const key = adminEndpoint.id;
    if (existingData[key]) {
      // Merge admin changes with existing data
      mergedData[key] = {
        ...existingData[key],
        name: adminEndpoint.name,
        endpoint: adminEndpoint.endpoint,
        description: adminEndpoint.description,
        category: adminEndpoint.category,
        purpose: adminEndpoint.purpose,
        methods: adminEndpoint.methods,
        requestSchema: adminEndpoint.requestSchema,
        responseSchema: adminEndpoint.responseSchema,
        sampleRequest: adminEndpoint.sampleRequest,
        sampleResponse: adminEndpoint.sampleResponse,
        sampleResponses: adminEndpoint.sampleResponses,
        errorResponse: adminEndpoint.errorResponse,
        errorResponses: adminEndpoint.errorResponses,
        curlExample: adminEndpoint.curlExample,
        validationNotes: adminEndpoint.validationNotes,
        fieldTable: adminEndpoint.fieldTable
      };
      
      console.log(`✓ Updated endpoint: ${key}`);
    } else {
      console.log(`⚠ Skipped endpoint: ${key} (not found in apiData.js)`);
    }
  });
  
  return mergedData;
};

// Generate the new apiData.js content
const generateApiDataContent = (mergedData) => {
  let content = 'export const apiData = {\n';
  
  Object.entries(mergedData).forEach(([key, data], index) => {
    content += `  '${key}': ${JSON.stringify(data, null, 2)}`;
    if (index < Object.keys(mergedData).length - 1) {
      content += ',';
    }
    content += '\n';
  });
  
  content += '};\n\n';
  
  // Add other exports if they exist in the original file
  if (apiDataContent.includes('export const cardGeniusApiData')) {
    content += 'export const cardGeniusApiData = {\n  // Card Genius specific data\n};\n\n';
  }
  
  if (apiDataContent.includes('export const projects')) {
    content += 'export const projects = {\n  // Project data\n};\n\n';
  }
  
  return content;
};

// Perform the sync
console.log('🔄 Syncing admin changes to frontend...\n');

const mergedData = mergeAdminChanges(existingApiData, adminData.endpoints);
const newApiDataContent = generateApiDataContent(mergedData);

// Write the updated apiData.js
try {
  fs.writeFileSync(apiDataPath, newApiDataContent);
  console.log(`\n✅ Successfully synced ${adminData.endpoints.length} endpoints to apiData.js`);
  console.log(`📁 Updated file: ${apiDataPath}`);
} catch (error) {
  console.error('❌ Error writing apiData.js:', error.message);
  process.exit(1);
}

console.log('\n📋 Summary:');
console.log(`- Total endpoints processed: ${adminData.endpoints.length}`);
console.log(`- Endpoints updated: ${Object.keys(mergedData).length}`);
console.log(`- File updated: src/data/apiData.js`);

console.log('\n💡 Next steps:');
console.log('1. Review the changes in apiData.js');
console.log('2. Test the frontend to ensure everything works');
console.log('3. Commit and push the changes'); 