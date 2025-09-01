import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { updatedEndpoints, mode = 'download' } = req.body;

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
      // Try to write to local file system (for development)
      try {
        const apiDataPath = path.join(process.cwd(), 'src', 'data', 'apiData.js');
        fs.writeFileSync(apiDataPath, content);
        return res.status(200).json({
          success: true,
          message: 'Changes saved to local apiData.js file',
          mode: 'local'
        });
      } catch (writeError) {
        // If local write fails, fall back to download mode
        console.warn('Local write failed, falling back to download mode:', writeError.message);
        return res.status(200).json({
          success: true,
          message: 'Generated updated apiData.js content (download mode)',
          content: content,
          mode: 'download'
        });
      }
    } else if (mode === 'production') {
      // Production mode - return content for manual update
      return res.status(200).json({
        success: true,
        message: 'Production update content generated successfully',
        content: content,
        mode: 'production',
        manualUpdate: true,
        instructions: [
          '1. Copy the generated content above',
          '2. Update src/data/apiData.js with the new content',
          '3. Commit and push to GitHub:',
          '   git add src/data/apiData.js',
          '   git commit -m "Update API data from admin panel"',
          '   git push origin main'
        ]
      });
    } else {
      // Download mode (for production)
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
} 