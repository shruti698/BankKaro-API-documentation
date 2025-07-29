import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import DatabaseManager from './database.js';
import { apiData } from './src/data/apiData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initialize database
const dbManager = new DatabaseManager();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// Initialize database on startup
let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      console.log('🔄 Initializing database...');
      await dbManager.initialize();
      
      // Import existing data if database is empty
      const endpoints = await dbManager.getAllEndpoints();
      if (endpoints.length === 0) {
        console.log('🔄 Database is empty, importing from apiData.js...');
        await dbManager.importFromApiData(apiData);
        console.log('✅ Data imported successfully');
      } else {
        console.log(`✅ Database already has ${endpoints.length} endpoints`);
      }
      dbInitialized = true;
    } catch (error) {
      console.error('❌ Database initialization error:', error);
      // Continue without database for now
    }
  }
  next();
});



// Get all endpoints for admin panel
app.get('/api/endpoints', async (req, res) => {
  try {
    if (!dbManager.db) {
      console.log('❌ Database not initialized, returning static data');
      // Return static data as fallback
      const staticEndpoints = Object.entries(apiData).map(([key, data]) => ({
        id: key,
        name: data.name,
        endpoint: data.endpoint,
        description: data.description,
        category: data.category,
        products: data.products || [],
        methods: data.methods || [],
        purpose: data.purpose || '',
        status: data.status || 'live',
        rank: data.rank || 999
      }));
      return res.json(staticEndpoints);
    }
    
    const endpoints = await dbManager.getAllEndpoints();
    console.log(`✅ Returning ${endpoints.length} endpoints from database`);
    res.json(endpoints);
  } catch (error) {
    console.error('Error fetching endpoints:', error);
    res.status(500).json({ error: 'Failed to fetch endpoints', details: error.message });
  }
});

// Get single endpoint with full data
app.get('/api/endpoints/:endpointKey', async (req, res) => {
  try {
    const { endpointKey } = req.params;
    
    if (!dbManager.db) {
      console.log('❌ Database not initialized, returning static data for:', endpointKey);
      // Return static data as fallback
      const staticEndpoint = apiData[endpointKey];
      if (!staticEndpoint) {
        return res.status(404).json({ error: 'Endpoint not found' });
      }
      return res.json(staticEndpoint);
    }
    
    const endpoint = await dbManager.getEndpoint(endpointKey);
    
    if (!endpoint) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
    
    console.log(`✅ Returning endpoint data for: ${endpointKey}`);
    res.json(endpoint);
  } catch (error) {
    console.error('Error fetching endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch endpoint', details: error.message });
  }
});

// Save endpoint to database
app.post('/api/endpoints', async (req, res) => {
  console.log('🔔 POST /api/endpoints received');
  try {
    const { endpointKey, data } = req.body;
    
    console.log('📝 Saving endpoint:', endpointKey);
    console.log('📝 Data received:', JSON.stringify(data, null, 2));
    
    if (!endpointKey || !data) {
      return res.status(400).json({ error: 'endpointKey and data are required' });
    }

    // Save to database
    await dbManager.saveEndpoint(endpointKey, data);
    
    res.json({ success: true, message: 'Endpoint saved successfully' });
  } catch (error) {
    console.error('Error saving endpoint:', error);
    res.status(500).json({ error: 'Failed to save endpoint', details: error.message });
  }
});

// Export database to apiData.js format
app.post('/api/export', async (req, res) => {
  try {
    const apiData = await dbManager.exportToApiData();
    
    // Generate the apiData.js content
    let content = 'export const apiData = {\n';
    
    Object.entries(apiData).forEach(([key, data], index) => {
      content += `  '${key}': ${JSON.stringify(data, null, 2)}`;
      if (index < Object.keys(apiData).length - 1) {
        content += ',';
      }
      content += '\n';
    });
    
    content += '};\n\n';
    content += 'export const cardGeniusApiData = {\n  // Card Genius specific data\n};\n\n';
    content += 'export const projects = {\n  // Project data\n};\n\n';

    // Write to file
    const apiDataPath = path.join(__dirname, 'src', 'data', 'apiData.js');
    await fs.writeFile(apiDataPath, content, 'utf8');
    
    console.log('✅ Exported to apiData.js:', apiDataPath);
    
    res.json({ 
      success: true, 
      message: 'Data exported to apiData.js successfully',
      filePath: apiDataPath
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Import data from apiData.js to database
app.post('/api/import', async (req, res) => {
  try {
    await dbManager.importFromApiData(apiData);
    res.json({ success: true, message: 'Data imported successfully' });
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).json({ error: 'Failed to import data' });
  }
});

// Legacy endpoint for backward compatibility
app.post('/api/save-api-data', async (req, res) => {
  try {
    const { content, filename } = req.body;
    
    if (!content || !filename) {
      return res.status(400).json({ error: 'Content and filename are required' });
    }
    
    const filePath = path.join(__dirname, filename);
    
    // Ensure the directory exists
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    
    // Write the file
    await fs.writeFile(filePath, content, 'utf8');
    
    console.log(`✅ File saved: ${filePath}`);
    res.json({ success: true, message: 'File saved successfully' });
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({ error: 'Failed to save file' });
  }
});

// Database status endpoint
app.get('/api/db-status', async (req, res) => {
  try {
    const endpoints = await dbManager.getAllEndpoints();
    res.json({ 
      status: 'connected',
      endpointCount: endpoints.length,
      databasePath: dbManager.db ? 'api_docs.db' : 'not connected'
    });
  } catch (error) {
    res.json({ 
      status: 'error',
      error: error.message
    });
  }
});

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Local server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Local server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoints:`);
  console.log(`   GET  /api/endpoints - Get all endpoints`);
  console.log(`   GET  /api/endpoints/:key - Get single endpoint`);
  console.log(`   POST /api/endpoints - Save endpoint`);
  console.log(`   POST /api/export - Export to apiData.js`);
  console.log(`   POST /api/import - Import from apiData.js`);
  console.log(`   GET  /api/db-status - Database status`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔄 Shutting down server...');
  dbManager.close();
  process.exit(0);
}); 