import DatabaseManager from './database.js';
import { apiData } from './src/data/apiData.js';

async function testDatabase() {
  console.log('🧪 Testing Database Functionality...\n');
  
  const dbManager = new DatabaseManager();
  
  try {
    // 1. Initialize database
    console.log('1️⃣ Initializing database...');
    await dbManager.initialize();
    console.log('✅ Database initialized\n');
    
    // 2. Import data from apiData.js
    console.log('2️⃣ Importing data from apiData.js...');
    await dbManager.importFromApiData(apiData);
    console.log('✅ Data imported\n');
    
    // 3. Get all endpoints
    console.log('3️⃣ Fetching all endpoints...');
    const endpoints = await dbManager.getAllEndpoints();
    console.log(`✅ Found ${endpoints.length} endpoints\n`);
    
    // 4. Get single endpoint
    console.log('4️⃣ Fetching single endpoint...');
    const firstEndpoint = endpoints[0];
    if (firstEndpoint) {
      const endpointData = await dbManager.getEndpoint(firstEndpoint.id);
      console.log(`✅ Fetched endpoint: ${endpointData.name}`);
      console.log(`   - Methods: ${endpointData.methods.join(', ')}`);
      console.log(`   - Category: ${endpointData.category}`);
      console.log(`   - Products: ${endpointData.products.join(', ')}\n`);
    }
    
    // 5. Export data
    console.log('5️⃣ Exporting data...');
    const exportedData = await dbManager.exportToApiData();
    console.log(`✅ Exported ${Object.keys(exportedData).length} endpoints\n`);
    
    // 6. Test save functionality
    console.log('6️⃣ Testing save functionality...');
    const testData = {
      name: 'Test API',
      endpoint: '/test/api',
      methods: ['GET'],
      status: 'test',
      description: 'Test API endpoint',
      category: 'Test APIs',
      purpose: 'Testing database functionality',
      rank: 999,
      requestSchema: {},
      responseSchema: {},
      sampleRequest: {},
      sampleResponses: [],
      errorResponses: [],
      curlExample: 'curl -X GET /test/api',
      validationNotes: ['This is a test'],
      fieldTable: [],
      products: ['Test Product'],
      importantNotes: [],
      headers: [],
      additionalExamples: []
    };
    
    await dbManager.saveEndpoint('test-api', testData);
    console.log('✅ Test endpoint saved\n');
    
    // 7. Verify test endpoint
    console.log('7️⃣ Verifying test endpoint...');
    const savedEndpoint = await dbManager.getEndpoint('test-api');
    console.log(`✅ Test endpoint verified: ${savedEndpoint.name}\n`);
    
    console.log('🎉 All tests passed! Database is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    dbManager.close();
  }
}

// Run the test
testDatabase(); 