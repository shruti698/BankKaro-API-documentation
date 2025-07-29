import DatabaseManager from '../database.js';

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
    // Initialize database if not already done
    if (!dbManager.db) {
      await dbManager.initialize();
    }

    const endpoints = await dbManager.getAllEndpoints();
    
    res.status(200).json({
      status: 'connected',
      endpointCount: endpoints.length,
      databasePath: dbManager.dbPath
    });
  } catch (error) {
    console.error('Status Error:', error);
    res.status(500).json({ 
      status: 'error',
      error: error.message 
    });
  }
} 