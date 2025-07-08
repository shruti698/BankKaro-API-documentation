import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { updatedEndpoints, autoCommit = true } = req.body;

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
    
    // Write to apiData.js
    const apiDataPath = path.join(process.cwd(), 'src', 'data', 'apiData.js');
    fs.writeFileSync(apiDataPath, content);

    let result = { success: true, message: 'Changes saved to apiData.js' };

    // Commit and push if autoCommit is enabled
    if (autoCommit) {
      try {
        // Add the file to git
        execSync('git add src/data/apiData.js', { cwd: process.cwd() });
        
        // Commit the changes
        const commitMessage = `Update API documentation - ${new Date().toISOString()}`;
        execSync(`git commit -m "${commitMessage}"`, { cwd: process.cwd() });
        
        // Push to remote
        execSync('git push origin main', { cwd: process.cwd() });
        
        result.message += ' and committed to production';
        result.committed = true;
      } catch (gitError) {
        console.error('Git operation failed:', gitError);
        result.message += ' but git commit failed';
        result.gitError = gitError.message;
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error updating apiData.js:', error);
    return res.status(500).json({ 
      error: 'Failed to update apiData.js',
      details: error.message 
    });
  }
} 