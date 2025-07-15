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

// Import the API data
import { apiData } from './src/data/apiData.js';

// API endpoint to serve the API data
app.get('/endpoints', (req, res) => {
  res.json(apiData);
});

// API endpoint to update apiData.js
app.post('/api/save-api-data', (req, res) => {
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
      
      return res.status(200).json({
        success: true,
        message: 'Changes saved to local apiData.js file',
        mode: 'local'
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