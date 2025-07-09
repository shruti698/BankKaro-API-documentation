// Vercel serverless function to proxy API calls
// This solves CORS issues by making server-side requests

export default async function handler(req, res) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, partner-token');
    res.status(200).end();
    return;
  }

  const { path } = req.query;
  
  if (!path || path.length === 0) {
    return res.status(400).json({ error: 'No path provided' });
  }

  // Determine target URL based on path
  let targetUrl;
  const pathString = path.join('/');
  
  // Map different API endpoints to their respective base URLs
  if (pathString.startsWith('partner/')) {
    // Partner APIs
    targetUrl = `https://uat-platform.bankkaro.com/${pathString}`;
  } else if (pathString.startsWith('cardgenius/')) {
    // Card Genius APIs
    targetUrl = `https://uat-platform.bankkaro.com/${pathString}`;
  } else if (pathString.startsWith('v1/')) {
    // V1 APIs
    targetUrl = `https://api.bankkaro.com/${pathString}`;
  } else {
    // Default to UAT platform
    targetUrl = `https://uat-platform.bankkaro.com/${pathString}`;
  }

  try {
    // Prepare headers for the target API
    const headers = {
      'Content-Type': 'application/json',
    };

    // Forward relevant headers
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }
    if (req.headers['partner-token']) {
      headers['partner-token'] = req.headers['partner-token'];
    }
    if (req.headers['x-api-key']) {
      headers['x-api-key'] = req.headers['x-api-key'];
    }

    // Make the request to the target API
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    // Get the response data
    const data = await response.json();

    // Set CORS headers for the response
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, partner-token');

    // Return the response with the same status code
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    
    // Set CORS headers even for errors
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, partner-token');
    
    res.status(500).json({ 
      error: 'Proxy request failed', 
      message: error.message,
      targetUrl 
    });
  }
} 