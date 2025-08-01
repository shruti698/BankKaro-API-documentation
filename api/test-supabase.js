import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://amvdndglahktcmmtlgtm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtdmRuZGdsYWhrdGNtbXRsZ3RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NTQ4OTIsImV4cCI6MjA2OTUzMDg5Mn0.PuPbuCWDve-YuwHM3fJe_Y62_6kOXCoYKXHV4r1koYM';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  try {
    console.log('Testing Supabase connection...');
    
    const { data, error } = await supabase
      .from('api_endpoints')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    console.log('Supabase connection successful');
    return res.status(200).json({ 
      success: true, 
      message: 'Supabase connection working',
      data: data 
    });
    
  } catch (error) {
    console.error('Test error:', error);
    return res.status(500).json({ error: error.message });
  }
} 