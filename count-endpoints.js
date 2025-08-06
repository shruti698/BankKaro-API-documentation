import { apiData } from './src/data/apiData.js';

console.log('🔍 Analyzing apiData.js...\n');

const endpoints = Object.values(apiData);
console.log(`📊 Total endpoints found: ${endpoints.length}\n`);

console.log('📋 All endpoints:');
console.log('================');
endpoints.forEach((endpoint, index) => {
  console.log(`${index + 1}. ${endpoint.endpoint} - ${endpoint.name}`);
});

console.log('\n📊 Summary by category:');
console.log('=======================');
const categories = {};
endpoints.forEach(endpoint => {
  const category = endpoint.category || 'Uncategorized';
  if (!categories[category]) {
    categories[category] = [];
  }
  categories[category].push(endpoint.endpoint);
});

Object.entries(categories).forEach(([category, endpointList]) => {
  console.log(`\n${category} (${endpointList.length} endpoints):`);
  endpointList.forEach(endpoint => console.log(`   - ${endpoint}`));
}); 