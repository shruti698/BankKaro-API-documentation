import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://qjqjqjqjqjqjqjqjqjq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcWpxanFqcWpxanFqcWpxanFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2OTM4MzQsImV4cCI6MjA2OTI2OTgzNH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSupabaseMissing() {
  console.log('🔍 Checking Supabase database for missing fields...\n');
  
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
    
    console.log(`📊 Found ${supabaseEndpoints.length} endpoints in Supabase\n`);
    
    // Define all fields to check
    const fieldsToCheck = [
      'id',
      'endpoint',
      'title',
      'description',
      'category',
      'subcategory',
      'rank',
      'method',
      'methods',
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
    
    // Check each field for missing/empty values
    console.log('🔍 FIELD-LEVEL ANALYSIS:');
    console.log('========================');
    
    const fieldAnalysis = {};
    
    fieldsToCheck.forEach(field => {
      fieldAnalysis[field] = {
        total: supabaseEndpoints.length,
        missing: 0,
        empty: 0,
        null: 0,
        populated: 0,
        endpoints: []
      };
      
      supabaseEndpoints.forEach(endpoint => {
        const value = endpoint[field];
        
        if (value === undefined || value === null) {
          fieldAnalysis[field].null++;
          fieldAnalysis[field].endpoints.push(endpoint.endpoint);
        } else if (value === '' || (Array.isArray(value) && value.length === 0)) {
          fieldAnalysis[field].empty++;
          fieldAnalysis[field].endpoints.push(endpoint.endpoint);
        } else {
          fieldAnalysis[field].populated++;
        }
      });
      
      fieldAnalysis[field].missing = fieldAnalysis[field].null + fieldAnalysis[field].empty;
    });
    
    // Display results
    Object.entries(fieldAnalysis).forEach(([field, stats]) => {
      console.log(`\n📋 ${field}:`);
      console.log(`   Total: ${stats.total}`);
      console.log(`   Populated: ${stats.populated} (${((stats.populated/stats.total)*100).toFixed(1)}%)`);
      console.log(`   Missing/Empty: ${stats.missing} (${((stats.missing/stats.total)*100).toFixed(1)}%)`);
      
      if (stats.missing > 0) {
        console.log(`   Missing endpoints:`);
        stats.endpoints.forEach(endpoint => console.log(`     - ${endpoint}`));
      }
    });
    
    // Summary
    console.log('\n📊 SUMMARY:');
    console.log('============');
    
    const criticalFields = ['title', 'description', 'category', 'methods', 'request_schema', 'response_schema'];
    const criticalIssues = [];
    
    criticalFields.forEach(field => {
      const stats = fieldAnalysis[field];
      if (stats.missing > 0) {
        criticalIssues.push(`${field}: ${stats.missing} endpoints missing`);
      }
    });
    
    if (criticalIssues.length > 0) {
      console.log('❌ Critical missing fields:');
      criticalIssues.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log('✅ All critical fields are populated!');
    }
    
    // Check for completely missing endpoints
    console.log('\n🔍 ENDPOINT COMPARISON:');
    console.log('=======================');
    
    // Import apiData to compare
    const { apiData } = await import('./src/data/apiData.js');
    const apiDataArray = Object.values(apiData);
    
    console.log(`📊 apiData.js has ${apiDataArray.length} endpoints`);
    console.log(`📊 Supabase has ${supabaseEndpoints.length} endpoints`);
    
    const apiDataEndpoints = apiDataArray.map(e => e.endpoint);
    const supabaseEndpointsList = supabaseEndpoints.map(e => e.endpoint);
    
    const missingInSupabase = apiDataEndpoints.filter(endpoint => !supabaseEndpointsList.includes(endpoint));
    const extraInSupabase = supabaseEndpointsList.filter(endpoint => !apiDataEndpoints.includes(endpoint));
    
    if (missingInSupabase.length > 0) {
      console.log('\n❌ Missing in Supabase:');
      missingInSupabase.forEach(endpoint => console.log(`   - ${endpoint}`));
    } else {
      console.log('\n✅ All apiData endpoints present in Supabase');
    }
    
    if (extraInSupabase.length > 0) {
      console.log('\n⚠️  Extra in Supabase (not in apiData):');
      extraInSupabase.forEach(endpoint => console.log(`   - ${endpoint}`));
    } else {
      console.log('\n✅ No extra endpoints in Supabase');
    }
    
  } catch (error) {
    console.error('❌ Error during verification:', error);
  }
}

checkSupabaseMissing(); 