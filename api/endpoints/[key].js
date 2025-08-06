import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://amvdndglahktcmmtlgtm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtdmRuZGdsYWhrdGNtbXRsZ3RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NTQ4OTIsImV4cCI6MjA2OTUzMDg5Mn0.PuPbuCWDve-YuwHM3fJe_Y62_6kOXCoYKXHV4r1koYM';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { key } = req.query;
    
    // Decode the URL-encoded key
    const decodedKey = decodeURIComponent(key);
    console.log('API Route - Looking for endpoint with key:', decodedKey);
    
    // Get single endpoint from Supabase
    const { data: endpoint, error } = await supabase
      .from('api_endpoints')
      .select('*')
      .eq('id', decodedKey)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Database error', details: error.message });
    }

    if (!endpoint) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }

    // Convert Supabase format to apiData format
    const apiDataFormat = {
      name: endpoint.name,
      endpoint: endpoint.endpoint,
      methods: Array.isArray(endpoint.methods) ? endpoint.methods : [],
      status: endpoint.status || 'live',
      description: endpoint.description,
      category: endpoint.category,
      purpose: endpoint.purpose,
      rank: endpoint.rank || 999,
      // Map all the fields properly
      requestSchema: endpoint.request_schema,
      responseSchema: endpoint.response_schema,
      sampleRequest: endpoint.sample_request,
      sampleResponse: endpoint.sample_response,
      sampleResponses: endpoint.sample_responses,
      errorResponses: endpoint.error_responses,
      curlExample: endpoint.curl_examples?.curl || '',
      validationNotes: endpoint.validation_notes,
      fieldTable: endpoint.field_table,
      products: endpoint.products
    };

    console.log('API Route - Returning endpoint in apiData format:', Object.keys(apiDataFormat));
    res.status(200).json(apiDataFormat);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
} // Force Vercel rebuild - API route deployment fix 