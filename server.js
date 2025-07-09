import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// API endpoint to save apiData.js
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

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Local server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Local server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoint: http://localhost:${PORT}/api/save-api-data`);
}); 