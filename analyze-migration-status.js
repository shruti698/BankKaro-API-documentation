import { apiData } from './src/data/apiData.js';

async function analyzeMigrationStatus() {
  console.log('🔍 Analyzing migration status from apiData.js...\n');
  
  const endpoints = Object.values(apiData);
  console.log(`📊 Total endpoints in apiData.js: ${endpoints.length}\n`);
  
  // Define the expected Supabase schema fields
  const supabaseFields = [
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
  
  // Map apiData fields to Supabase fields
  const fieldMappings = {
    'name': 'title',
    'description': 'description',
    'category': 'category',
    'methods': 'methods',
    'products': 'products',
    'requestSchema': 'request_schema',
    'responseSchema': 'response_schema',
    'curlExample': 'curl_examples',
    'validationNotes': 'notes'
  };
  
  console.log('📋 FIELD MAPPING ANALYSIS:');
  console.log('==========================');
  
  // Analyze each endpoint
  const fieldAnalysis = {};
  supabaseFields.forEach(field => {
    fieldAnalysis[field] = {
      total: endpoints.length,
      populated: 0,
      missing: 0,
      endpoints: []
    };
  });
  
  endpoints.forEach(endpoint => {
    // Check each field mapping
    Object.entries(fieldMappings).forEach(([apiDataField, supabaseField]) => {
      const value = endpoint[apiDataField];
      
      if (value && value !== '' && !(Array.isArray(value) && value.length === 0)) {
        fieldAnalysis[supabaseField].populated++;
      } else {
        fieldAnalysis[supabaseField].missing++;
        fieldAnalysis[supabaseField].endpoints.push(endpoint.endpoint);
      }
    });
    
    // Check endpoint field (always present)
    fieldAnalysis['endpoint'].populated++;
    
    // Check id field (should be generated)
    fieldAnalysis['id'].populated++;
    
    // Check timestamp fields (auto-generated)
    fieldAnalysis['created_at'].populated++;
    fieldAnalysis['updated_at'].populated++;
  });
  
  // Display results
  console.log('\n📊 FIELD COMPLETENESS:');
  console.log('=======================');
  
  Object.entries(fieldAnalysis).forEach(([field, stats]) => {
    const percentage = ((stats.populated / stats.total) * 100).toFixed(1);
    console.log(`${field}: ${stats.populated}/${stats.total} (${percentage}%)`);
    
    if (stats.missing > 0) {
      console.log(`   Missing in: ${stats.endpoints.slice(0, 3).join(', ')}${stats.endpoints.length > 3 ? '...' : ''}`);
    }
  });
  
  // Identify critical missing fields
  console.log('\n❌ CRITICAL MISSING FIELDS:');
  console.log('============================');
  
  const criticalFields = ['title', 'description', 'category', 'methods', 'request_schema', 'response_schema'];
  let hasCriticalIssues = false;
  
  criticalFields.forEach(field => {
    const stats = fieldAnalysis[field];
    if (stats.missing > 0) {
      hasCriticalIssues = true;
      console.log(`${field}: ${stats.missing} endpoints missing`);
      console.log(`   Affected: ${stats.endpoints.join(', ')}`);
    }
  });
  
  if (!hasCriticalIssues) {
    console.log('✅ All critical fields are populated in apiData.js');
  }
  
  // Summary
  console.log('\n📊 MIGRATION SUMMARY:');
  console.log('=====================');
  console.log(`Total endpoints to migrate: ${endpoints.length}`);
  
  const totalFields = supabaseFields.length;
  const totalFieldInstances = totalFields * endpoints.length;
  const populatedFields = Object.values(fieldAnalysis).reduce((sum, stats) => sum + stats.populated, 0);
  const missingFields = totalFieldInstances - populatedFields;
  
  console.log(`Total field instances: ${totalFieldInstances}`);
  console.log(`Populated fields: ${populatedFields}`);
  console.log(`Missing fields: ${missingFields}`);
  console.log(`Completion rate: ${((populatedFields / totalFieldInstances) * 100).toFixed(1)}%`);
  
  if (hasCriticalIssues) {
    console.log('\n⚠️  MIGRATION INCOMPLETE: Critical fields missing');
  } else {
    console.log('\n✅ MIGRATION READY: All critical fields present');
  }
}

analyzeMigrationStatus(); 