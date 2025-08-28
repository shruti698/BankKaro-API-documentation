import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Import the API data dynamically to ensure we get the latest version
import { apiData as importedApiData } from './src/data/apiData.js';

// Log what was imported
console.log('🔧 Server startup: Imported endpoints count:', Object.keys(importedApiData).length);
console.log('🔧 Server startup: First few keys:', Object.keys(importedApiData).slice(0, 5));

// Store the data in a variable that we can update
let apiData = { ...importedApiData };

// Function to reload data from file
const reloadApiData = async () => {
  try {
    // Read the file directly to avoid module caching
    const apiDataPath = path.join(__dirname, 'src', 'data', 'apiData.js');
    const fileContent = fs.readFileSync(apiDataPath, 'utf8');
    
    // Extract the apiData object from the file content
    // This is a simple approach - we'll look for the export const apiData = { ... } pattern
    const match = fileContent.match(/export const apiData = ({[\s\S]*?});/);
    if (match) {
      // Evaluate the object (this is safe since we control the file content)
      const apiDataString = match[1];
      const freshData = eval(`(${apiDataString})`);
      apiData = { ...freshData };
      
      console.log('🔄 Reloaded API data, count:', Object.keys(apiData).length);
      return true;
    } else {
      console.error('❌ Could not find apiData export in file');
      return false;
    }
  } catch (error) {
    console.error('❌ Error reloading API data:', error);
    return false;
  }
};

// API endpoint to serve the API data
app.get('/endpoints', (req, res) => {
  console.log('📡 Server: Serving endpoints, count:', Object.keys(apiData).length);
  console.log('📡 Server: Endpoint keys:', Object.keys(apiData));
  res.json(apiData);
});



// API endpoint to reload data from file
app.get('/reload', async (req, res) => {
  const success = await reloadApiData();
  res.json({ 
    success, 
    message: success ? 'Data reloaded successfully' : 'Failed to reload data',
    endpointCount: Object.keys(apiData).length
  });
});

// API endpoint to update apiData.js
app.post('/api/save-api-data', async (req, res) => {
  try {
    const { updatedEndpoints, mode = 'local' } = req.body;

    if (!updatedEndpoints) {
      return res.status(400).json({ error: 'updatedEndpoints is required' });
    }

    // Generate the new apiData.js content
    let content = 'export const apiData = {\n';
    
    Object.entries(updatedEndpoints).forEach(([key, data], index) => {
      content += `  '${key}': ${JSON.stringify(data, null, 2)}`;
      if (index < Object.keys(updatedEndpoints).length - 1) {
        content += ',';
      }
      content += '\n';
    });
    
    content += '};\n\n';
    
    // Add other exports
    content += 'export const cardGeniusApiData = {\n  // Card Genius specific data\n};\n\n';
    content += 'export const projects = {\n  // Project data\n};\n\n';

    if (mode === 'local') {
      // Write to local file system
      const apiDataPath = path.join(__dirname, 'src', 'data', 'apiData.js');
      fs.writeFileSync(apiDataPath, content);
      
      console.log('✅ Updated apiData.js file:', apiDataPath);
      
      // Reload the data in memory after writing the file
      const reloadSuccess = await reloadApiData();
      console.log('🔄 Data reloaded in memory:', reloadSuccess ? 'SUCCESS' : 'FAILED');
      
      return res.status(200).json({
        success: true,
        message: 'Changes saved to local apiData.js file and reloaded in memory',
        mode: 'local',
        reloaded: reloadSuccess
      });
    } else {
      // Download mode
      return res.status(200).json({
        success: true,
        message: 'Generated updated apiData.js content',
        content: content,
        mode: 'download'
      });
    }
  } catch (error) {
    console.error('Error processing apiData.js:', error);
    return res.status(500).json({ 
      error: 'Failed to process apiData.js',
      details: error.message 
    });
  }
});

// Simple status endpoint
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'running', 
    message: 'Development server is running',
    apiEndpoint: '/api/update-api-data'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Development server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoint: http://localhost:${PORT}/api/save-api-data`);
  console.log(`💡 Use this for local development with file writing capabilities`);
  console.log(`📋 This server only handles API calls - use 'npm run dev' for the frontend`);
}); 