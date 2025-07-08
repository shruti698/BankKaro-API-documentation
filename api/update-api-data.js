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
    
    // Return the generated content instead of writing to file
    // The frontend will handle downloading and saving the file
    return res.status(200).json({
      success: true,
      message: 'Generated updated apiData.js content',
      content: content,
      autoCommit: autoCommit
    });
  } catch (error) {
    console.error('Error generating apiData.js content:', error);
    return res.status(500).json({ 
      error: 'Failed to generate apiData.js content',
      details: error.message 
    });
  }
} 