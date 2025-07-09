export default async function handler(req, res) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, partner-token, x-api-key');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { targetUrl, method, headers, body, environment } = req.body;

    if (!targetUrl) {
      return res.status(400).json({ error: 'targetUrl is required' });
    }

    // Validate the target URL to prevent abuse
    const allowedDomains = [
      'api.bankkaro.com',
      'uat-platform.bankkaro.com',
      'prod-platform.bankkaro.com',
      'bk-api.bankkaro.com',
      'stg-api.bankkaro.com'
    ];

    const url = new URL(targetUrl);
    if (!allowedDomains.includes(url.hostname)) {
      return res.status(400).json({ error: 'Invalid target domain' });
    }

    // Make the API call server-side
    const fetchOptions = {
      method: method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (body && method !== 'GET') {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.text();

    // Try to parse as JSON, fallback to text
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch {
      parsedData = data;
    }

    // Return the response with original status and headers
    res.status(response.status).json({
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data: parsedData
    });

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
} 