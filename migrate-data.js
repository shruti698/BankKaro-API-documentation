import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the existing apiData.js file
const apiDataPath = path.join(__dirname, 'src', 'data', 'apiData.js');
const dbPath = path.join(__dirname, 'db.json');

// Read the apiData.js file content
const apiDataContent = fs.readFileSync(apiDataPath, 'utf8');

// Extract the apiData object using eval (since it's a valid JS module)
// We'll create a safe evaluation context
let apiDataModule = apiDataContent.replace('export const apiData =', 'const apiData =');
apiDataModule = apiDataModule.replace('export const cardGeniusApiData =', 'const cardGeniusApiData =');
apiDataModule = apiDataModule.replace('export const projects =', 'const projects =');

// Create a safe evaluation context
const sandbox = {};
const script = new Function('exports', 'module', apiDataModule + '; module.exports = { apiData, cardGeniusApiData, projects };');
script({}, { exports: {} });

// For safety, let's manually parse the structure
const endpoints = [];

// Define the endpoint keys we found
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
  
  // Try to evaluate this safely
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
  const data = extractEndpointData(apiDataContent, key);
  if (data) {
    // Determine products based on endpoint category and type
    let products = ['Loan Genius'];
    if (data.category === 'Partner APIs') {
      products = ['Loan Genius', 'Card Genius']; // Partner APIs are platform-wide
    } else if (key.startsWith('v1-') || ['initial-data', 'banks', 'categories', 'cards', 'card'].includes(key)) {
      products = ['Card Genius'];
    }
    // Note: Education Genius endpoints can be added manually in the admin panel
    
    const endpoint = {
      id: key,
      name: data.name || key,
      endpoint: data.endpoint || '',
      methods: data.methods || [],
      description: data.description || '',
      category: data.category || '',
      products: products,
      purpose: data.purpose || '',
      requestSchema: data.requestSchema || {},
      responseSchema: data.responseSchema || {},
      sampleRequest: data.sampleRequest || {},
      sampleResponse: data.sampleResponse || {},
      errorResponse: data.errorResponse || {},
      curlExample: data.curlExample || '',
      validationNotes: data.validationNotes || [],
      fieldTable: data.fieldTable || [],
      get: data.get || null,
      post: data.post || null,
      put: data.put || null,
      delete: data.delete || null
    };
    
    endpoints.push(endpoint);
  }
});

// Read existing db.json to preserve any existing data
let existingDb = { endpoints: [] };
if (fs.existsSync(dbPath)) {
  try {
    existingDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (error) {
    console.error('Error reading existing db.json:', error.message);
  }
}

// Merge with existing data, avoiding duplicates
const existingIds = new Set(existingDb.endpoints.map(e => e.id));
const newEndpoints = endpoints.filter(e => !existingIds.has(e.id));

// Add new endpoints
existingDb.endpoints = [...existingDb.endpoints, ...newEndpoints];

// Write back to db.json
fs.writeFileSync(dbPath, JSON.stringify(existingDb, null, 2));

console.log(`Migration completed!`);
console.log(`- Total endpoints in db.json: ${existingDb.endpoints.length}`);
console.log(`- New endpoints added: ${newEndpoints.length}`);
console.log(`- Existing endpoints preserved: ${existingDb.endpoints.length - newEndpoints.length}`);

// List all endpoints
console.log('\nAll endpoints:');
existingDb.endpoints.forEach(endpoint => {
  const products = endpoint.products || [endpoint.product];
  console.log(`- ${endpoint.id} (${products.join(', ')})`);
}); 