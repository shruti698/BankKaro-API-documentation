// Vercel serverless function to proxy API calls
// This solves CORS issues by making server-side requests

export default async function handler(req, res) {
  // Handle CORS preflight requests
  // if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, partner-token');
    // res.status(200).end();
    // return;
  // }

  const { path } = req.query;
  
  if (!path || path.length === 0) {
    console.error('❌ Proxy Error: No path provided');
    return res.status(400).json({ error: 'No path provided' });
  }

  // Determine target URL based on path
  let targetUrl;
  const pathString = path.join('/');
  
  console.log('🔍 Proxy Debug Info:', {
    method: req.method,
    path: pathString,
    headers: req.headers,
    body: req.body,
    timestamp: new Date().toISOString()
  });
  
  // Map different API endpoints to their respective base URLs
  if (pathString === 'partner/token') {
    // Special case: Partner token endpoint - UAT uses /partner/token
    targetUrl = `https://uat-platform.bankkaro.com/partner/token`;
  } else if (pathString === 'partner/api/partner-token') {
    // Special case: Partner token endpoint - UAT uses /partner/token, not /partner/api/partner-token
    targetUrl = `https://uat-platform.bankkaro.com/partner/token`;
  } else if (pathString.startsWith('partner/api/')) {
    // Partner APIs (e.g., /partner/api/partner-auth, /partner/api/lead-details)
    targetUrl = `https://uat-platform.bankkaro.com/${pathString}`;
  } else if (pathString.startsWith('partner/cardgenius/')) {
    // Partner Card Genius APIs (e.g., /partner/cardgenius/banks, /partner/cardgenius/cards)
    targetUrl = `https://uat-platform.bankkaro.com/${pathString}`;
  } else if (pathString.startsWith('sp/api/cardgenius/')) {
    // SP Card Genius APIs (e.g., /sp/api/cardgenius/initialize-bundle)
    targetUrl = `https://uat-platform.bankkaro.com/${pathString}`;
  } else if (pathString.startsWith('cardgenius/')) {
    // Direct Card Genius APIs (e.g., /cardgenius/initial-data, /cardgenius/categories)
    targetUrl = `https://api.bankkaro.com/${pathString}`;
  } else if (pathString.startsWith('v1/')) {
    // V1 APIs (e.g., /v1/redemptions/calculate, /v1/cards/omni)
    targetUrl = `https://api.bankkaro.com/${pathString}`;
  } else {
    // Default to UAT platform for any other endpoints
    targetUrl = `https://uat-platform.bankkaro.com/${pathString}`;
  }

  console.log('🎯 Target URL:', targetUrl);

  try {
    // Prepare headers for the target API
    const headers = {
      'Content-Type': 'application/json',
    };

    // Forward relevant headers
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
      console.log('🔑 Forwarding Authorization header');
    }
    if (req.headers['partner-token']) {
      headers['partner-token'] = req.headers['partner-token'];
      console.log('🔑 Forwarding partner-token header');
    }
    if (req.headers['x-api-key']) {
      headers['x-api-key'] = req.headers['x-api-key'];
      console.log('🔑 Forwarding x-api-key header');
    }

    console.log('📤 Request Details:', {
      method: req.method,
      targetUrl,
      headers,
      body: req.body
    });

    // Make the request to the target API
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    console.log('📥 Response Details:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    // Get the response data
    let data;
    try {
      data = await response.json();
      console.log('📥 Response Data:', data);
    } catch (jsonError) {
      console.error('❌ JSON Parse Error:', jsonError);
      data = { error: 'Invalid JSON response', rawResponse: await response.text() };
    }

    // Set CORS headers for the response
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, partner-token');

    // Return the response with the same status code
    res.status(response.status).json(data);
    
    console.log('✅ Proxy request completed successfully');
  } catch (error) {
    console.error('💥 Proxy Error:', {
      error: error.message,
      stack: error.stack,
      targetUrl,
      method: req.method,
      path: pathString,
      timestamp: new Date().toISOString()
    });
    
    // Set CORS headers even for errors
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, partner-token');
    
    res.status(500).json({ 
      error: 'Proxy request failed', 
      message: error.message,
      targetUrl,
      debugInfo: {
        path: pathString,
        method: req.method,
        timestamp: new Date().toISOString()
      }
    });
  }
} 