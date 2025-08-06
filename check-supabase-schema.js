import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://qjqjqjqjqjqjqjqjqjq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcWpxanFqcWpxanFqcWpxanFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2OTM4MzQsImV4cCI6MjA2OTI2OTgzNH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('🔍 Checking Supabase table schema...\n');
  
  try {
    // Try to get one record to see the structure
    const { data, error } = await supabase
      .from('api_endpoints')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error fetching data:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('📋 Actual table columns:');
      console.log('========================');
      const columns = Object.keys(data[0]);
      columns.forEach((column, index) => {
        console.log(`${index + 1}. ${column}`);
      });
      
      console.log('\n📊 Sample data structure:');
      console.log('==========================');
      console.log(JSON.stringify(data[0], null, 2));
    } else {
      console.log('❌ No data found in table');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkSchema(); 