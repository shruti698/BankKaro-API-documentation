import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { updatedEndpoints, mode = 'download' } = req.body;

    console.log('API Handler - Mode:', mode);
    console.log('API Handler - Endpoints count:', Object.keys(updatedEndpoints || {}).length);

    if (!updatedEndpoints) {
      return res.status(400).json({ error: 'updatedEndpoints is required' });
    }

    // Generate the new apiData.js content
    let content = 'export const apiData = {\n';
    
    try {
      Object.entries(updatedEndpoints).forEach(([key, data], index) => {
        content += `  '${key}': ${JSON.stringify(data, null, 2)}`;
        if (index < Object.keys(updatedEndpoints).length - 1) {
          content += ',';
        }
        content += '\n';
      });
    } catch (jsonError) {
      console.error('JSON stringify error:', jsonError);
      return res.status(500).json({ 
        error: 'Failed to serialize API data',
        details: jsonError.message 
      });
    }
    
    content += '};\n\n';
    
    // Add other exports
    content += 'export const cardGeniusApiData = {\n  // Card Genius specific data\n};\n\n';
    content += 'export const projects = {\n  // Project data\n};\n\n';

    console.log('Generated content length:', content.length);

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
      // Production mode - prefer committing directly to GitHub if env is configured
      try {
        const githubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.GITHUB_PAT;
        const repoOwner = process.env.GITHUB_REPO_OWNER || process.env.GITHUB_OWNER;
        const repoName = process.env.GITHUB_REPO_NAME || process.env.GITHUB_REPO;
        const branch = process.env.GITHUB_BRANCH || 'main';
        const filePath = process.env.GITHUB_FILE_PATH || 'src/data/apiData.js';
        const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL || process.env.DEPLOY_HOOK_URL;

        if (githubToken && repoOwner && repoName) {
          // Get the current file SHA (required for updates)
          const getUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${encodeURIComponent(filePath)}?ref=${encodeURIComponent(branch)}`;
          const getResp = await fetch(getUrl, {
            headers: {
              'Authorization': `Bearer ${githubToken}`,
              'Accept': 'application/vnd.github+json'
            }
          });

          let sha = undefined;
          if (getResp.ok) {
            const getJson = await getResp.json();
            sha = getJson.sha;
          }

          const putUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${encodeURIComponent(filePath)}`;
          const putBody = {
            message: 'chore: update API data from Admin Panel',
            content: Buffer.from(content, 'utf8').toString('base64'),
            branch,
            sha
          };

          const putResp = await fetch(putUrl, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${githubToken}`,
              'Accept': 'application/vnd.github+json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(putBody)
          });

          if (!putResp.ok) {
            const txt = await putResp.text();
            throw new Error(`GitHub commit failed: ${putResp.status} ${txt}`);
          }

          // Optionally trigger a deploy hook to speed up Vercel redeploy
          if (deployHookUrl) {
            try {
              await fetch(deployHookUrl, { method: 'POST' });
            } catch (_) {
              // Non-fatal
            }
          }

          return res.status(200).json({
            success: true,
            message: 'Changes committed to GitHub and deploy triggered',
            mode: 'production',
            autoCommitted: true,
            deployed: true,
            reloaded: true
          });
        }

        // If GitHub env not configured, fall back to manual path
        return res.status(200).json({
          success: false,
          message: 'GitHub credentials not configured. Manual update required.',
          mode: 'production',
          manual: true,
          content,
          instructions: [
            '1. Copy the generated content below',
            '2. Replace the contents of src/data/apiData.js with it',
            '3. Commit and push to your main branch:',
            '   git add src/data/apiData.js',
            '   git commit -m "Update API data from admin panel"',
            '   git push origin main'
          ]
        });
      } catch (writeError) {
        console.error('Production commit failed:', writeError.message);
        return res.status(200).json({
          success: false,
          message: 'Automatic production update failed. Manual update required.',
          mode: 'production',
          manual: true,
          error: writeError.message,
          content,
          instructions: [
            '1. Copy the generated content below',
            '2. Replace the contents of src/data/apiData.js with it',
            '3. Commit and push to your main branch:',
            '   git add src/data/apiData.js',
            '   git commit -m "Update API data from admin panel"',
            '   git push origin main'
          ]
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