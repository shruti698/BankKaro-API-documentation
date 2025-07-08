import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'db.json');

// Read existing db.json
let db = { endpoints: [] };
if (fs.existsSync(dbPath)) {
  try {
    db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (error) {
    console.error('Error reading db.json:', error.message);
    process.exit(1);
  }
}

// Update each endpoint to use products array
let updatedCount = 0;
db.endpoints = db.endpoints.map(endpoint => {
  // If endpoint already has products array, skip
  if (endpoint.products && Array.isArray(endpoint.products)) {
    return endpoint;
  }

  // Convert single product to products array
  let products = ['Loan Genius']; // default
  
  if (endpoint.product) {
    if (endpoint.category === 'Partner APIs') {
      products = ['Loan Genius', 'Card Genius']; // Partner APIs are platform-wide
    } else if (endpoint.product === 'Card Genius' || 
               endpoint.id.startsWith('v1-') || 
               ['initial-data', 'banks', 'categories', 'cards', 'card'].includes(endpoint.id)) {
      products = ['Card Genius'];
    } else {
      products = [endpoint.product];
    }
  }

  updatedCount++;
  
  // Create new endpoint object with products array
  const updatedEndpoint = {
    ...endpoint,
    products: products
  };

  // Remove the old product field
  delete updatedEndpoint.product;

  return updatedEndpoint;
});

// Write back to db.json
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`Products migration completed!`);
console.log(`- Total endpoints: ${db.endpoints.length}`);
console.log(`- Updated endpoints: ${updatedCount}`);
console.log(`- Already up-to-date: ${db.endpoints.length - updatedCount}`);

// List all endpoints with their products
console.log('\nAll endpoints with products:');
db.endpoints.forEach(endpoint => {
  const products = endpoint.products || [];
  console.log(`- ${endpoint.id}: ${products.join(', ')}`);
}); 