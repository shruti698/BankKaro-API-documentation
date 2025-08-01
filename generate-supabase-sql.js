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
console.log('-- Supabase Migration Script');
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
  request_schema JSONB,
  response_schema JSONB,
  sample_request JSONB,
  sample_response JSONB,
  error_responses JSONB,
  curl_examples JSONB,
  validation_notes JSONB,
  field_table JSONB,
  products TEXT[],
  sample_responses JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_api_endpoints_category ON api_endpoints(category);
CREATE INDEX IF NOT EXISTS idx_api_endpoints_status ON api_endpoints(status);
CREATE INDEX IF NOT EXISTS idx_api_endpoints_rank ON api_endpoints(rank);
`);

console.log('-- Insert data');
console.log('');

// Generate INSERT statements
Object.entries(apiData).forEach(([id, data]) => {
  const methods = Array.isArray(data.methods) ? data.methods : [];
  const products = Array.isArray(data.products) ? data.products : [];
  
  // Safely convert objects to JSON strings and clean special characters
  const cleanJson = (obj) => {
    const jsonStr = JSON.stringify(obj || {});
    // Remove all problematic Unicode characters
    return jsonStr
      .replace(/Γé╣/g, 'Rs.')
      .replace(/ΓÇö/g, '-')
      .replace(/ΓÇ£/g, '"')
      .replace(/ΓÇ¥/g, '"')
      .replace(/ΓÇÖ/g, "'")
      .replace(/ΓÇÜ/g, "'")
      .replace(/[^\x00-\x7F]/g, ''); // Remove all non-ASCII characters
  };
  
  const requestSchema = cleanJson(data.requestSchema);
  const responseSchema = cleanJson(data.responseSchema);
  const sampleRequest = cleanJson(data.sampleRequest);
  const sampleResponse = cleanJson(data.sampleResponse);
  const errorResponses = cleanJson(data.errorResponses);
  // Clean up curl example - remove newlines and escape quotes
  let curlExample = data.curlExample || '';
  if (curlExample) {
    curlExample = curlExample.replace(/\n/g, ' ').replace(/'/g, "''").replace(/"/g, '\\"');
  }
  const curlExamples = JSON.stringify(curlExample ? { curl: curlExample } : {});
  // Clean up validation notes - escape quotes properly
  let validationNotes = data.validationNotes || [];
  if (Array.isArray(validationNotes)) {
    validationNotes = validationNotes.map(note => 
      note.replace(/'/g, "''").replace(/"/g, '\\"')
    );
  }
  const validationNotesJson = cleanJson(validationNotes);
  const fieldTable = cleanJson(data.fieldTable);
  const sampleResponses = cleanJson(data.sampleResponses);

  console.log(`INSERT INTO api_endpoints (
  id, name, endpoint, methods, status, description, category, purpose,
  request_schema, response_schema, sample_request, sample_response,
  error_responses, curl_examples, validation_notes, field_table, products, sample_responses
) VALUES (
  '${id}',
  '${data.name || ''}',
  '${data.endpoint || ''}',
  ARRAY[${methods.map(m => `'${m}'`).join(', ')}],
  '${data.status || 'live'}',
  '${(data.description || '').replace(/'/g, "''")}',
  '${data.category || ''}',
  '${(data.purpose || '').replace(/'/g, "''")}',
  '${requestSchema}'::jsonb,
  '${responseSchema}'::jsonb,
  '${sampleRequest}'::jsonb,
  '${sampleResponse}'::jsonb,
  '${errorResponses}'::jsonb,
  '${curlExamples}'::jsonb,
  '${validationNotesJson}'::jsonb,
  '${fieldTable}'::jsonb,
  ARRAY[${products.map(p => `'${p}'`).join(', ')}],
  '${sampleResponses}'::jsonb
);`);
  console.log('');
});

console.log('-- Migration complete'); 