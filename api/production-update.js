export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { updatedEndpoints } = req.body;

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

    // For now, we'll provide the content for manual update
    // This is the most reliable approach for production updates
    return res.status(200).json({
      success: true,
      message: 'Production update content generated successfully',
      content: content,
      instructions: [
        '1. Copy the generated content below',
        '2. Update src/data/apiData.js with the new content',
        '3. Commit and push to GitHub:',
        '   git add src/data/apiData.js',
        '   git commit -m "Update API data from admin panel"',
        '   git push origin main'
      ],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating production update:', error);
    return res.status(500).json({ 
      error: 'Failed to generate production update',
      details: error.message 
    });
  }
} 