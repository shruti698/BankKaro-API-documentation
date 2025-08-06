async function checkProductionData() {
  console.log('🔍 Checking production API data...\n');
  
  try {
    // Check the production API endpoints
    const productionUrl = 'https://bankkaro-api-documentation.vercel.app';
    
    console.log('📊 Testing production endpoints...\n');
    
    // Test 1: Get all endpoints
    console.log('1. Testing /api/endpoints...');
    try {
      const response = await fetch(`${productionUrl}/api/endpoints`);
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Success! Found ${data.length} endpoints`);
        
        // Check field completeness
        const fields = ['id', 'endpoint', 'title', 'description', 'category', 'methods', 'products', 'request_schema', 'response_schema', 'curl_examples', 'notes'];
        const fieldAnalysis = {};
        
        fields.forEach(field => {
          fieldAnalysis[field] = {
            total: data.length,
            populated: 0,
            missing: 0
          };
          
          data.forEach(endpoint => {
            const value = endpoint[field];
            if (value && value !== '' && !(Array.isArray(value) && value.length === 0)) {
              fieldAnalysis[field].populated++;
            } else {
              fieldAnalysis[field].missing++;
            }
          });
        });
        
        console.log('\n📋 Field Analysis:');
        Object.entries(fieldAnalysis).forEach(([field, stats]) => {
          console.log(`   ${field}: ${stats.populated}/${stats.total} populated (${((stats.populated/stats.total)*100).toFixed(1)}%)`);
        });
        
        // Show missing fields
        console.log('\n❌ Missing/Empty Fields:');
        Object.entries(fieldAnalysis).forEach(([field, stats]) => {
          if (stats.missing > 0) {
            console.log(`   ${field}: ${stats.missing} endpoints missing`);
          }
        });
        
      } else {
        console.log(`❌ Failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('\n2. Testing individual endpoint...');
    try {
      const response = await fetch(`${productionUrl}/api/endpoints/partner-auth`);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Success! Individual endpoint data:');
        console.log(`   Endpoint: ${data.endpoint}`);
        console.log(`   Title: ${data.title}`);
        console.log(`   Category: ${data.category}`);
        console.log(`   Methods: ${JSON.stringify(data.methods)}`);
      } else {
        console.log(`❌ Failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error during check:', error);
  }
}

checkProductionData(); 