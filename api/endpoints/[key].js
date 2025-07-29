import DatabaseManager from '../../database.js';
import { apiData } from '../../src/data/apiData.js';

const dbManager = new DatabaseManager();

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
    
    // Initialize database if not already done
    if (!dbManager.db) {
      await dbManager.initialize();
      
      // Import existing data if database is empty
      const endpoints = await dbManager.getAllEndpoints();
      if (endpoints.length === 0) {
        await dbManager.importFromApiData(apiData);
      }
    }

    const endpoint = await dbManager.getEndpoint(key);
    
    if (!endpoint) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }

    res.status(200).json(endpoint);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
} 