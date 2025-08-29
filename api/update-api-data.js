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
      // Production mode - commit and push to GitHub
      try {
        const githubToken = process.env.GITHUB_TOKEN;
        const repoOwner = process.env.GITHUB_REPO_OWNER || 'your-username';
        const repoName = process.env.GITHUB_REPO_NAME || 'BankKaro-API-documentation';
        
        if (!githubToken) {
          // If no GitHub token, provide instructions for manual update
          return res.status(200).json({
            success: true,
            message: 'Production update requires GitHub setup. Please manually commit the changes.',
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
        }

        // Get the current file SHA (required for GitHub API)
        const getFileResponse = await fetch(
          `https://api.github.com/repos/${repoOwner}/${repoName}/contents/src/data/apiData.js`,
          {
            headers: {
              'Authorization': `token ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        );

        let currentSha = null;
        if (getFileResponse.ok) {
          const fileData = await getFileResponse.json();
          currentSha = fileData.sha;
        }

        // Create the commit
        const commitData = {
          message: `Update API data from admin panel - ${new Date().toISOString()}`,
          content: Buffer.from(content).toString('base64'),
          branch: 'main'
        };

        if (currentSha) {
          commitData.sha = currentSha;
        }

        const commitResponse = await fetch(
          `https://api.github.com/repos/${repoOwner}/${repoName}/contents/src/data/apiData.js`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `token ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(commitData)
          }
        );

        if (commitResponse.ok) {
          const commitResult = await commitResponse.json();
          return res.status(200).json({
            success: true,
            message: 'Changes successfully committed to GitHub and will be deployed automatically',
            mode: 'production',
            deployed: true,
            commitSha: commitResult.commit.sha
          });
        } else {
          const errorData = await commitResponse.json();
          console.error('GitHub API error:', errorData);
          return res.status(500).json({
            success: false,
            message: 'Failed to commit to GitHub',
            error: errorData.message || 'GitHub API error',
            mode: 'production'
          });
        }
        
      } catch (prodError) {
        console.error('Production update failed:', prodError.message);
        return res.status(500).json({
          success: false,
          message: 'Failed to process production update',
          error: prodError.message,
          mode: 'production'
        });
      }
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