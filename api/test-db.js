import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const dbPath = path.join(process.cwd(), 'api', 'data', 'endpoints.json');
    const dir = path.dirname(dbPath);
    
    console.log('🔍 Test DB - Current working directory:', process.cwd());
    console.log('🔍 Test DB - Database path:', dbPath);
    console.log('🔍 Test DB - Directory exists:', fs.existsSync(dir));
    console.log('🔍 Test DB - File exists:', fs.existsSync(dbPath));
    
    // Try to create directory
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
        console.log('🔍 Test DB - Created directory successfully');
      } catch (mkdirError) {
        console.error('🔍 Test DB - Failed to create directory:', mkdirError);
      }
    }
    
    // Try to create file
    if (!fs.existsSync(dbPath)) {
      try {
        const testData = { endpoints: [], test: true, timestamp: new Date().toISOString() };
        fs.writeFileSync(dbPath, JSON.stringify(testData, null, 2));
        console.log('🔍 Test DB - Created file successfully');
      } catch (writeError) {
        console.error('🔍 Test DB - Failed to create file:', writeError);
      }
    }
    
    // Try to read file
    let fileContent = null;
    try {
      if (fs.existsSync(dbPath)) {
        fileContent = fs.readFileSync(dbPath, 'utf8');
        console.log('🔍 Test DB - Read file successfully');
      }
    } catch (readError) {
      console.error('🔍 Test DB - Failed to read file:', readError);
    }
    
    res.status(200).json({
      success: true,
      cwd: process.cwd(),
      dbPath,
      dirExists: fs.existsSync(dir),
      fileExists: fs.existsSync(dbPath),
      fileContent: fileContent ? JSON.parse(fileContent) : null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('🔍 Test DB - Error:', error);
    res.status(500).json({ 
      error: 'Test failed', 
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
} 