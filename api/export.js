import DatabaseManager from '../database.js';
import { promises as fs } from 'fs';
import path from 'path';

const dbManager = new DatabaseManager();

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize database if not already done
    if (!dbManager.db) {
      await dbManager.initialize();
    }

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
    const apiDataPath = path.join(process.cwd(), 'src', 'data', 'apiData.js');
    await fs.writeFile(apiDataPath, content, 'utf8');
    
    res.status(200).json({ 
      success: true, 
      message: 'Data exported to apiData.js successfully',
      filePath: apiDataPath
    });
  } catch (error) {
    console.error('Export Error:', error);
    res.status(500).json({ error: 'Failed to export data', details: error.message });
  }
} 