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
    console.log('🔍 NEW API Route - Starting request');

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

      console.log('🔍 NEW API Route - Found endpoints:', endpoints?.length || 0);
      res.status(200).json(endpoints || []);
    } else if (req.method === 'POST') {
      // Save endpoint to Supabase
      const { endpointKey, data } = req.body;
      
      if (!endpointKey || !data) {
        return res.status(400).json({ error: 'endpointKey and data are required' });
      }

      const { error } = await supabase
        .from('api_endpoints')
        .upsert({
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
        });

      if (error) {
        console.error('Supabase save error:', error);
        return res.status(500).json({ error: 'Failed to save endpoint', details: error.message });
      }

      res.status(200).json({ success: true, message: 'Endpoint saved successfully' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
} 