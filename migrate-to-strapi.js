import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the API data
import { apiData } from './src/data/apiData.js';

async function migrateToStrapi() {
  console.log('🚀 Starting migration to Strapi CMS...');
  console.log(`📊 Found ${Object.keys(apiData).length} API endpoints to migrate`);
  
  try {
    // Convert the API data to Strapi format
    const strapiEntries = Object.entries(apiData).map(([key, api]) => {
      return {
        name: api.name,
        endpoint: api.endpoint,
        method: api.methods ? api.methods.join(', ') : '',
        category: api.category || '',
        description: api.description || '',
        request_schema: api.requestSchema ? JSON.stringify(api.requestSchema) : '',
        response_schema: api.responseSchema ? JSON.stringify(api.responseSchema) : '',
        validation_notes: api.validationNotes ? JSON.stringify(api.validationNotes) : '',
        curl_example: api.curlExample || '',
        curl_example_staging: api.curlExampleStaging || '',
        curl_example_production: api.curlExampleProduction || '',
        sample_request: api.sampleRequest ? JSON.stringify(api.sampleRequest) : '',
        sample_response: api.sampleResponses && api.sampleResponses.length > 0 ? JSON.stringify(api.sampleResponses[0]) : '',
        error_response: api.errorResponses && api.errorResponses.length > 0 ? JSON.stringify(api.errorResponses[0]) : '',
        state: api.status || 'live', // Map status to state
        products: api.products ? api.products.join(', ') : '',
        purpose: api.purpose || '',
        field_table: api.fieldTable ? JSON.stringify(api.fieldTable) : ''
      };
    });

    console.log('✅ Data conversion completed');
    console.log('📝 Sample entry structure:');
    console.log(JSON.stringify(strapiEntries[0], null, 2));

    // Create a JSON file with the converted data for manual import
    const outputFile = 'strapi-import-data.json';
    fs.writeFileSync(outputFile, JSON.stringify(strapiEntries, null, 2));
    
    console.log(`💾 Data saved to ${outputFile} for manual import`);
    console.log('');
    console.log('📋 Next Steps:');
    console.log('1. Go to your Strapi admin panel: http://localhost:1337/admin');
    console.log('2. Navigate to Content Manager > API Endpoints');
    console.log('3. Create new entries manually using the data from strapi-import-data.json');
    console.log('4. Copy and paste the data for each API endpoint');
    console.log('');
    console.log('📊 Migration Summary:');
    console.log(`   - Total endpoints: ${strapiEntries.length}`);
    console.log(`   - Partner APIs: ${strapiEntries.filter(e => e.category === 'Partner APIs').length}`);
    console.log(`   - Card APIs: ${strapiEntries.filter(e => e.category === 'Card APIs').length}`);
    console.log(`   - Data file: ${outputFile}`);

    return strapiEntries;

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  }
}

// Run the migration
migrateToStrapi()
  .then(() => {
    console.log('');
    console.log('🎉 Migration script completed successfully!');
    console.log('');
    console.log('📖 Manual Import Instructions:');
    console.log('1. Open strapi-import-data.json in your text editor');
    console.log('2. Go to Strapi admin: http://localhost:1337/admin');
    console.log('3. Navigate to Content Manager > API Endpoints');
    console.log('4. Click "Create new entry"');
    console.log('5. Copy data from the JSON file for each field');
    console.log('6. Save each entry');
    console.log('');
    console.log('💡 Tip: You can copy multiple entries at once by opening the JSON file');
  })
  .catch(console.error);

export { migrateToStrapi }; 