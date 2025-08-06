import { createClient } from '@supabase/supabase-js';

// Test different Supabase configurations
const configs = [
  {
    name: 'Config 1',
    url: 'https://qjqjqjqjqjqjqjqjqjq.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcWpxanFqcWpxanFqcWpxanFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2OTM4MzQsImV4cCI6MjA2OTI2OTgzNH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'
  },
  {
    name: 'Config 2',
    url: 'https://qjqjqjqjqjqjqjqjqjq.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcWpxanFqcWpxanFqcWpxanFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2OTM4MzQsImV4cCI6MjA2OTI2OTgzNH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'
  }
];

async function testConnection() {
  console.log('🔍 Testing Supabase connections...\n');
  
  for (const config of configs) {
    console.log(`Testing ${config.name}...`);
    
    try {
      const supabase = createClient(config.url, config.key);
      
      // Simple test query
      const { data, error } = await supabase
        .from('api_endpoints')
        .select('count')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${config.name} failed:`, error.message);
      } else {
        console.log(`✅ ${config.name} successful!`);
        console.log(`   Data:`, data);
      }
    } catch (err) {
      console.log(`❌ ${config.name} error:`, err.message);
    }
    
    console.log('');
  }
}

testConnection(); 