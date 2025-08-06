import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Supabase configuration
const supabaseUrl = 'https://qjqjqjqjqjqjqjqjqjq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcWpxanFqcWpxanFqcWpxanFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2OTM4MzQsImV4cCI6MjA2OTI2OTgzNH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
const supabase = createClient(supabaseUrl, supabaseKey);

// Import apiData
const apiDataPath = path.join(process.cwd(), 'src', 'data', 'apiData.js');
const apiDataContent = fs.readFileSync(apiDataPath, 'utf8');

// Extract the export default statement
const exportMatch = apiDataContent.match(/export default\s*(\[[\s\S]*\]);/);
if (!exportMatch) {
  console.error('Could not find export default in apiData.js');
  process.exit(1);
}

// Evaluate the array (safe since it's our own file)
const apiData = eval(exportMatch[1]);

// Define all expected fields
const expectedFields = [
  'id',
  'endpoint',
  'method',
  'methods',
  'title',
  'description',
  'category',
  'subcategory',
  'rank',
  'products',
  'request_schema',
  'response_schema',
  'curl_examples',
  'notes',
  'status_codes',
  'headers',
  'additional_examples',
  'created_at',
  'updated_at'
];

async function verifyCompleteMigration() {
  console.log('🔍 Starting comprehensive migration verification...\n');
  
  try {
    // Fetch all endpoints from Supabase
    const { data: supabaseEndpoints, error } = await supabase
      .from('api_endpoints')
      .select('*')
      .order('rank', { ascending: true });
    
    if (error) {
      console.error('❌ Error fetching from Supabase:', error);
      return;
    }
    
    console.log(`📊 Found ${supabaseEndpoints.length} endpoints in Supabase`);
    console.log(`📊 Found ${apiData.length} endpoints in apiData.js\n`);
    
    // Create a map for easy lookup
    const supabaseMap = new Map();
    supabaseEndpoints.forEach(endpoint => {
      supabaseMap.set(endpoint.endpoint, endpoint);
    });
    
    const apiDataMap = new Map();
    apiData.forEach(endpoint => {
      apiDataMap.set(endpoint.endpoint, endpoint);
    });
    
    // Check for missing endpoints
    console.log('🔍 CHECKING FOR MISSING ENDPOINTS:');
    console.log('=====================================');
    
    const missingInSupabase = [];
    const missingInApiData = [];
    
    apiData.forEach(endpoint => {
      if (!supabaseMap.has(endpoint.endpoint)) {
        missingInSupabase.push(endpoint.endpoint);
      }
    });
    
    supabaseEndpoints.forEach(endpoint => {
      if (!apiDataMap.has(endpoint.endpoint)) {
        missingInApiData.push(endpoint.endpoint);
      }
    });
    
    if (missingInSupabase.length > 0) {
      console.log('❌ Missing in Supabase:');
      missingInSupabase.forEach(endpoint => console.log(`   - ${endpoint}`));
    } else {
      console.log('✅ All apiData endpoints present in Supabase');
    }
    
    if (missingInApiData.length > 0) {
      console.log('❌ Extra in Supabase (not in apiData):');
      missingInApiData.forEach(endpoint => console.log(`   - ${endpoint}`));
    } else {
      console.log('✅ No extra endpoints in Supabase');
    }
    
    console.log('\n🔍 CHECKING INDIVIDUAL ENDPOINT FIELDS:');
    console.log('=========================================');
    
    let totalIssues = 0;
    const fieldIssues = {};
    
    // Check each endpoint's fields
    apiData.forEach(sourceEndpoint => {
      const supabaseEndpoint = supabaseMap.get(sourceEndpoint.endpoint);
      
      if (!supabaseEndpoint) {
        console.log(`❌ ${sourceEndpoint.endpoint}: Missing entirely from Supabase`);
        totalIssues++;
        return;
      }
      
      const endpointIssues = [];
      
      // Check each field
      expectedFields.forEach(field => {
        if (field === 'created_at' || field === 'updated_at') {
          // Skip timestamp fields as they're auto-generated
          return;
        }
        
        const sourceValue = sourceEndpoint[field];
        const supabaseValue = supabaseEndpoint[field];
        
        // Handle different data types
        if (field === 'methods') {
          // methods should be an array
          const sourceMethods = Array.isArray(sourceValue) ? sourceValue : [sourceValue];
          const supabaseMethods = Array.isArray(supabaseValue) ? supabaseValue : 
                                 (typeof supabaseValue === 'string' ? [supabaseValue] : []);
          
          if (JSON.stringify(sourceMethods.sort()) !== JSON.stringify(supabaseMethods.sort())) {
            endpointIssues.push({
              field,
              type: 'methods_array_mismatch',
              source: sourceMethods,
              supabase: supabaseMethods
            });
          }
        } else if (field === 'products') {
          // products should be an array
          const sourceProducts = Array.isArray(sourceValue) ? sourceValue : [];
          const supabaseProducts = Array.isArray(supabaseValue) ? supabaseValue : [];
          
          if (JSON.stringify(sourceProducts.sort()) !== JSON.stringify(supabaseProducts.sort())) {
            endpointIssues.push({
              field,
              type: 'products_array_mismatch',
              source: sourceProducts,
              supabase: supabaseProducts
            });
          }
        } else if (field === 'request_schema' || field === 'response_schema' || 
                   field === 'curl_examples' || field === 'notes' || 
                   field === 'status_codes' || field === 'headers' || 
                   field === 'additional_examples') {
          // JSON fields
          const sourceJson = sourceValue ? JSON.stringify(sourceValue) : null;
          const supabaseJson = supabaseValue ? JSON.stringify(supabaseValue) : null;
          
          if (sourceJson !== supabaseJson) {
            endpointIssues.push({
              field,
              type: 'json_mismatch',
              source: sourceValue,
              supabase: supabaseValue
            });
          }
        } else {
          // Simple fields
          if (sourceValue !== supabaseValue) {
            endpointIssues.push({
              field,
              type: 'value_mismatch',
              source: sourceValue,
              supabase: supabaseValue
            });
          }
        }
      });
      
      if (endpointIssues.length > 0) {
        console.log(`\n❌ ${sourceEndpoint.endpoint}:`);
        endpointIssues.forEach(issue => {
          console.log(`   - ${issue.field} (${issue.type}):`);
          console.log(`     Source: ${JSON.stringify(issue.source)}`);
          console.log(`     Supabase: ${JSON.stringify(issue.supabase)}`);
          
          // Track field-level issues
          if (!fieldIssues[issue.field]) {
            fieldIssues[issue.field] = [];
          }
          fieldIssues[issue.field].push(sourceEndpoint.endpoint);
        });
        totalIssues += endpointIssues.length;
      } else {
        console.log(`✅ ${sourceEndpoint.endpoint}: All fields match`);
      }
    });
    
    console.log('\n📊 SUMMARY:');
    console.log('============');
    console.log(`Total endpoints checked: ${apiData.length}`);
    console.log(`Total field issues found: ${totalIssues}`);
    
    if (Object.keys(fieldIssues).length > 0) {
      console.log('\n🔍 FIELD-LEVEL ISSUES:');
      Object.entries(fieldIssues).forEach(([field, endpoints]) => {
        console.log(`\n${field} (${endpoints.length} endpoints affected):`);
        endpoints.forEach(endpoint => console.log(`   - ${endpoint}`));
      });
    }
    
    if (totalIssues === 0) {
      console.log('\n🎉 MIGRATION COMPLETE! All endpoints and fields match perfectly!');
    } else {
      console.log('\n⚠️  Migration incomplete. Please address the issues above.');
    }
    
  } catch (error) {
    console.error('❌ Error during verification:', error);
  }
}

verifyCompleteMigration(); 