import DatabaseManager from './database.js';
import { apiData } from '../src/data/apiData.js';

const dbManager = new DatabaseManager();

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
    
    // Check if database has data, import if empty
    const endpoints = await dbManager.getAllEndpoints();
    console.log('🔍 API Route - Found endpoints:', endpoints.length);
    if (endpoints.length === 0) {
      console.log('🔍 API Route - Importing from apiData');
      await dbManager.importFromApiData(apiData);
    }

    if (req.method === 'GET') {
      // Get all endpoints
      const endpoints = await dbManager.getAllEndpoints();
      res.status(200).json(endpoints);
    } else if (req.method === 'POST') {
      // Save endpoint
      const { endpointKey, data } = req.body;
      
      if (!endpointKey || !data) {
        return res.status(400).json({ error: 'endpointKey and data are required' });
      }

      await dbManager.saveEndpoint(endpointKey, data);
      res.status(200).json({ success: true, message: 'Endpoint saved successfully' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
} // Force Vercel rebuild
