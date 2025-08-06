const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const supabaseUrl = 'https://qjqjqjqjqjqjqjqjqjq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcWpxanFqcWpxanFqcWpxanFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2OTM4MzQsImV4cCI6MjA2OTI2OTgzNH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
const supabase = createClient(supabaseUrl, supabaseKey);

// Read and parse apiData.js
const apiDataPath = path.join(process.cwd(), 'src', 'data', 'apiData.js');
const apiDataContent = fs.readFileSync(apiDataPath, 'utf8');

// Extract the export const apiData statement
const exportMatch = apiDataContent.match(/export const apiData = (\{[\s\S]*\});/);
if (!exportMatch) {
  console.error('Could not find export const apiData in apiData.js');
  process.exit(1);
}

// Evaluate the object (safe since it's our own file)
const apiData = eval(exportMatch[1]);

// Convert object to array for easier comparison
const apiDataArray = Object.values(apiData);

async function checkMigrationStatus() {
  console.log('🔍 Checking migration status...\n');
  
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
    console.log(`📊 Found ${apiDataArray.length} endpoints in apiData.js\n`);
    
    // Create maps for comparison
    const supabaseMap = new Map();
    supabaseEndpoints.forEach(endpoint => {
      supabaseMap.set(endpoint.endpoint, endpoint);
    });
    
    const apiDataMap = new Map();
    apiDataArray.forEach(endpoint => {
      apiDataMap.set(endpoint.endpoint, endpoint);
    });
    
    // Check for missing endpoints
    console.log('🔍 MISSING ENDPOINTS:');
    console.log('=====================');
    
    const missingInSupabase = [];
    apiDataArray.forEach(endpoint => {
      if (!supabaseMap.has(endpoint.endpoint)) {
        missingInSupabase.push(endpoint.endpoint);
      }
    });
    
    if (missingInSupabase.length > 0) {
      console.log('❌ Missing in Supabase:');
      missingInSupabase.forEach(endpoint => console.log(`   - ${endpoint}`));
    } else {
      console.log('✅ All apiData endpoints present in Supabase');
    }
    
    // Check field-level issues
    console.log('\n🔍 FIELD-LEVEL ISSUES:');
    console.log('======================');
    
    const fieldIssues = {};
    let totalIssues = 0;
    
    apiDataArray.forEach(sourceEndpoint => {
      const supabaseEndpoint = supabaseMap.get(sourceEndpoint.endpoint);
      
      if (!supabaseEndpoint) return;
      
      // Check key fields - map apiData fields to Supabase fields
      const fieldMappings = [
        { source: 'name', supabase: 'title' },
        { source: 'description', supabase: 'description' },
        { source: 'category', supabase: 'category' },
        { source: 'methods', supabase: 'methods' },
        { source: 'products', supabase: 'products' },
        { source: 'requestSchema', supabase: 'request_schema' },
        { source: 'responseSchema', supabase: 'response_schema' },
        { source: 'curlExample', supabase: 'curl_examples' },
        { source: 'validationNotes', supabase: 'notes' }
      ];
      
      fieldMappings.forEach(mapping => {
        const sourceValue = sourceEndpoint[mapping.source];
        const supabaseValue = supabaseEndpoint[mapping.supabase];
        
        // Handle arrays
        if (mapping.source === 'methods' || mapping.source === 'products') {
          const sourceArray = Array.isArray(sourceValue) ? sourceValue : [];
          const supabaseArray = Array.isArray(supabaseValue) ? supabaseValue : [];
          
          if (JSON.stringify(sourceArray.sort()) !== JSON.stringify(supabaseArray.sort())) {
            if (!fieldIssues[mapping.supabase]) fieldIssues[mapping.supabase] = [];
            fieldIssues[mapping.supabase].push(sourceEndpoint.endpoint);
            totalIssues++;
          }
        }
        // Handle JSON fields
        else if (mapping.source === 'requestSchema' || mapping.source === 'responseSchema' || 
                 mapping.source === 'curlExample' || mapping.source === 'validationNotes') {
          const sourceJson = sourceValue ? JSON.stringify(sourceValue) : null;
          const supabaseJson = supabaseValue ? JSON.stringify(supabaseValue) : null;
          
          if (sourceJson !== supabaseJson) {
            if (!fieldIssues[mapping.supabase]) fieldIssues[mapping.supabase] = [];
            fieldIssues[mapping.supabase].push(sourceEndpoint.endpoint);
            totalIssues++;
          }
        }
        // Handle simple fields
        else {
          if (sourceValue !== supabaseValue) {
            if (!fieldIssues[mapping.supabase]) fieldIssues[mapping.supabase] = [];
            fieldIssues[mapping.supabase].push(sourceEndpoint.endpoint);
            totalIssues++;
          }
        }
      });
    });
    
    if (Object.keys(fieldIssues).length > 0) {
      Object.entries(fieldIssues).forEach(([field, endpoints]) => {
        console.log(`\n❌ ${field} (${endpoints.length} endpoints affected):`);
        endpoints.forEach(endpoint => console.log(`   - ${endpoint}`));
      });
    } else {
      console.log('✅ All fields match perfectly!');
    }
    
    console.log('\n📊 SUMMARY:');
    console.log('============');
    console.log(`Total endpoints: ${apiDataArray.length}`);
    console.log(`Missing endpoints: ${missingInSupabase.length}`);
    console.log(`Total field issues: ${totalIssues}`);
    
    if (missingInSupabase.length === 0 && totalIssues === 0) {
      console.log('\n🎉 MIGRATION COMPLETE! All data matches perfectly!');
    } else {
      console.log('\n⚠️  Migration incomplete. Issues found above.');
    }
    
  } catch (error) {
    console.error('❌ Error during verification:', error);
  }
}

checkMigrationStatus(); 