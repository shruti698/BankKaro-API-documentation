import DatabaseManager from '../database.js';
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
    // Initialize database if not already done
    if (!dbManager.db) {
      await dbManager.initialize();
      
      // Import existing data if database is empty
      const endpoints = await dbManager.getAllEndpoints();
      if (endpoints.length === 0) {
        await dbManager.importFromApiData(apiData);
      }
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
} 