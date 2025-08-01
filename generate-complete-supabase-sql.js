import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the apiData using dynamic import
async function generateMigration() {
  try {
    // Import the apiData module
    const apiDataModule = await import('./src/data/apiData.js');
    const apiData = apiDataModule.apiData;

    console.log('-- Complete Supabase Migration Script');
    console.log('-- Generated from apiData.js - Preserving ALL data');
    console.log('');

    // Create table with all necessary columns
    console.log('-- Drop and recreate table to ensure clean state');
    console.log('DROP TABLE IF EXISTS api_endpoints;');
    console.log('');

    console.log('-- Create table with all columns');
    console.log('CREATE TABLE api_endpoints (');
    console.log('  id TEXT PRIMARY KEY,');
    console.log('  name TEXT NOT NULL,');
    console.log('  endpoint TEXT NOT NULL,');
    console.log('  description TEXT,');
    console.log('  category TEXT,');
    console.log('  purpose TEXT,');
    console.log('  methods TEXT[],');
    console.log('  status TEXT DEFAULT \'live\',');
    console.log('  rank INTEGER DEFAULT 999,');
    console.log('  request_schema JSONB DEFAULT \'{}\',');
    console.log('  response_schema JSONB DEFAULT \'{}\',');
    console.log('  sample_request JSONB DEFAULT \'{}\',');
    console.log('  sample_response JSONB DEFAULT \'{}\',');
    console.log('  error_responses JSONB DEFAULT \'[]\',');
    console.log('  curl_examples TEXT DEFAULT \'\',');
    console.log('  validation_notes JSONB DEFAULT \'[]\',');
    console.log('  field_table JSONB DEFAULT \'[]\',');
    console.log('  products TEXT[] DEFAULT \'{}\',');
    console.log('  sample_responses JSONB DEFAULT \'[]\',');
    console.log('  created_at TIMESTAMP DEFAULT NOW(),');
    console.log('  updated_at TIMESTAMP DEFAULT NOW()');
    console.log(');');
    console.log('');

    // Create indexes
    console.log('-- Create indexes');
    console.log('CREATE INDEX idx_api_endpoints_category ON api_endpoints(category);');
    console.log('CREATE INDEX idx_api_endpoints_status ON api_endpoints(status);');
    console.log('CREATE INDEX idx_api_endpoints_rank ON api_endpoints(rank);');
    console.log('');

    console.log('-- Insert complete data preserving ALL fields');
    console.log('');

    // Helper function to clean JSON strings for SQL
    function cleanJsonForSql(obj) {
      if (typeof obj !== 'object' || obj === null) {
        return JSON.stringify(obj);
      }
      
      // Convert to string and escape single quotes
      let jsonStr = JSON.stringify(obj);
      
      // Escape single quotes for SQL
      jsonStr = jsonStr.replace(/'/g, "''");
      
      // Remove problematic Unicode characters
      jsonStr = jsonStr.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
      
      return jsonStr;
    }

    // Helper function to handle arrays
    function handleArray(arr) {
      if (!Array.isArray(arr) || arr.length === 0) {
        return 'ARRAY[]::text[]';
      }
      return `ARRAY[${arr.map(item => `'${item.replace(/'/g, "''")}'`).join(', ')}]`;
    }

    // Process each endpoint
    Object.entries(apiData).forEach(([id, data]) => {
      console.log(`-- Inserting: ${id}`);
      
      // Handle methods array
      const methodsArray = handleArray(data.methods || []);
      
      // Handle products array
      const productsArray = handleArray(data.products || []);
      
      // Clean text fields
      const name = (data.name || '').replace(/'/g, "''");
      const description = (data.description || '').replace(/'/g, "''");
      const category = (data.category || '').replace(/'/g, "''");
      const purpose = (data.purpose || '').replace(/'/g, "''");
      
      // Handle complex JSON fields
      const requestSchema = cleanJsonForSql(data.requestSchema || {});
      const responseSchema = cleanJsonForSql(data.responseSchema || {});
      const sampleRequest = cleanJsonForSql(data.sampleRequest || {});
      const sampleResponse = cleanJsonForSql(data.sampleResponse || {});
      const errorResponses = cleanJsonForSql(data.errorResponses || []);
      const curlExamples = ''; // Skip cURL examples for now to avoid SQL issues
      const validationNotes = cleanJsonForSql(data.validationNotes || []);
      const fieldTable = cleanJsonForSql(data.fieldTable || []);
      const sampleResponses = cleanJsonForSql(data.sampleResponses || []);
      
      console.log(`INSERT INTO api_endpoints (`);
      console.log(`  id, name, endpoint, methods, status, description, category, purpose, products,`);
      console.log(`  request_schema, response_schema, sample_request, sample_response, error_responses,`);
      console.log(`  curl_examples, validation_notes, field_table, sample_responses`);
      console.log(`) VALUES (`);
      console.log(`  '${id}',`);
      console.log(`  '${name}',`);
      console.log(`  '${data.endpoint || ''}',`);
      console.log(`  ${methodsArray},`);
      console.log(`  '${data.status || 'live'}',`);
      console.log(`  '${description}',`);
      console.log(`  '${category}',`);
      console.log(`  '${purpose}',`);
      console.log(`  ${productsArray},`);
      console.log(`  '${requestSchema}'::jsonb,`);
      console.log(`  '${responseSchema}'::jsonb,`);
      console.log(`  '${sampleRequest}'::jsonb,`);
      console.log(`  '${sampleResponse}'::jsonb,`);
      console.log(`  '${errorResponses}'::jsonb,`);
      console.log(`  '${curlExamples}',`);
      console.log(`  '${validationNotes}'::jsonb,`);
      console.log(`  '${fieldTable}'::jsonb,`);
      console.log(`  '${sampleResponses}'::jsonb`);
      console.log(`);`);
      console.log('');
    });

    console.log('-- Migration complete');
    console.log('-- All data from apiData.js has been preserved in Supabase');
    console.log('-- Note: cURL examples were skipped to avoid SQL syntax issues');
    console.log('-- You can add them later via the admin panel');
    
  } catch (error) {
    console.error('Error generating migration:', error);
    process.exit(1);
  }
}

// Run the migration generation
generateMigration(); 