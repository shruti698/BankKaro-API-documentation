import fs from 'fs';
import path from 'path';

// Read the apiData.js file
const apiDataPath = path.join(process.cwd(), 'src', 'data', 'apiData.js');
const content = fs.readFileSync(apiDataPath, 'utf8');

// Extract the apiData object
const match = content.match(/export const apiData = ({[\s\S]*?});/);
if (!match) {
  console.error('Could not extract apiData from file');
  process.exit(1);
}

// Evaluate the apiData object
const apiData = eval(`(${match[1]})`);

// Generate SQL
console.log('-- Simple Supabase Migration Script');
console.log('-- Generated from apiData.js');
console.log('');

console.log('-- Create table');
console.log(`
CREATE TABLE IF NOT EXISTS api_endpoints (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  description TEXT,
  category TEXT,
  purpose TEXT,
  methods TEXT[],
  status TEXT DEFAULT 'live',
  rank INTEGER DEFAULT 999,
  request_schema JSONB DEFAULT '{}',
  response_schema JSONB DEFAULT '{}',
  sample_request JSONB DEFAULT '{}',
  sample_response JSONB DEFAULT '{}',
  error_responses JSONB DEFAULT '[]',
  curl_examples JSONB DEFAULT '{}',
  validation_notes JSONB DEFAULT '[]',
  field_table JSONB DEFAULT '[]',
  products TEXT[] DEFAULT '{}',
  sample_responses JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_api_endpoints_category ON api_endpoints(category);
CREATE INDEX IF NOT EXISTS idx_api_endpoints_status ON api_endpoints(status);
CREATE INDEX IF NOT EXISTS idx_api_endpoints_rank ON api_endpoints(rank);
`);

console.log('-- Insert basic data (without complex JSON schemas)');
console.log('');

// Generate INSERT statements with only basic data
Object.entries(apiData).forEach(([id, data]) => {
  const methods = Array.isArray(data.methods) ? data.methods : [];
  const products = Array.isArray(data.products) ? data.products : [];
  
  // Handle empty arrays properly
  const methodsArray = methods.length > 0 ? `ARRAY[${methods.map(m => `'${m}'`).join(', ')}]` : 'ARRAY[]::text[]';
  const productsArray = products.length > 0 ? `ARRAY[${products.map(p => `'${p}'`).join(', ')}]` : 'ARRAY[]::text[]';
  
  // Clean text fields
  const name = (data.name || '').replace(/'/g, "''");
  const description = (data.description || '').replace(/'/g, "''");
  const category = (data.category || '').replace(/'/g, "''");
  const purpose = (data.purpose || '').replace(/'/g, "''");

  console.log(`INSERT INTO api_endpoints (
  id, name, endpoint, methods, status, description, category, purpose, products
) VALUES (
  '${id}',
  '${name}',
  '${data.endpoint || ''}',
  ${methodsArray},
  '${data.status || 'live'}',
  '${description}',
  '${category}',
  '${purpose}',
  ${productsArray}
);`);
  console.log('');
});

console.log('-- Migration complete');
console.log('-- Note: Complex JSON schemas can be updated later via the admin panel'); 