import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://amvdndglahktcmmtlgtm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtdmRuZGdsYWhrdGNtbXRsZ3RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NTQ4OTIsImV4cCI6MjA2OTUzMDg5Mn0.PuPbuCWDve-YuwHM3fJe_Y62_6kOXCoYKXHV4r1koYM';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('🔍 API Route - Starting request');

    if (req.method === 'GET') {
      // Get all endpoints from Supabase
      const { data: endpoints, error } = await supabase
        .from('api_endpoints')
        .select('*')
        .order('rank', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: 'Database error', details: error.message });
      }

      console.log('🔍 API Route - Found endpoints:', endpoints?.length || 0);
      res.status(200).json(endpoints || []);
    } else if (req.method === 'POST') {
      // Save endpoint to Supabase
      const { endpointKey, data } = req.body;
      
      if (!endpointKey || !data) {
        return res.status(400).json({ error: 'endpointKey and data are required' });
      }

      console.log('🔍 API Route - Saving endpoint:', endpointKey);
      console.log('🔍 API Route - Data received:', Object.keys(data));

      // Prepare the data with ONLY columns that exist in Supabase
      const supabaseData = {
        id: endpointKey,
        name: data.name,
        endpoint: data.endpoint,
        description: data.description,
        category: data.category,
        purpose: data.purpose,
        methods: data.methods,
        status: data.status,
        rank: data.rank,
        request_schema: data.requestSchema,
        response_schema: data.responseSchema,
        sample_request: data.sampleRequest,
        sample_response: data.sampleResponse,
        error_responses: data.errorResponses,
        curl_examples: data.curlExample ? { curl: data.curlExample } : {},
        validation_notes: data.validationNotes,
        field_table: data.fieldTable,
        products: data.products,
        sample_responses: data.sampleResponses
        // Removed non-existent columns:
        // headers: data.headers || {},
        // additional_examples: data.additionalExamples || [],
        // important_notes: data.importantNotes || [],
        // curl_example_staging: data.curlExampleStaging || '',
        // curl_example_production: data.curlExampleProduction || ''
      };

      console.log('🔍 API Route - Mapped data (existing columns only):', Object.keys(supabaseData));

      const { error } = await supabase
        .from('api_endpoints')
        .upsert(supabaseData);

      if (error) {
        console.error('Supabase save error:', error);
        return res.status(500).json({ error: 'Failed to save endpoint', details: error.message });
      }

      console.log('✅ API Route - Endpoint saved successfully');
      res.status(200).json({ success: true, message: 'Endpoint saved successfully' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
} // Force complete rebuild - cache bust
